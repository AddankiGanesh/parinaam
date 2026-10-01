'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Download, Users, QrCode, CheckCircle, Clock, X } from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface Participant {
  id: string; user_id: string; full_name: string; email: string; phone: string;
  college_name: string; roll_number: string; department: string; year_of_study: string;
  is_amrita_student: boolean; qr_token: string; status: string; payment_status: string;
  amount_paid: number; team_name: string; registered_at: string; checked_in_at: string | null;
}

export default function EventRegistrationsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useRequireRole(['club_admin', 'super_admin']);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventName, setEventName] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/events/${id}`).then(r => r.json()).then(d => {
      if (d.success) setEventName(d.data.event.name);
    });
  }, [id]);

  const fetchParticipants = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);

    const res = await fetch(`/api/events/${id}/registrations?${params}`);
    const data = await res.json();
    if (data.success) { setParticipants(data.data.registrations); setTotal(data.data.pagination.total); }
    setLoading(false);
  }, [id, search, statusFilter, page]);

  useEffect(() => { fetchParticipants(); }, [fetchParticipants]);

  // Debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Roll No', 'Department', 'Year', 'Status', 'Payment', 'Amount', 'Team', 'Registered At', 'Checked In'];
    const rows = participants.map(p => [
      p.full_name, p.email, p.phone || '', p.college_name || '',
      p.roll_number || '', p.department || '', p.year_of_study || '',
      p.status, p.payment_status, p.amount_paid,
      p.team_name || '', new Date(p.registered_at).toLocaleString(),
      p.checked_in_at ? new Date(p.checked_in_at).toLocaleString() : '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${eventName}-participants.csv`; a.click();
  };

  if (!user) return null;

  const confirmed = participants.filter(p => p.status === 'CONFIRMED').length;
  const checkedIn = participants.filter(p => p.checked_in_at).length;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link href="/organizer" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-2">
              <ArrowLeft size={14} /> Organizer Panel
            </Link>
            <h1 className="text-xl font-bold text-white">{eventName || 'Event'} — Participants</h1>
            <p className="text-slate-500 text-sm">{total} registered · {confirmed} confirmed · {checkedIn} checked in</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/organizer/scan`}
              className="flex items-center gap-1.5 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-purple-600/30 transition-all">
              <QrCode size={14} /> QR Scan
            </Link>
            <button onClick={downloadCSV}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/10 transition-all">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email, roll no…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500" />
          </div>
          {['', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
              {s || 'All Status'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-left">
                  {['Name', 'College / Roll', 'Status', 'Payment', 'Team', 'Attendance', 'Registered'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
                  ))
                ) : participants.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-500">No participants found</td></tr>
                ) : (
                  participants.map(p => (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">{p.full_name}</p>
                          <p className="text-slate-500 text-xs">{p.email}</p>
                          {p.is_amrita_student && <span className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded mt-0.5 inline-block">Amrita</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-300 text-xs">{p.college_name || '—'}</p>
                        {p.roll_number && <p className="text-slate-500 text-xs font-mono">{p.roll_number}</p>}
                        {p.department && <p className="text-slate-600 text-xs">{p.department} · {p.year_of_study}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.payment_status === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {p.payment_status === 'paid' ? `₹${p.amount_paid} paid` : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{p.team_name || '—'}</td>
                      <td className="px-4 py-3">
                        {p.checked_in_at ? (
                          <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} /> {new Date(p.checked_in_at).toLocaleTimeString()}</span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-600 text-xs"><Clock size={12} /> Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{new Date(p.registered_at).toLocaleDateString()}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {total > 50 && (
          <div className="flex justify-center gap-3 mt-5">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm disabled:opacity-30">← Prev</button>
            <span className="text-slate-400 text-sm self-center">Page {page} of {Math.ceil(total / 50)}</span>
            <button disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm disabled:opacity-30">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-green-500/20 text-green-300',
    PENDING: 'bg-amber-500/20 text-amber-300',
    CANCELLED: 'bg-red-500/20 text-red-300',
    WAITLISTED: 'bg-blue-500/20 text-blue-300',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${map[status] || 'bg-white/10 text-slate-400'}`}>{status}</span>;
}
