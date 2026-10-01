import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// GET /api/admin/users — all users with filters
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden('Super admin access required');

    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const verStatus = searchParams.get('verification_status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: unknown[] = [];
    let idx = 1;

    if (role) { where += ` AND u.role = $${idx}`; params.push(role); idx++; }
    if (verStatus) { where += ` AND u.verification_status = $${idx}`; params.push(verStatus); idx++; }
    if (search) {
      where += ` AND (u.full_name ILIKE $${idx} OR u.email ILIKE $${idx} OR u.college_name ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }

    const [usersResult, countResult] = await Promise.all([
      db.query(
        `SELECT 
          u.id, u.email, u.full_name, u.phone, u.role,
          u.college_name, u.is_amrita_student, u.roll_number,
          u.department, u.year_of_study, u.city,
          u.id_card_url, u.verification_status, u.verification_note,
          u.platform_fee_paid, u.pass_type, u.email_verified,
          u.created_at,
          c.name as club_name,
          (SELECT COUNT(*) FROM registrations r WHERE r.user_id = u.id AND r.status = 'CONFIRMED') as confirmed_registrations
         FROM users u
         LEFT JOIN clubs c ON u.club_id = c.id
         ${where}
         ORDER BY u.created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      ),
      db.query(`SELECT COUNT(*) FROM users u ${where}`, params),
    ]);

    return success({
      users: usersResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page, limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
      },
    });
  } catch (err) {
    console.error('Admin get users error:', err);
    return serverError();
  }
}
