'use client';

import React from 'react';
import { useFest } from '../../context/FestContext';
import { DigitalPass } from '../../components/pass/DigitalPass';
import Link from 'next/link';
import { ArrowLeft, Ticket } from 'lucide-react';

export default function PassPage() {
  const { participant, pass, registrations } = useFest();

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>

        <span className="text-xs font-mono text-slate-400">
          STATUS: <strong className="text-emerald-400">PASS ACTIVE</strong>
        </span>
      </div>

      {participant && pass ? (
        <DigitalPass
          participant={participant}
          pass={pass}
          registrations={registrations}
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <Ticket className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">No Active Pass Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You haven't registered for Parinaam 2026 yet, or your pass session expired.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-fest-brand"
            >
              Register For Pass Now
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm"
            >
              Find Existing Pass
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
