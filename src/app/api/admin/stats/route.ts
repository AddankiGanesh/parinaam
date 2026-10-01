import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// GET /api/admin/stats — super admin dashboard overview
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const [
      usersCount,
      pendingVerification,
      totalEvents,
      totalRegistrations,
      confirmedRegistrations,
      totalRevenue,
      clubStats,
      recentRegistrations,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM users WHERE role = 'student'`),
      db.query(`SELECT COUNT(*) FROM users WHERE verification_status = 'pending' AND role = 'student'`),
      db.query(`SELECT COUNT(*) FROM events WHERE status != 'cancelled'`),
      db.query(`SELECT COUNT(*) FROM registrations`),
      db.query(`SELECT COUNT(*) FROM registrations WHERE status = 'CONFIRMED'`),
      db.query(`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'paid'`),
      db.query(`
        SELECT c.name, c.color, c.slug,
          COUNT(e.id) FILTER (WHERE e.status = 'published') as published_events,
          COUNT(r.id) as total_registrations
        FROM clubs c
        LEFT JOIN events e ON e.club_id = c.id
        LEFT JOIN registrations r ON r.event_id = e.id AND r.status = 'CONFIRMED'
        GROUP BY c.id, c.name, c.color, c.slug
        ORDER BY total_registrations DESC
      `),
      db.query(`
        SELECT r.id, r.registered_at, r.status,
          u.full_name, u.college_name,
          e.name as event_name,
          c.name as club_name
        FROM registrations r
        JOIN users u ON r.user_id = u.id
        JOIN events e ON r.event_id = e.id
        JOIN clubs c ON e.club_id = c.id
        ORDER BY r.registered_at DESC
        LIMIT 10
      `),
    ]);

    return success({
      overview: {
        total_students: parseInt(usersCount.rows[0]?.count || '0'),
        pending_verification: parseInt(pendingVerification.rows[0]?.count || '0'),
        total_events: parseInt(totalEvents.rows[0]?.count || '0'),
        total_registrations: parseInt(totalRegistrations.rows[0]?.count || '0'),
        confirmed_registrations: parseInt(confirmedRegistrations.rows[0]?.count || '0'),
        total_revenue_paise: parseInt(totalRevenue.rows[0]?.total || '0'),
        total_revenue_inr: Math.round(parseInt(totalRevenue.rows[0]?.total || '0') / 100),
      },
      club_stats: clubStats.rows,
      recent_registrations: recentRegistrations.rows,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return serverError();
  }
}
