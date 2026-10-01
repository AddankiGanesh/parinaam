import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// POST /api/attendance/scan — organizer scans QR code
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role === 'student') return forbidden('Only organizers can scan QR codes');

    const { qr_token, event_id } = await req.json();
    if (!qr_token || !event_id) return error('QR token and event ID are required');

    // Find user by QR token
    const userResult = await db.query(
      `SELECT id, full_name, email, college_name, verification_status FROM users WHERE qr_token = $1`,
      [qr_token]
    );
    if (userResult.rows.length === 0) {
      return error('Invalid QR code', 404);
    }
    const scannedUser = userResult.rows[0];

    // Check if organizer has access to this event
    if (session.role === 'club_admin') {
      const eventResult = await db.query(
        `SELECT club_id FROM events WHERE id = $1`,
        [event_id]
      );
      if (eventResult.rows.length === 0) return error('Event not found', 404);
      if (session.clubId !== eventResult.rows[0].club_id) {
        return forbidden('You can only scan attendance for your club events');
      }
    }

    // Check registration
    const regResult = await db.query(
      `SELECT id, status, payment_status FROM registrations 
       WHERE user_id = $1 AND event_id = $2`,
      [scannedUser.id, event_id]
    );

    if (regResult.rows.length === 0) {
      // Log failed attempt
      await db.query(
        `INSERT INTO attendance (user_id, event_id, scanned_by, status) VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [scannedUser.id, event_id, session.userId, 'NOT_REGISTERED']
      );
      return error(`${scannedUser.full_name} is NOT registered for this event`, 400);
    }

    const registration = regResult.rows[0];

    // Check payment
    if (registration.payment_status !== 'paid' && registration.status !== 'CONFIRMED') {
      return error(`${scannedUser.full_name} has not completed payment for this event`, 400);
    }

    // Check for duplicate attendance
    const existingAttendance = await db.query(
      `SELECT id, scanned_at FROM attendance 
       WHERE user_id = $1 AND event_id = $2 AND status = 'SUCCESS'`,
      [scannedUser.id, event_id]
    );

    if (existingAttendance.rows.length > 0) {
      return success({
        status: 'DUPLICATE',
        message: `${scannedUser.full_name} already checked in at ${existingAttendance.rows[0].scanned_at}`,
        student: {
          name: scannedUser.full_name,
          email: scannedUser.email,
          college: scannedUser.college_name,
        },
        first_check_in: existingAttendance.rows[0].scanned_at,
      });
    }

    // Mark attendance
    await db.query(
      `INSERT INTO attendance (user_id, event_id, registration_id, scanned_by, status)
       VALUES ($1, $2, $3, $4, 'SUCCESS')`,
      [scannedUser.id, event_id, registration.id, session.userId]
    );

    return success({
      status: 'SUCCESS',
      message: `✅ ${scannedUser.full_name} checked in successfully!`,
      student: {
        name: scannedUser.full_name,
        email: scannedUser.email,
        college: scannedUser.college_name,
        is_amrita: scannedUser.verification_status === 'verified',
      },
    });
  } catch (err) {
    console.error('Attendance scan error:', err);
    return serverError();
  }
}

// GET /api/attendance/scan?event_id= — get attendance list
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role === 'student') return forbidden();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('event_id');
    if (!eventId) return error('event_id is required');

    const result = await db.query(
      `SELECT 
        a.id, a.scanned_at, a.status,
        u.full_name, u.email, u.college_name, u.roll_number,
        u.is_amrita_student
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE a.event_id = $1 AND a.status = 'SUCCESS'
       ORDER BY a.scanned_at DESC`,
      [eventId]
    );

    return success({ attendance: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('Get attendance error:', err);
    return serverError();
  }
}
