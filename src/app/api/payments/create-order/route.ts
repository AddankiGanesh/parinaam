import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { success, error, unauthorized, serverError } from '@/lib/apiResponse';
import crypto from 'crypto';

// POST /api/payments/create-order — create Razorpay order
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) return unauthorized();

    const { type, event_id, registration_id } = await req.json();
    if (!type || !['platform_fee', 'event_fee'].includes(type)) {
      return error('Invalid payment type');
    }

    let amount = 0;
    let description = '';

    if (type === 'platform_fee') {
      // Get platform fee from config
      const configResult = await db.query(
        `SELECT value FROM platform_config WHERE key = 'platform_fee'`
      );
      amount = parseInt(configResult.rows[0]?.value || '99') * 100; // in paise
      description = 'Parinaam 2026 Platform Registration Fee';

      // Check if already paid
      const userResult = await db.query(
        `SELECT platform_fee_paid FROM users WHERE id = $1`,
        [session.userId]
      );
      if (userResult.rows[0]?.platform_fee_paid) {
        return error('Platform fee already paid', 409);
      }
    } else if (type === 'event_fee') {
      if (!event_id) return error('Event ID is required');
      const eventResult = await db.query(
        `SELECT name, fee FROM events WHERE id = $1`,
        [event_id]
      );
      if (eventResult.rows.length === 0) return error('Event not found', 404);
      amount = eventResult.rows[0].fee * 100; // in paise
      description = `Event Registration: ${eventResult.rows[0].name}`;
    }

    // Mock Razorpay order (replace with actual Razorpay SDK call in production)
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // Save payment record
    const paymentResult = await db.query(
      `INSERT INTO payments (user_id, type, event_id, registration_id, amount, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'created') RETURNING id`,
      [session.userId, type, event_id || null, registration_id || null, amount, mockOrderId]
    );

    return success({
      order_id: mockOrderId,
      amount,
      currency: 'INR',
      description,
      payment_db_id: paymentResult.rows[0].id,
      // In production, return actual Razorpay order object
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    });
  } catch (err) {
    console.error('Create order error:', err);
    return serverError();
  }
}
