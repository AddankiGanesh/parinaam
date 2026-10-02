'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle, AlertTriangle, XCircle, Users, RefreshCw, UserCheck, Clock, Percent } from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface ScanResult {
  status: 'SUCCESS' | 'DUPLICATE' | 'ERROR';
  message: string;
  student?: { name: string; email: string; college: string; roll_number?: string };
}

interface Attendee {
  registration_id: string;
  registration_status: string;
  payment_status: string;
  team_name?: string;
  user_id: string;
  full_name: string;
  email: string;
  college_name: string;
  roll_number?: string;
  phone?: string;
  attendance_id?: string;
  checked_in_at?: string;
}

interface Stats {
  confirmedCount: number;
  checkedInCount: number;
  remainingCount: number;
  attendancePercentage: number;
}

export default function QRScannerPage() {
  const { user } = useRequireRole(['club_admin', 'super_admin']);
  const [events, setEvents] = useState<{ id: string; name: string; venue?: string; date_start?: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  
  const [stats, setStats] = useState<Stats>({
    confirmedCount: 0,
    checkedInCount: 0,
    remainingCount: 0,
    attendancePercentage: 0,
  });
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch events belonging strictly to this organizer's club
  useEffect(() => {
    if (!user) return;
    const url = user.role === 'super_admin'
      ? '/api/events?status=published&limit=100'
      : `/api/events?club_id=${user.club_id}&limit=100`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.events) {
          setEvents(d.data.events);
          if (d.data.events.length > 0 && !selectedEvent) {
            setSelectedEvent(d.data.events[0].id);
          }
        }
      });
  }, [user]);

  // Fetch real-time attendance stats & attendee list from RDS
  const fetchAttendanceData = () => {
    if (!selectedEvent) return;
    setLoadingData(true);
    fetch(`/api/attendance/scan?event_id=${selectedEvent}`)
      .then(r => r.json())
      .then(d => {
        setLoadingData(false);
        if (d.success) {
          setStats(d.data.stats || { confirmedCount: 0, checkedInCount: 0, remainingCount: 0, attendancePercentage: 0 });
          setAttendees(d.data.attendees || []);
        }
      })
      .catch(() => setLoadingData(false));
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedEvent]);

  const processScan = async (token: string) => {
    if (!selectedEvent) {
      setScanResult({ status: 'ERROR', message: 'Please select an event first' });
      return;
    }
    if (!token.trim()) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_token: token.trim(), event_id: selectedEvent }),
      });
      const data = await res.json();
      setScanning(false);

      if (data.success) {
        const isDup = Boolean(data.data.duplicate || data.data.status === 'DUPLICATE');
        setScanResult({
          status: isDup ? 'DUPLICATE' : 'SUCCESS',
          message: data.data.message,
          student: data.data.student,
        });
        fetchAttendanceData();
      } else {
        setScanResult({ status: 'ERROR', message: data.error || 'Scan failed' });
      }
    } catch {
      setScanning(false);
      setScanResult({ status: 'ERROR', message: 'Server communication error during scan' });
    }

    setTimeout(() => setScanResult(null), 5000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processScan(manualToken);
    setManualToken('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <QrCode size={26} className="text-purple-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Event Attendance Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Scan student passes and track live attendance for your club events</p>
        </div>

        {/* Event Selector */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
          <label className="text-xs text-slate-400 font-medium block mb-2 uppercase tracking-wider">Select Event</label>
          <select
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            className="w-full bg-[#0e0b1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="">— Choose Event —</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.name} {ev.venue ? `(${ev.venue})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Live Attendance Stats Grid */}
        {selectedEvent && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-slate-400 text-xs font-medium">Total Confirmed</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.confirmedCount}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-emerald-400 text-xs font-medium">Checked In</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-300 mt-1">{stats.checkedInCount}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-amber-400 text-xs font-medium">Remaining</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">{stats.remainingCount}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
              <p className="text-purple-400 text-xs font-medium">Attendance %</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-300 mt-1">{stats.attendancePercentage}%</p>
            </div>
          </div>
        )}

        {/* Scan Results Notification Banner */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-6 rounded-2xl p-5 border shadow-2xl ${
                scanResult.status === 'SUCCESS'
                  ? 'bg-green-500/15 border-green-500/40 text-green-300'
                  : scanResult.status === 'DUPLICATE'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-red-500/15 border-red-500/40 text-red-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.status === 'SUCCESS' && <CheckCircle size={24} className="text-green-400 shrink-0 mt-0.5" />}
                {scanResult.status === 'DUPLICATE' && <AlertTriangle size={24} className="text-amber-400 shrink-0 mt-0.5" />}
                {scanResult.status === 'ERROR' && <XCircle size={24} className="text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-bold text-base">{scanResult.message}</p>
                  {scanResult.student && (
                    <div className="mt-2 text-xs text-slate-300 space-y-1 bg-black/40 p-3 rounded-xl border border-white/10 font-mono">
                      <p>👤 <strong>{scanResult.student.name}</strong></p>
                      <p>📧 {scanResult.student.email}</p>
                      <p>🏫 {scanResult.student.college} {scanResult.student.roll_number ? `(${scanResult.student.roll_number})` : ''}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner Box & Token Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="bg-black rounded-xl aspect-video max-h-56 flex items-center justify-center mb-5 relative overflow-hidden border border-white/10">
            <div className="text-center">
              <QrCode size={44} className="text-slate-600 mx-auto mb-2 animate-pulse" />
              <p className="text-slate-400 text-sm font-semibold">Camera Scanner Ready</p>
              <p className="text-slate-600 text-xs">Point camera at student pass QR code</p>
            </div>
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map(pos => (
              <div key={pos} className={`absolute ${pos} w-8 h-8 border-2 border-purple-500 rounded-sm opacity-60`} />
            ))}
          </div>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs uppercase tracking-wider font-mono">or enter QR pass token</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualToken}
              onChange={e => setManualToken(e.target.value)}
              placeholder="Paste QR token / Pass ID here"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={scanning || !manualToken.trim() || !selectedEvent}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2"
            >
              {scanning ? <RefreshCw size={16} className="animate-spin" /> : <UserCheck size={16} />}
              <span>Mark Attendance</span>
            </button>
          </form>
        </div>

        {/* Live Attendee List Table */}
        {selectedEvent && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <span>Event Registration &amp; Attendance List</span>
              </h3>
              <button
                onClick={fetchAttendanceData}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono"
              >
                <RefreshCw size={12} className={loadingData ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {attendees.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No registrations found for this event yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Email &amp; College</th>
                      <th className="p-3">Team</th>
                      <th className="p-3">Reg. Status</th>
                      <th className="p-3">Check-in Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {attendees.map(att => (
                      <tr key={att.registration_id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-semibold text-white">
                          {att.full_name}
                          {att.roll_number && <span className="block text-[10px] text-slate-500 font-mono">{att.roll_number}</span>}
                        </td>
                        <td className="p-3">
                          <p>{att.email}</p>
                          <p className="text-slate-500 text-[10px]">{att.college_name}</p>
                        </td>
                        <td className="p-3 text-slate-400 font-mono">
                          {att.team_name || 'Individual'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                            att.registration_status === 'CONFIRMED'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {att.registration_status}
                          </span>
                        </td>
                        <td className="p-3">
                          {att.attendance_id ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                              <CheckCircle size={14} />
                              <span>Checked In ({new Date(att.checked_in_at!).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono">Not Checked In</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
