'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Users, IndianRupee, Trophy, FileText,
  Phone, Mail, ArrowLeft, CheckCircle, AlertTriangle,
  Loader2, Tag, Calendar, Layers
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EventDetail {
  id: string; name: string; event_code: string; tagline: string;
  short_description: string; full_description: string; category: string;
  tags: string[]; venue: string; date_start: string; date_end: string;
  start_time: string; end_time: string; day_number: number;
  min_team_size: number; max_team_size: number;
  capacity: number; enrolled: number; fee: number; prize_pool: string;
  eligibility: string; rules: string[]; rounds: { name: string; description: string; date: string }[];
  coordinators: { name: string; role: string; phone: string; email: string }[];
  poster_url: string; rulebook_url: string;
  status: string; registration_open: boolean; is_popular: boolean;
  club_id: string; club_name: string; club_color: string; club_description: string;
}

interface UserRegistration {
  id: string; status: string; payment_status: string; amount_paid: number;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent]   = useState<EventDetail | null>(null);
  const [myReg, setMyReg]   = useState<UserRegistration | null>(null);
  const [loading, setLoading]   = useState(true);
  const [registering, setRegistering] = useState(false);
  const [regError, setRegError] = useState('');
  const [teamName, setTeamName] = useState('');
  const [showRegForm, setShowRegForm] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`).then(r => r.json()).then(d => {
      if (d.success) { setEvent(d.data.event); setMyReg(d.data.userRegistration); }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.verification_status !== 'verified') {
      setRegError('Your account verification is pending Super Admin approval. Once approved, you can register for events.');
      return;
    }
    if (!user.is_amrita_student && !user.platform_fee_paid) {
      router.push('/dashboard/payment');
      return;
    }

    setRegistering(true); setRegError('');
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: id, team_name: teamName || undefined }),
    });
    const data = await res.json();
    setRegistering(false);

    if (data.success) {
      setMyReg(data.data.registration);
      if (data.data.needs_payment) {
        router.push(`/dashboard/payment?registration_id=${data.data.registration.id}&event_id=${id}`);
      }
    } else {
      setRegError(data.error || 'Registration failed. Please try again.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05030a] pt-28 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-purple-500" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#05030a] pt-28 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 text-lg">Event not found</p>
        <Link href="/events" className="mt-4 text-purple-400 hover:text-purple-300 underline block">← Back to Events</Link>
      </div>
    </div>
  );

  const spotsLeft = event.capacity ? event.capacity - event.enrolled : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;
  const isTeamEvent = event.max_team_size > 1;

  return (
    <div className="min-h-screen bg-[#05030a] pt-24 pb-20">
      {/* Hero banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden bg-gradient-to-br from-slate-900 to-[#05030a]">
        {event.poster_url && (
          <img src={event.poster_url} alt={event.name} className="w-full h-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-5xl mx-auto">
            <Link href="/events" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-3 transition-colors">
              <ArrowLeft size={14} /> All Events
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ background: `${event.club_color}cc` }}>{event.club_name}</span>
              <span className="text-slate-400 text-xs font-mono">{event.event_code}</span>
              {event.is_popular && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">🔥 Popular</span>}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{event.name}</h1>
            {event.tagline && <p className="text-slate-300 mt-1">{event.tagline}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Users size={16} />, label: 'Team', value: isTeamEvent ? `${event.min_team_size}–${event.max_team_size} members` : 'Individual' },
                { icon: <IndianRupee size={16} />, label: 'Fee', value: event.fee === 0 ? 'FREE' : `₹${event.fee}` },
                { icon: <Trophy size={16} />, label: 'Prize', value: event.prize_pool || '—' },
                { icon: <Calendar size={16} />, label: 'Day', value: `Day ${event.day_number}` },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-purple-400 mb-1">{s.icon}</div>
                  <p className="text-white text-sm font-semibold truncate">{s.value}</p>
                  <p className="text-slate-600 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <Section title="About this Event">
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {event.full_description || event.short_description}
              </p>
            </Section>

            {/* Venue & Schedule */}
            {(event.venue || event.date_start) && (
              <Section title="Venue & Schedule">
                <div className="space-y-2">
                  {event.venue && <InfoRow icon={<MapPin size={14} />} text={event.venue} />}
                  {event.date_start && <InfoRow icon={<Calendar size={14} />} text={new Date(event.date_start).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />}
                  {event.start_time && <InfoRow icon={<Clock size={14} />} text={`${event.start_time} – ${event.end_time || ''}`} />}
                </div>
              </Section>
            )}

            {/* Rounds */}
            {event.rounds?.length > 0 && (
              <Section title="Event Rounds">
                <div className="space-y-3">
                  {event.rounds.map((round, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">{i + 1}</div>
                      <div>
                        <p className="text-white text-sm font-semibold">{round.name}</p>
                        {round.description && <p className="text-slate-400 text-xs mt-0.5">{round.description}</p>}
                        {round.date && <p className="text-slate-600 text-xs mt-0.5">{new Date(round.date).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Eligibility */}
            {event.eligibility && (
              <Section title="Eligibility">
                <p className="text-slate-300 text-sm">{event.eligibility}</p>
              </Section>
            )}

            {/* Rules */}
            {event.rules?.length > 0 && (
              <Section title="Rules & Regulations">
                <ul className="space-y-2">
                  {event.rules.map((rule, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                      <span className="text-purple-400 shrink-0 mt-0.5">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
                {event.rulebook_url && (
                  <a href={event.rulebook_url} target="_blank" rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm underline">
                    <FileText size={13} /> Download Full Rulebook
                  </a>
                )}
              </Section>
            )}

            {/* Coordinators */}
            {event.coordinators?.length > 0 && (
              <Section title="Event Coordinators">
                <div className="grid sm:grid-cols-2 gap-3">
                  {event.coordinators.map((c, i) => (
                    <div key={i} className="bg-white/3 border border-white/10 rounded-xl p-4">
                      <p className="text-white font-semibold text-sm">{c.name}</p>
                      <p className="text-slate-500 text-xs">{c.role}</p>
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs mt-2">
                          <Phone size={11} /> {c.phone}
                        </a>
                      )}
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs mt-1">
                          <Mail size={11} /> {c.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Right — Registration card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                {/* Status */}
                <div className="mb-4">
                  {spotsLeft !== null && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{event.enrolled} registered</span>
                        <span>{spotsLeft} spots left</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (event.enrolled / event.capacity) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Registration Fee</span>
                    <span className={`font-bold text-lg ${event.fee === 0 ? 'text-green-400' : 'text-white'}`}>
                      {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                    </span>
                  </div>
                </div>

                {/* My registration status */}
                {myReg && (
                  <div className={`mb-4 p-3 rounded-xl border ${myReg.status === 'CONFIRMED' ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className={myReg.status === 'CONFIRMED' ? 'text-green-400' : 'text-amber-400'} />
                      <p className={`text-sm font-semibold ${myReg.status === 'CONFIRMED' ? 'text-green-300' : 'text-amber-300'}`}>
                        {myReg.status === 'CONFIRMED' ? 'You\'re registered!' : 'Registration Pending'}
                      </p>
                    </div>
                    {myReg.payment_status !== 'paid' && event.fee > 0 && (
                      <Link href={`/dashboard/payment?registration_id=${myReg.id}&event_id=${id}`}
                        className="mt-2 w-full flex justify-center items-center bg-amber-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-amber-500 transition-all">
                        Complete Payment →
                      </Link>
                    )}
                  </div>
                )}

                {/* Verification pending banner */}
                {user && user.verification_status !== 'verified' && !myReg && (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                      <Clock size={14} /> Verification Pending Approval
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Your profile is submitted to Super Admin for verification. Once approved, you can register for all events.
                    </p>
                  </div>
                )}

                {/* Error */}
                {regError && (
                  <div className="mb-3 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-red-400 text-xs">
                    <AlertTriangle size={13} className="shrink-0 mt-0.5" /> {regError}
                  </div>
                )}

                {/* Register button */}
                {!myReg && (
                  <>
                    {isTeamEvent && showRegForm && (
                      <div className="mb-3">
                        <label className="text-xs text-slate-400 block mb-1">Team Name</label>
                        <input value={teamName} onChange={e => setTeamName(e.target.value)}
                          placeholder="Enter your team name" maxLength={60}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500" />
                      </div>
                    )}
                    <button
                      onClick={isTeamEvent && !showRegForm ? () => setShowRegForm(true) : handleRegister}
                      disabled={registering || isFull || !event.registration_open || (!!user && user.verification_status !== 'verified')}
                      className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all ${
                        isFull || !event.registration_open || (!!user && user.verification_status !== 'verified')
                          ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30'
                      }`}>
                      {registering ? <Loader2 size={16} className="animate-spin" /> :
                        isFull ? 'Event is Full' :
                        !event.registration_open ? 'Registration Closed' :
                        !user ? 'Sign in to Register' :
                        user.verification_status !== 'verified' ? '⏳ Verification Pending' :
                        isTeamEvent && !showRegForm ? "I'm Interested (Team)" :
                        `I'm Interested${event.fee > 0 ? ` · ₹${event.fee}` : ''}`}

                    </button>
                    {!user && (
                      <p className="text-slate-600 text-xs text-center mt-2">
                        <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">Sign in</Link> or{' '}
                        <Link href="/auth/register" className="text-purple-400 hover:text-purple-300">register</Link> to participate
                      </p>
                    )}
                  </>
                )}

                {/* Club info */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-600 mb-1">Organized by</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: event.club_color }} />
                    <p className="text-slate-300 text-sm font-medium">{event.club_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
      <h2 className="text-white font-bold text-base mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-slate-300 text-sm">
      <span className="text-slate-500 mt-0.5 shrink-0">{icon}</span>
      {text}
    </div>
  );
}
