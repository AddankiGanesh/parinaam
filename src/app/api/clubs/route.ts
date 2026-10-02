export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, unauthorized, serverError } from '@/lib/apiResponse';

// GET /api/clubs — list all clubs (public)
export async function GET(req: NextRequest) {
  try {
    const result = await db.query(`
      SELECT 
        c.id, c.name, c.slug, c.description, c.color, c.icon_url, c.banner_url,
        COUNT(e.id) FILTER (WHERE e.status = 'published') as event_count
      FROM clubs c
      LEFT JOIN events e ON e.club_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return success({ clubs: result.rows });
  } catch (err) {
    console.error('Get clubs error:', err);
    return serverError();
  }
}
