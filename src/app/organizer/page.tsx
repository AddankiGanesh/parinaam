'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, QrCode, Plus,
  TrendingUp, Eye, Edit3, ToggleLeft, ToggleRight, LogOut
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

interface ClubEvent {
  id: string; name: string; category: string; status: string;
  registration_open: boolean; enrolled: number; capacity: number;
  fee: number; date_start: string;
}

export default function OrganizerDashboard() {
  const { user } = useRequireRole(['club_admin', 'super_admin']);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const url = user.role === 'super_admin'
      ? '/api/events?status=all&limit=100'
      : `/api/events?club_id=${user.club_id}&status=all&limit=100`;
    fetch(url).then(r => r.json()).then(d => {
      if (d.success) setEvents(d.data.events);
    }).finally(() => setLoading(false));
  }, [user]);

  const toggleRegistration = async (eventId: string, current: boolean) => {
    await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_open: !current }),
    });
    setEvents(evs => evs.map(e => e.id === eventId ? { ...e, registration_open: !current } : e));
  };

  const publishEvent = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, registration_open: newStatus === 'published' }),
    });
    setEvents(evs => evs.map(e => e.id === eventId ? { ...e, status: newStatus, registration_open: newStatus === 'published' } : e));
  };

  if (!user) return null;

  const published = events.filter(e => e.status === 'published').length;
  const totalEnrolled = events.reduce((a, e) => a + (e.enrolled || 0), 0);

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={18} className="text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Organizer Panel</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{user.club_name || 'All Clubs'}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your events and participants</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/organizer/events/new"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/30">
              <Plus size={15} /> Create Event
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Events', value: events.length, icon: <Calendar size={18} />, color: 'text-purple-400' },
            { label: 'Published', value: published, icon: <Eye size={18} />, color: 'text-green-400' },
            { label: 'Total Enrolled', value: totalEnrolled, icon: <Users size={18} />, color: 'text-blue-400' },
            { label: 'Draft Events', value: events.length - published, icon: <Edit3 size={18} />, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Events table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-white font-semibold">Events</h2>
            <Link href="/organizer/scan" className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300">
              <QrCode size={14} /> QR Scanner
            </Link>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">No events yet</p>
              <Link href="/organizer/events/new" className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                <Plus size={14} /> Create your first event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {events.map(event => (
                <div key={event.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{event.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{event.category}</p>
                  </div>

                  {/* Enrolled */}
                  <div className="text-right hidden sm:block">
                    <p className="text-white text-sm font-medium">{event.enrolled}/{event.capacity || '∞'}</p>
                    <p className="text-slate-600 text-xs">enrolled</p>
                  </div>

                  {/* Status badge */}
                  <StatusBadge status={event.status} />

                  {/* Registration toggle */}
                  <button onClick={() => toggleRegistration(event.id, event.registration_open)}
                    title={event.registration_open ? 'Close registrations' : 'Open registrations'}
                    className={`transition-colors ${event.registration_open ? 'text-green-400 hover:text-green-300' : 'text-slate-600 hover:text-slate-400'}`}>
                    {event.registration_open ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Link href={`/organizer/events/${event.id}/registrations`}
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="View participants">
                      <Users size={15} />
                    </Link>
                    <Link href={`/organizer/events/${event.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit event">
                      <Edit3 size={15} />
                    </Link>
                    <button onClick={() => publishEvent(event.id, event.status)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${event.status === 'published' ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}>
                      {event.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: 'bg-green-500/20 text-green-300',
    draft: 'bg-slate-500/20 text-slate-400',
    closed: 'bg-orange-500/20 text-orange-300',
    cancelled: 'bg-red-500/20 text-red-300',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${map[status] || 'bg-white/10 text-slate-400'}`}>{status}</span>;
}
