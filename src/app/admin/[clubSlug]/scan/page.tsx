'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle, AlertTriangle, XCircle, Users, RefreshCw, ArrowLeft, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ScanResult {
  status: 'SUCCESS' | 'DUPLICATE' | 'ERROR';
  message: string;
  student?: { name: string; email: string; college: string };
}

export default function ClubQRScannerPage({
  params,
}: {
  params: Promise<{ clubSlug: string }>;
}) {
  const { clubSlug } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [club, setClub] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetch('/api/clubs')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const found = d.data.clubs.find((c: any) => c.slug.toLowerCase() === clubSlug.toLowerCase());
          if (found) {
            setClub(found);
            return fetch(`/api/events?club_id=${found.id}&limit=100`)
              .then(r => r.json())
              .then(ed => {
                if (ed.success) {
                  setEvents(ed.data.events);
                  if (ed.data.events.length > 0) setSelectedEvent(ed.data.events[0].id);
                }
              });
          }
        }
      });
  }, [clubSlug, user, authLoading, router]);

  useEffect(() => {
    if (!selectedEvent) return;
    fetch(`/api/attendance/scan?event_id=${selectedEvent}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setAttendanceCount(d.data.count);
      });
  }, [selectedEvent, scanResult]);

  const processScan = async (token: string) => {
    if (!selectedEvent) {
      setScanResult({ status: 'ERROR', message: 'Please select an event first' });
      return;
    }
    if (!token.trim()) return;

    setScanning(true);
    setScanResult(null);

    const res = await fetch('/api/attendance/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_token: token.trim(), event_id: selectedEvent }),
    });
    const data = await res.json();
    setScanning(false);

    if (data.success) {
      setScanResult({
        status: data.data.status === 'DUPLICATE' ? 'DUPLICATE' : 'SUCCESS',
        message: data.data.message,
        student: data.data.student,
      });
    } else {
      setScanResult({ status: 'ERROR', message: data.error || 'Scan failed' });
    }

    setTimeout(() => setScanResult(null), 4000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processScan(manualToken);
    setManualToken('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-lg mx-auto px-4">
        {/* Top Back Nav */}
        <Link
          href={`/admin/${clubSlug}`}
          className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to {club?.name || clubSlug} Admin
        </Link>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <QrCode size={26} className="text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{club?.name || clubSlug} Ticket Scanner</h1>
          <p className="text-slate-400 text-xs mt-1">Scan participant passes at the venue gate for instant check-in</p>
        </div>

        {/* Event selector */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-sm">
          <label className="text-xs text-slate-400 font-semibold block mb-2">Select {club?.name} Event</label>
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            className="w-full bg-[#0e0b1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="">— Choose Event —</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id} className="bg-slate-900 text-white">
                {ev.name}
              </option>
            ))}
          </select>

          {selectedEvent && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-purple-400" /> Checked In:
              </span>
              <span className="text-emerald-400 font-bold text-sm">{attendanceCount} students</span>
            </div>
          )}
        </div>

        {/* Result alert */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-4 rounded-2xl p-5 border ${
                scanResult.status === 'SUCCESS'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : scanResult.status === 'DUPLICATE'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.status === 'SUCCESS' && <CheckCircle size={22} className="text-emerald-400 shrink-0 mt-0.5" />}
                {scanResult.status === 'DUPLICATE' && <AlertTriangle size={22} className="text-amber-400 shrink-0 mt-0.5" />}
                {scanResult.status === 'ERROR' && <XCircle size={22} className="text-red-400 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-bold text-sm">{scanResult.message}</p>
                  {scanResult.student && (
                    <div className="mt-2 text-xs text-slate-300 space-y-0.5">
                      <p>👤 <strong>{scanResult.student.name}</strong></p>
                      <p>📧 {scanResult.student.email}</p>
                      <p>🏫 {scanResult.student.college}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner Viewfinder Box */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="bg-black rounded-2xl aspect-square max-h-60 flex items-center justify-center mb-5 relative overflow-hidden border border-white/10">
            <div className="text-center p-4">
              <Camera size={36} className="text-purple-400 mx-auto mb-2 opacity-80" />
              <p className="text-slate-300 text-sm font-semibold">Live Camera Ready</p>
              <p className="text-slate-500 text-xs mt-1">Point scanner at attendee's QR Pass</p>
            </div>
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map(pos => (
              <div key={pos} className={`absolute ${pos} w-8 h-8 border-2 border-purple-500 rounded-sm opacity-80`} />
            ))}
          </div>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">or test token manually</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualToken}
              onChange={e => setManualToken(e.target.value)}
              placeholder="Paste QR Token / Code"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={scanning || !manualToken.trim() || !selectedEvent}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              {scanning ? <RefreshCw size={16} className="animate-spin" /> : 'Validate'}
            </button>
          </form>
          <p className="text-slate-500 text-[11px] text-center mt-3">Duplicate check-in attempts are prevented automatically</p>
        </div>
      </div>
    </div>
  );
}
