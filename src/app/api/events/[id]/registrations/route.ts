import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// GET /api/events/[id]/registrations — club admin views registrations for their event
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role === 'student') return forbidden();

    // Verify club ownership
    const eventResult = await db.query('SELECT club_id FROM events WHERE id = $1', [id]);
    if (eventResult.rows.length === 0) return error('Event not found', 404);
    if (session.role === 'club_admin' && session.clubId !== eventResult.rows[0].club_id) {
      return forbidden('You can only view registrations for your club events');
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE r.event_id = $1';
    const queryParams: unknown[] = [id];
    let idx = 2;

    if (status) {
      whereClause += ` AND r.status = $${idx}`;
      queryParams.push(status);
      idx++;
    }
    if (search) {
      whereClause += ` AND (u.full_name ILIKE $${idx} OR u.email ILIKE $${idx} OR u.roll_number ILIKE $${idx})`;
      queryParams.push(`%${search}%`);
      idx++;
    }

    const [regsResult, countResult] = await Promise.all([
      db.query(
        `SELECT 
          r.id, r.status, r.payment_status, r.amount_paid, r.team_name,
          r.team_members, r.registered_at, r.confirmed_at,
          u.id as user_id, u.full_name, u.email, u.phone,
          u.college_name, u.roll_number, u.department, u.year_of_study,
          u.is_amrita_student, u.qr_token,
          a.id as attendance_id, a.scanned_at as checked_in_at
         FROM registrations r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN attendance a ON a.user_id = u.id AND a.event_id = r.event_id AND a.status = 'SUCCESS'
         ${whereClause}
         ORDER BY r.registered_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...queryParams, limit, offset]
      ),
      db.query(`SELECT COUNT(*) FROM registrations r JOIN users u ON r.user_id = u.id ${whereClause}`, queryParams)
    ]);

    return success({
      registrations: regsResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    });
  } catch (err) {
    console.error('Get registrations error:', err);
    return serverError();
  }
}
