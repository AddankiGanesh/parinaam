import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/apiResponse';

// POST /api/payments/verify — verify payment after Razorpay callback
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const {
      payment_db_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type,
      event_id,
      registration_id,
    } = await req.json();

    // -------------------------------------------------------
    // PRODUCTION: verify Razorpay signature
    // const body = razorpay_order_id + '|' + razorpay_payment_id;
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(body)
    //   .digest('hex');
    // if (expectedSignature !== razorpay_signature) {
    //   return error('Payment verification failed — invalid signature', 400);
    // }
    // -------------------------------------------------------

    // MOCK: always verify in dev
    const isVerified = true;

    if (!isVerified) return error('Payment verification failed', 400);

    // Update payment record
    await db.query(
      `UPDATE payments
       SET razorpay_payment_id = $1, razorpay_signature = $2, status = 'paid', updated_at = NOW()
       WHERE id = $3 AND user_id = $4`,
      [razorpay_payment_id || `pay_mock_${Date.now()}`, razorpay_signature || 'mock', payment_db_id, session.userId]
    );

    if (type === 'platform_fee') {
      // Unlock platform access
      await db.query(
        `UPDATE users
         SET platform_fee_paid = TRUE,
             platform_payment_id = $1,
             platform_fee_paid_at = NOW()
         WHERE id = $2`,
        [razorpay_payment_id || `pay_mock_${Date.now()}`, session.userId]
      );
      return success({ message: 'Platform registration complete! You can now register for events.' });
    }

    if (type === 'event_fee' && registration_id) {
      // Confirm registration
      await db.query(
        `UPDATE registrations
         SET status = 'CONFIRMED',
             payment_status = 'paid',
             payment_id = $1,
             amount_paid = (SELECT amount FROM payments WHERE id = $2),
             confirmed_at = NOW()
         WHERE id = $3 AND user_id = $4`,
        [razorpay_payment_id || `pay_mock_${Date.now()}`, payment_db_id, registration_id, session.userId]
      );

      // Increment enrolled count
      await db.query(
        `UPDATE events SET enrolled = enrolled + 1
         WHERE id = (SELECT event_id FROM registrations WHERE id = $1)`,
        [registration_id]
      );

      return success({ message: 'Event registration confirmed!' });
    }

    return error('Unknown payment type', 400);
  } catch (err) {
    console.error('Payment verify error:', err);
    return serverError();
  }
}
