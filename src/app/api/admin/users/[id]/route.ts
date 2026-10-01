import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, forbidden, serverError } from '@/lib/apiResponse';

// PATCH /api/admin/users/[id]/verify — approve or reject ID card
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const { status, note } = await req.json();
    if (!['verified', 'rejected'].includes(status)) {
      return error('Status must be verified or rejected');
    }

    await db.query(
      `UPDATE users
       SET verification_status = $1,
           verification_note   = $2,
           verified_at         = NOW(),
           verified_by         = $3
       WHERE id = $4`,
      [status, note || null, session.userId, id]
    );

    return success({ message: `User ${status} successfully` });
  } catch (err) {
    console.error('Verify user error:', err);
    return serverError();
  }
}

// PATCH /api/admin/users/[id]/role — change user role / assign club
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);
    if (!session) return unauthorized();
    if (session.role !== 'super_admin') return forbidden();

    const { role, club_id } = await req.json();
    if (!['student', 'club_admin', 'super_admin'].includes(role)) {
      return error('Invalid role');
    }

    await db.query(
      `UPDATE users SET role = $1, club_id = $2 WHERE id = $3`,
      [role, club_id || null, id]
    );

    return success({ message: 'User role updated' });
  } catch (err) {
    console.error('Update role error:', err);
    return serverError();
  }
}
