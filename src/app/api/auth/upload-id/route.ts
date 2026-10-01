import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/apiResponse';

// POST /api/auth/upload-id — upload college ID card (non-Amrita students)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const formData = await req.formData();
    const file = formData.get('id_card') as File | null;

    if (!file) return error('No file provided');

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return error('Only JPG, PNG, and PDF files are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      return error('File size must be less than 5MB');
    }

    // -------------------------------------------------------
    // PRODUCTION: Upload to AWS S3
    // const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    // const s3 = new S3Client({ region: process.env.AWS_REGION });
    // const key = `id-cards/${session.userId}/${Date.now()}-${file.name}`;
    // const bytes = await file.arrayBuffer();
    // await s3.send(new PutObjectCommand({
    //   Bucket: process.env.AWS_S3_BUCKET,
    //   Key: key,
    //   Body: Buffer.from(bytes),
    //   ContentType: file.type,
    // }));
    // const idCardUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    // -------------------------------------------------------

    // MOCK: store placeholder URL in dev
    const idCardUrl = `/uploads/id-cards/${session.userId}-${Date.now()}`;

    await db.query(
      `UPDATE users
       SET id_card_url = $1, verification_status = 'pending', updated_at = NOW()
       WHERE id = $2`,
      [idCardUrl, session.userId]
    );

    return success({
      message: 'ID card uploaded. Your account will be verified within 24 hours.',
      id_card_url: idCardUrl,
    });
  } catch (err) {
    console.error('ID upload error:', err);
    return serverError();
  }
}
