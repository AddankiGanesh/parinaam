import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// GET /api/admin/config
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const result = await db.query(`SELECT key, value, description FROM platform_config ORDER BY key`);
    return success({ configs: result.rows });
  } catch (err) {
    console.error('Get config error:', err);
    return serverError();
  }
}

// PATCH /api/admin/config
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const { configs } = await req.json() as { configs: Record<string, string> };

    for (const [key, value] of Object.entries(configs)) {
      await db.query(
        `UPDATE platform_config SET value = $1, updated_at = NOW() WHERE key = $2`,
        [String(value), key]
      );
    }

    return success({ message: 'Settings updated' });
  } catch (err) {
    console.error('Update config error:', err);
    return serverError();
  }
}
