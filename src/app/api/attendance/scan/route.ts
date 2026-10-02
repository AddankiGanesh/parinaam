import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// POST /api/attendance/scan — organizer scans QR code for attendance
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role === 'student') return forbidden('Only organizers can scan QR codes');

    const { qr_token, event_id } = await req.json();
    if (!qr_token || !event_id) return error('QR token and event ID are required', 400);

    // Verify event exists & club admin permission
    const eventResult = await db.query(
      `SELECT id, name, club_id FROM events WHERE id = $1`,
      [event_id]
    );
    if (eventResult.rows.length === 0) return error('Event not found', 404);
    const targetEvent = eventResult.rows[0];

    if (session.role === 'club_admin' && session.clubId !== targetEvent.club_id) {
      return forbidden('You are not authorized to manage attendance for another club\'s events.');
    }

    // Find student by qr_token OR user id OR registration id
    const userResult = await db.query(
      `SELECT id, full_name, email, college_name, roll_number, verification_status 
       FROM users 
       WHERE qr_token = $1 OR id::text = $1`,
      [qr_token.trim()]
    );

    let scannedUser = userResult.rows[0];

    // If not found by user QR token, check if token is a registration_id
    if (!scannedUser) {
      const regById = await db.query(
        `SELECT r.event_id, u.id, u.full_name, u.email, u.college_name, u.roll_number, u.verification_status 
         FROM registrations r
         JOIN users u ON r.user_id = u.id
         WHERE r.id::text = $1`,
        [qr_token.trim()]
      );
      if (regById.rows.length > 0) {
        if (regById.rows[0].event_id !== event_id) {
          return error('Registration is not valid for this event.', 400);
        }
        scannedUser = regById.rows[0];
      }
    }

    if (!scannedUser) {
      return error('Invalid registration or pass QR token', 404);
    }

    // Find registration for target event
    const regResult = await db.query(
      `SELECT id, status, payment_status, event_id FROM registrations 
       WHERE user_id = $1 AND event_id = $2`,
      [scannedUser.id, event_id]
    );

    if (regResult.rows.length === 0) {
      // Check if user is registered for any other event
      const otherReg = await db.query(
        `SELECT r.id, e.name as event_name 
         FROM registrations r
         JOIN events e ON r.event_id = e.id
         WHERE r.user_id = $1 LIMIT 1`,
        [scannedUser.id]
      );

      if (otherReg.rows.length > 0) {
        return error(`Registration is not valid for this event. Student is registered for "${otherReg.rows[0].event_name}".`, 400);
      }

      return error(`${scannedUser.full_name} is NOT registered for this event`, 400);
    }

    const registration = regResult.rows[0];

    // Verify registration eligibility (Must be CONFIRMED)
    if (registration.status !== 'CONFIRMED') {
      return error(
        `Registration status is ${registration.status}. Only CONFIRMED registrations can check in.`,
        400
      );
    }

    // Check for duplicate attendance
    const existingAttendance = await db.query(
      `SELECT id, scanned_at FROM attendance 
       WHERE user_id = $1 AND event_id = $2 AND status = 'SUCCESS'`,
      [scannedUser.id, event_id]
    );

    if (existingAttendance.rows.length > 0) {
      const checkInTimeStr = new Date(existingAttendance.rows[0].scanned_at).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return success({
        duplicate: true,
        status: 'DUPLICATE',
        message: `Already checked in at ${checkInTimeStr}`,
        student: {
          name: scannedUser.full_name,
          email: scannedUser.email,
          college: scannedUser.college_name,
          roll_number: scannedUser.roll_number,
        },
        first_check_in: existingAttendance.rows[0].scanned_at,
      });
    }

    // Record attendance in PostgreSQL
    await db.query(
      `INSERT INTO attendance (user_id, event_id, registration_id, scanned_by, scanned_at, status)
       VALUES ($1, $2, $3, $4, NOW(), 'SUCCESS')`,
      [scannedUser.id, event_id, registration.id, session.userId]
    );

    return success({
      duplicate: false,
      status: 'SUCCESS',
      message: `✅ ${scannedUser.full_name} checked in successfully!`,
      student: {
        name: scannedUser.full_name,
        email: scannedUser.email,
        college: scannedUser.college_name,
        roll_number: scannedUser.roll_number,
        is_amrita: scannedUser.verification_status === 'verified',
      },
    });
  } catch (err) {
    console.error('Attendance scan error:', err);
    return serverError();
  }
}

// GET /api/attendance/scan?event_id= — get attendance stats and attendee list
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role === 'student') return forbidden();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('event_id');
    if (!eventId) return error('event_id parameter is required', 400);

    // Verify club permission
    const eventResult = await db.query(
      `SELECT id, name, club_id FROM events WHERE id = $1`,
      [eventId]
    );
    if (eventResult.rows.length === 0) return error('Event not found', 404);
    const targetEvent = eventResult.rows[0];

    if (session.role === 'club_admin' && session.clubId !== targetEvent.club_id) {
      return forbidden('You are not authorized to view attendance for another club\'s events.');
    }

    // Get attendance stats from PostgreSQL
    const [confirmedRes, checkedInRes, listRes] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM registrations WHERE event_id = $1 AND status = 'CONFIRMED'`, [eventId]),
      db.query(`SELECT COUNT(*) FROM attendance WHERE event_id = $1 AND status = 'SUCCESS'`, [eventId]),
      db.query(
        `SELECT 
          r.id as registration_id, r.status as registration_status, r.payment_status, r.team_name,
          u.id as user_id, u.full_name, u.email, u.college_name, u.roll_number, u.phone,
          a.id as attendance_id, a.scanned_at as checked_in_at
         FROM registrations r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN attendance a ON a.user_id = u.id AND a.event_id = r.event_id AND a.status = 'SUCCESS'
         WHERE r.event_id = $1
         ORDER BY a.scanned_at DESC NULLS LAST, r.registered_at DESC`,
        [eventId]
      ),
    ]);

    const confirmedCount = parseInt(confirmedRes.rows[0]?.count || '0');
    const checkedInCount = parseInt(checkedInRes.rows[0]?.count || '0');
    const remainingCount = Math.max(0, confirmedCount - checkedInCount);
    const attendancePercentage = confirmedCount > 0 ? Math.round((checkedInCount / confirmedCount) * 100) : 0;

    return success({
      event: targetEvent,
      stats: {
        confirmedCount,
        checkedInCount,
        remainingCount,
        attendancePercentage,
      },
      attendees: listRes.rows,
      count: checkedInCount,
    });
  } catch (err) {
    console.error('Get attendance error:', err);
    return serverError();
  }
}
