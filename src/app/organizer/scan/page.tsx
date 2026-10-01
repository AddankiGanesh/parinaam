'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle, AlertTriangle, XCircle, Users, RefreshCw } from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface ScanResult {
  status: 'SUCCESS' | 'DUPLICATE' | 'ERROR';
  message: string;
  student?: { name: string; email: string; college: string };
}

export default function QRScannerPage() {
  const { user } = useRequireRole(['club_admin', 'super_admin']);
  const [events, setEvents] = useState<{ id: string; name: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const url = user.role === 'super_admin'
      ? '/api/events?status=published&limit=100'
      : `/api/events?club_id=${user.club_id}&status=published&limit=100`;
    fetch(url).then(r => r.json()).then(d => {
      if (d.success) setEvents(d.data.events);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedEvent) return;
    fetch(`/api/attendance/scan?event_id=${selectedEvent}`)
      .then(r => r.json())
      .then(d => { if (d.success) setAttendanceCount(d.data.count); });
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
      setScanResult({ status: data.data.status === 'DUPLICATE' ? 'DUPLICATE' : 'SUCCESS', message: data.data.message, student: data.data.student });
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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <QrCode size={26} className="text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">QR Scanner</h1>
          <p className="text-slate-500 text-sm mt-1">Scan student passes for attendance</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <label className="text-xs text-slate-400 font-medium block mb-2">Select Event</label>
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}
            className="w-full bg-[#0e0b1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500">
            <option value="">— Choose event —</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
          </select>
          {selectedEvent && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <Users size={14} />
              <span><strong className="text-white">{attendanceCount}</strong> checked in so far</span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {scanResult && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-4 rounded-2xl p-5 border ${scanResult.status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/30' : scanResult.status === 'DUPLICATE' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-start gap-3">
                {scanResult.status === 'SUCCESS' && <CheckCircle size={22} className="text-green-400 shrink-0 mt-0.5" />}
                {scanResult.status === 'DUPLICATE' && <AlertTriangle size={22} className="text-amber-400 shrink-0 mt-0.5" />}
                {scanResult.status === 'ERROR' && <XCircle size={22} className="text-red-400 shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-semibold text-sm ${scanResult.status === 'SUCCESS' ? 'text-green-300' : scanResult.status === 'DUPLICATE' ? 'text-amber-300' : 'text-red-300'}`}>{scanResult.message}</p>
                  {scanResult.student && (
                    <div className="mt-2 text-xs text-slate-400 space-y-0.5">
                      <p>📧 {scanResult.student.email}</p>
                      <p>🏫 {scanResult.student.college}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="bg-black rounded-xl aspect-square max-h-64 flex items-center justify-center mb-5 relative overflow-hidden border border-white/10">
            <div className="text-center">
              <QrCode size={40} className="text-slate-600 mx-auto mb-2" />
              <p className="text-slate-600 text-sm">Camera scanner</p>
              <p className="text-slate-700 text-xs">Uses device camera on mobile</p>
            </div>
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map(pos => (
              <div key={pos} className={`absolute ${pos} w-8 h-8 border-2 border-purple-500 rounded-sm opacity-60`} />
            ))}
          </div>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">or enter token manually</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input type="text" value={manualToken} onChange={e => setManualToken(e.target.value)}
              placeholder="Paste QR token here"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500" />
            <button type="submit" disabled={scanning || !manualToken.trim() || !selectedEvent}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold px-4 py-3 rounded-xl transition-all">
              {scanning ? <RefreshCw size={16} className="animate-spin" /> : 'Mark'}
            </button>
          </form>
          <p className="text-slate-600 text-xs text-center mt-3">Each student can only be marked once per event</p>
        </div>
      </div>
    </div>
  );
}
