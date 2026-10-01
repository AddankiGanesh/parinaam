'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Loader2, IndianRupee, Shield } from 'lucide-react';
import { useRequireAuth } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';

export default function PaymentPage() {
  const { user } = useRequireAuth();
  const { refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const registrationId = searchParams.get('registration_id');
  const eventId        = searchParams.get('event_id');
  const type           = registrationId ? 'event_fee' : 'platform_fee';

  const [info, setInfo]       = useState<{ amount: number; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying,  setPaying]  = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!user) return;
    if (type === 'platform_fee') {
      // Fetch platform fee from config
      fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'platform_fee' }),
      }).then(r => r.json()).then(d => {
        if (d.success) setInfo({ amount: d.data.amount / 100, description: d.data.description });
        else if (d.error?.includes('already paid')) {
          router.push('/dashboard');
        }
      }).finally(() => setLoading(false));
    } else if (eventId) {
      // Get event details for amount display
      fetch(`/api/events/${eventId}`).then(r => r.json()).then(d => {
        if (d.success) setInfo({ amount: d.data.event.fee, description: `Registration: ${d.data.event.name}` });
      }).finally(() => setLoading(false));
    }
  }, [user, type, eventId, router]);

  const handlePay = async () => {
    if (!info) return;
    setPaying(true); setError('');

    // Step 1: Create order
    const orderRes = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, event_id: eventId, registration_id: registrationId }),
    });
    const orderData = await orderRes.json();
    if (!orderData.success) { setError(orderData.error || 'Could not initiate payment'); setPaying(false); return; }

    // Step 2: In production, open Razorpay checkout modal here
    // For now, simulate successful payment (mock mode)
    const verifyRes = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_db_id: orderData.data.payment_db_id,
        razorpay_order_id: orderData.data.order_id,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'mock_signature',
        type,
        event_id: eventId,
        registration_id: registrationId,
      }),
    });
    const verifyData = await verifyRes.json();
    setPaying(false);

    if (verifyData.success) {
      await refreshUser();
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    } else {
      setError(verifyData.error || 'Payment verification failed');
    }
  };

  if (!user || loading) return (
    <div className="min-h-screen bg-[#05030a] pt-28 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-purple-500" />
    </div>
  );

  if (done) return (
    <div className="min-h-screen bg-[#05030a] pt-28 flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-slate-400">{type === 'platform_fee' ? 'Platform access unlocked. You can now register for events!' : 'Registration confirmed!'}</p>
        <p className="text-slate-600 text-sm mt-2">Redirecting to dashboard…</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05030a] pt-28 pb-16 flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <CreditCard size={26} className="text-purple-400" />
            </div>
            <h1 className="text-xl font-bold text-white">
              {type === 'platform_fee' ? 'Platform Registration' : 'Event Registration Payment'}
            </h1>
            {info && <p className="text-slate-400 text-sm mt-1">{info.description}</p>}
          </div>

          {/* Amount */}
          {info && (
            <div className="bg-white/3 border border-white/10 rounded-xl p-5 mb-6 text-center">
              <p className="text-slate-500 text-sm mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-white">₹{info.amount}</p>
              {type === 'platform_fee' && (
                <p className="text-slate-600 text-xs mt-2">One-time fee · Unlocks access to all event registrations</p>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Mock notice */}
          <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-400/80 text-xs flex items-start gap-2">
            <Shield size={13} className="shrink-0 mt-0.5" />
            <span>Running in <strong>test mode</strong>. Real Razorpay payment gateway will be used in production. No actual charge will be made.</span>
          </div>

          <button onClick={handlePay} disabled={paying || !info}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/30">
            {paying ? (
              <><Loader2 size={18} className="animate-spin" /> Processing…</>
            ) : (
              <><IndianRupee size={18} /> {type === 'platform_fee' ? 'Pay & Unlock Platform Access' : `Pay ₹${info?.amount}`}</>
            )}
          </button>

          <p className="text-slate-600 text-xs text-center mt-3">
            Secured by Razorpay · 256-bit SSL encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
