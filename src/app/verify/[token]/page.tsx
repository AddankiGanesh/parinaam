'use client';

import React, { use, useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, ShieldCheck, User, Building, Calendar, Ticket, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface VerifiedRecord {
  participant: {
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;
    year: string;
    participantId: string;
  };
  pass: {
    status: string;
    passType: string;
  };
  registrations: { id: string; eventName: string; clubName: string }[];
}

export default function VerifyTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [record, setRecord] = useState<VerifiedRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecord(data.data);
        } else {
          setRecord(null);
        }
      })
      .catch(err => {
        console.error('Verification fetch error:', err);
        setRecord(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return '***@***';
    return `${name.slice(0, 3)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 10) return '***';
    return `${phone.slice(0, 6)}****${phone.slice(-2)}`;
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 px-4 flex flex-col items-center justify-center text-purple-400 gap-3">
        <Loader2 size={32} className="animate-spin" />
        <p className="text-xs font-mono text-slate-400">Verifying Pass Authority Token...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 max-w-xl mx-auto space-y-6">
      
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>

      {record ? (
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                ✓ VERIFIED PARTICIPANT PASS
              </span>
              <h1 className="text-2xl font-extrabold text-white font-display">
                {record.participant.name}
              </h1>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400">PARTICIPANT ID</span>
              <span className="text-base font-bold text-white tracking-wider">
                {record.participant.participantId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-400 block mb-0.5">COLLEGE</span>
                <span className="font-bold text-slate-200">{record.participant.college}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">DEPARTMENT</span>
                <span className="font-bold text-slate-200">{record.participant.department} ({record.participant.year})</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">PASS STATUS</span>
                <span className="text-emerald-400 font-bold">{record.pass.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">ISSUED DATE</span>
                <span className="text-slate-300">Oct 1, 2026</span>
              </div>
            </div>

            {/* Privacy protected info */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-400 text-[11px]">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">PRIVACY PROTECTED DATA</span>
              <p>Email: <span className="text-slate-300">{maskEmail(record.participant.email)}</span></p>
              <p>Phone: <span className="text-slate-300">{maskPhone(record.participant.phone)}</span></p>
            </div>

            {/* Registered events */}
            <div className="space-y-2 pt-2">
              <span className="text-slate-400 font-bold uppercase block">
                REGISTERED COMPETITIONS ({record.registrations.length})
              </span>
              <div className="space-y-1.5">
                {record.registrations.map((r: any) => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{r.eventName}</span>
                    <span className="text-emerald-400 text-[10px]">CONFIRMED</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 text-center text-[10px] font-mono text-slate-400">
            <span>PARINAAM 2026 OFFICIAL REGISTRATION VERIFICATION PORTAL</span>
          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border-2 border-primary/50 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-white">Invalid or Expired Pass Token</h2>
          <p className="text-xs font-mono text-slate-400">
            The verification token <code className="text-primary">{token}</code> could not be validated against the registration authority database.
          </p>
        </div>
      )}

    </div>
  );
}
