'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Calendar, IndianRupee, TicketCheck, Shield,
  AlertTriangle, ChevronRight, CheckCircle, XCircle, Eye,
  Building2, Settings, ExternalLink, Sparkles, ArrowRight
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface Stats {
  overview: {
    total_students: number;
    pending_verification: number;
    total_events: number;
    confirmed_registrations: number;
    total_revenue_inr: number;
  };
  club_stats: { name: string; slug?: string; color: string; published_events: string; total_registrations: string }[];
  recent_registrations: { id: string; full_name: string; college_name: string; event_name: string; club_name: string; registered_at: string; status: string }[];
}

interface PendingUser {
  id: string; full_name: string; email: string; college_name: string;
  id_card_url: string; created_at: string; roll_number: string;
}

interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  event_count?: string;
  total_enrolled?: string;
}

export default function SuperAdminDashboard() {
  const { user } = useRequireRole('super_admin');
  const [stats, setStats] = useState<Stats | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [tab, setTab] = useState<'overview' | 'clubs' | 'verify'>('overview');

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/clubs').then(r => r.json()),
      fetch('/api/admin/users?verification_status=pending&role=student').then(r => r.json()),
    ]).then(([statsData, clubsData, usersData]) => {
      if (statsData.success) setStats(statsData.data);
      if (clubsData.success) setClubs(clubsData.data.clubs);
      if (usersData.success) setPendingUsers(usersData.data.users);
    });
  }, [user]);

  const handleVerify = async (userId: string, status: 'verified' | 'rejected', note?: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    setPendingUsers(prev => prev.filter(u => u.id !== userId));
    if (stats) {
      setStats(s => s ? { ...s, overview: { ...s.overview, pending_verification: s.overview.pending_verification - 1 } } : s);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-purple-500/30">
                <Shield size={12} /> Super Admin Control Center
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Festival Command HQ</h1>
            <p className="text-slate-400 text-sm mt-0.5">Parinaam 2026 — Central Festival Management for all 12 Clubs</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/superadmin/users"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              <Users size={15} /> All Users
            </Link>
            <Link
              href="/superadmin/settings"
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              <Settings size={15} /> Platform Settings
            </Link>
          </div>
        </div>

        {/* Pending verification alert */}
        {stats && stats.overview.pending_verification > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3.5 cursor-pointer hover:bg-amber-500/15 transition-colors"
            onClick={() => setTab('verify')}
          >
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
            <p className="text-amber-300 text-sm">
              <strong>{stats.overview.pending_verification}</strong> student{stats.overview.pending_verification !== 1 ? 's' : ''} waiting for ID card review
            </p>
            <span className="text-xs text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full font-medium ml-auto">
              Review Now →
            </span>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            HQ Overview
          </button>
          <button
            onClick={() => setTab('clubs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              tab === 'clubs' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={14} /> 12 Club Admin Portals
          </button>
          <button
            onClick={() => setTab('verify')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              tab === 'verify' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ID Verification ({pendingUsers.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Registered Students', value: stats?.overview.total_students ?? '—', icon: <Users size={18} />, color: 'text-purple-400' },
                { label: 'Pending KYC', value: stats?.overview.pending_verification ?? '—', icon: <AlertTriangle size={18} />, color: 'text-amber-400' },
                { label: 'Total Events', value: stats?.overview.total_events ?? '—', icon: <Calendar size={18} />, color: 'text-blue-400' },
                { label: 'Registrations', value: stats?.overview.confirmed_registrations ?? '—', icon: <TicketCheck size={18} />, color: 'text-emerald-400' },
                { label: 'Total Revenue', value: stats ? `₹${stats.overview.total_revenue_inr.toLocaleString()}` : '—', icon: <IndianRupee size={18} />, color: 'text-cyan-400' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className={`mb-2 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Club Navigator Grid */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Direct Club Admin Portals</h2>
                  <p className="text-slate-400 text-xs">Jump directly into any club's management dashboard</p>
                </div>
                <button onClick={() => setTab('clubs')} className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1">
                  View full grid <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {clubs.slice(0, 8).map((club, i) => (
                  <Link
                    key={`club-quick-${club.id || club.slug || i}`}
                    href={`/admin/${club.slug}`}
                    className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/50 transition-all group block"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: club.color || '#8b5cf6' }} />
                      <span className="text-[11px] font-mono text-purple-400 group-hover:translate-x-0.5 transition-transform">/admin/{club.slug} →</span>
                    </div>
                    <p className="text-white font-semibold text-sm truncate">{club.name}</p>
                    <p className="text-slate-500 text-xs truncate mt-0.5">{club.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Registrations table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h2 className="text-white font-semibold">Live Festival Registrations</h2>
                <Link href="/superadmin/users" className="text-purple-400 text-xs hover:text-purple-300 font-semibold">
                  Manage all users →
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {stats?.recent_registrations?.length ? (
                  stats.recent_registrations.map((reg, i) => (
                    <div key={reg.id ? `recent-reg-${reg.id}` : `recent-reg-${i}`} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02]">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{reg.full_name}</p>
                        <p className="text-slate-500 text-xs">{reg.college_name}</p>
                      </div>
                      <div className="text-right min-w-0">
                        <p className="text-slate-200 text-xs font-medium truncate max-w-44">{reg.event_name}</p>
                        <p className="text-purple-400 text-xs">{reg.club_name}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                        reg.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {reg.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500 text-sm">No recent registrations yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL 12 CLUBS GRID */}
        {tab === 'clubs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-xl">12 Club Administration Portals</h2>
                <p className="text-slate-400 text-sm">Access dedicated URLs for each club to manage events, tickets, and attendance.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((club, i) => (
                <div
                  key={`club-grid-${club.id || club.slug || i}`}
                  className="bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-2xl p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: club.color || '#8b5cf6' }} />
                        <h3 className="text-white font-bold text-base">{club.name}</h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        /admin/{club.slug}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {club.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className="bg-white/[0.03] rounded-xl p-2.5">
                        <span className="text-slate-500 block text-[10px] uppercase">Events</span>
                        <span className="text-white font-bold text-sm">{club.event_count || '1'}</span>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-2.5">
                        <span className="text-slate-500 block text-[10px] uppercase">Enrolled</span>
                        <span className="text-emerald-400 font-bold text-sm">{club.total_enrolled || '0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Link
                      href={`/admin/${club.slug}`}
                      className="flex-1 text-center bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      Enter Portal →
                    </Link>
                    <Link
                      href={`/admin/${club.slug}/events/new`}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs transition-all"
                      title="Create Event"
                    >
                      ➕
                    </Link>
                    <Link
                      href={`/admin/${club.slug}/scan`}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs transition-all"
                      title="Ticket Scanner"
                    >
                      📷
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VERIFY ID CARDS */}
        {tab === 'verify' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Pending ID Verifications ({pendingUsers.length})</h2>
              <Link href="/superadmin/users?verification_status=pending" className="text-purple-400 text-xs font-semibold hover:text-purple-300">
                View in Users Manager →
              </Link>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <CheckCircle size={36} className="mx-auto text-emerald-400 mb-3" />
                <p className="text-slate-200 font-medium">All clear!</p>
                <p className="text-slate-500 text-sm">No external student ID cards are pending review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingUsers.map((u, i) => (
                  <div key={u.id ? `pending-${u.id}` : `pending-${u.email}-${i}`} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-white font-bold text-base">{u.full_name || u.email}</p>
                          <p className="text-slate-400 text-xs">{u.email}</p>
                          <p className="text-purple-300 text-xs mt-1 font-medium">{u.college_name || 'External College'}</p>
                        </div>
                        {u.id_card_url ? (
                          <a
                            href={u.id_card_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg"
                          >
                            <Eye size={13} /> View ID
                          </a>
                        ) : (
                          <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                            ID Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => handleVerify(u.id, 'verified')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold py-2 rounded-xl text-xs transition-all"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleVerify(u.id, 'rejected', 'Invalid ID')}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-semibold py-2 rounded-xl text-xs transition-all"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
