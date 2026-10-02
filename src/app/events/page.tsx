'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, Loader2, Calendar, Users, Trophy, 
  MapPin, Clock, ArrowRight, ExternalLink, Sparkles, Check, 
  Eye, ShieldCheck, Phone, Mail 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Club {
  id: string;
  name: string;
  slug: string;
  color: string;
  event_count: string;
}

interface Event {
  id: string;
  name: string;
  event_code: string;
  tagline: string;
  short_description: string;
  full_description?: string;
  category: string;
  venue: string;
  date_start: string;
  start_time: string;
  end_time: string;
  day_number?: number;
  min_team_size: number;
  max_team_size: number;
  capacity: number;
  enrolled: number;
  fee: number;
  prize_pool: string;
  poster_url: string;
  status: string;
  registration_open: boolean;
  is_popular: boolean;
  is_featured: boolean;
  club_id: string;
  club_name: string;
  club_slug: string;
  club_color: string;
  rules?: string[];
  rounds?: { name: string; description: string; date: string }[];
  coordinators?: { name: string; role: string; phone: string; email?: string }[];
}

const CATEGORIES = [
  'All',
  'Coding & Hackathon',
  'Technical',
  'Robotics',
  'Cultural',
  'Gaming',
  'Workshops',
  'Quiz & Literary',
  'Arts & Media',
  'Management'
];

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [clubFilter, setClubFilter] = useState('');
  const [dayFilter, setDayFilter] = useState<'All' | 1 | 2>('All');
  const [feeFilter, setFeeFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'prize' | 'fee'>('featured');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalEvent, setModalEvent] = useState<Event | null>(null);

  // Fetch clubs list once
  useEffect(() => {
    fetch('/api/clubs')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setClubs(d.data.clubs);
      })
      .catch(() => {});
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'published', page: String(page), limit: '24' });
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (clubFilter) params.set('club_id', clubFilter);

    try {
      const res = await fetch(`/api/events?${params}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.events || []);
        setTotal(data.data.pagination?.total || 0);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [search, category, clubFilter, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Debounced search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Filter & sort on client side for responsive instant feedback
  const displayedEvents = useMemo(() => {
    let list = [...events];

    if (dayFilter !== 'All') {
      list = list.filter((e) => e.day_number === dayFilter);
    }

    if (feeFilter === 'Free') {
      list = list.filter((e) => e.fee === 0);
    } else if (feeFilter === 'Paid') {
      list = list.filter((e) => e.fee > 0);
    }

    if (sortBy === 'prize') {
      list.sort((a, b) => {
        const getVal = (p: string) => {
          const match = p.replace(/[^\d]/g, '');
          return match ? parseInt(match, 10) : 0;
        };
        return getVal(b.prize_pool || '') - getVal(a.prize_pool || '');
      });
    } else if (sortBy === 'fee') {
      list.sort((a, b) => a.fee - b.fee);
    } else {
      // Default: featured first, popular second
      list.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        if (a.is_popular !== b.is_popular) return a.is_popular ? -1 : 1;
        return 0;
      });
    }

    return list;
  }, [events, dayFilter, feeFilter, sortBy]);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('All');
    setClubFilter('');
    setDayFilter('All');
    setFeeFilter('All');
    setSortBy('featured');
    setPage(1);
  };

  const hasFilters = search || category !== 'All' || clubFilter || dayFilter !== 'All' || feeFilter !== 'All';

  return (
    <div className="min-h-screen bg-[#05030a] pt-28 pb-24 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Hero Banner Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PARINAAM 2026 COMPETITIONS &amp; CLUSTERS</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
              Live Registrations Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            Festival Events &amp; Hackathons
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
            Explore 14+ national flagship competitions spanning cyber hackathons, AI swarms, full-metal robotics battles, live rock showdowns, and campus esports across our 12 university club houses.
          </p>
        </div>

        {/* Search, Sort, Day & Fee Controls */}
        <div className="bg-[#0b0716] border border-purple-950/80 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search events, keywords, or codes (e.g. Code Red, RoboWars)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 text-sm transition-all font-sans"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Quick Filters: Day, Fee & Sort */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              {/* Day Filter */}
              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
                <button
                  onClick={() => setDayFilter('All')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${dayFilter === 'All' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  All Days
                </button>
                <button
                  onClick={() => setDayFilter(1)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${dayFilter === 1 ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Day 1 (Oct 11)
                </button>
                <button
                  onClick={() => setDayFilter(2)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${dayFilter === 2 ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Day 2 (Oct 12)
                </button>
              </div>

              {/* Fee Filter */}
              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
                {(['All', 'Free', 'Paid'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFeeFilter(mode)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${feeFilter === mode ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {mode === 'All' ? 'All Fees' : mode}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort events by"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono focus:outline-none focus:border-purple-500"
              >
                <option value="featured" className="bg-[#0b0716] text-white">Sort: Featured First</option>
                <option value="prize" className="bg-[#0b0716] text-white">Sort: Prize (High to Low)</option>
                <option value="fee" className="bg-[#0b0716] text-white">Sort: Fee (Lowest First)</option>
              </select>
            </div>
          </div>

          {/* Club Selector Bar */}
          <div className="pt-2 border-t border-purple-950/60">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Filter by University Club:</span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => { setClubFilter(''); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  !clubFilter ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                All Clubs (12)
              </button>
              {clubs.map((club) => {
                const isActive = clubFilter === club.id;
                return (
                  <button
                    key={club.id}
                    onClick={() => { setClubFilter(isActive ? '' : club.id); setPage(1); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                      isActive ? 'text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                    style={isActive ? { background: club.color, borderColor: club.color } : {}}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: club.color }} />
                    <span>{club.name}</span>
                    {club.event_count && club.event_count !== '0' && (
                      <span className="opacity-70 text-[10px] font-mono">({club.event_count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Filter by Domain Category:</span>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-white/20 text-white border-white/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active summary bar */}
          {hasFilters && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-950/60 font-mono">
              <span className="text-slate-400">
                Filtered view: <strong className="text-white">{displayedEvents.length}</strong> matching event{displayedEvents.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={clearFilters}
                className="text-purple-400 hover:text-purple-300 font-semibold underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-3">
            <Loader2 size={36} className="animate-spin text-purple-500" />
            <span className="text-xs font-mono text-slate-400">Loading festival catalog...</span>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-8 max-w-lg mx-auto">
            <Filter size={36} className="mx-auto text-purple-400 mb-3 opacity-60" />
            <p className="text-white font-bold text-lg">No competitions found matching filters</p>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Try clearing your search query or choosing another club cluster.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((evt, i) => (
              <EventCardItem
                key={evt.id}
                event={evt}
                index={i}
                user={user}
                onQuickView={() => setModalEvent(evt)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {modalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0c081a] border border-purple-700/60 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalEvent(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-slate-300 hover:text-white border border-white/15 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Poster Header */}
              <div className="relative h-56 w-full bg-slate-950 shrink-0">
                <img
                  src={modalEvent.poster_url}
                  alt={modalEvent.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c081a] via-[#0c081a]/50 to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md text-white border border-white/15"
                      style={{ background: modalEvent.club_color }}
                    >
                      {modalEvent.club_name}
                    </span>
                    <span className="text-[10px] font-mono bg-black/80 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800">
                      {modalEvent.event_code}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display leading-tight">{modalEvent.name}</h2>
                  {modalEvent.tagline && <p className="text-xs text-slate-300 font-sans">{modalEvent.tagline}</p>}
                </div>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans">
                
                {/* Highlights bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Prize Pool</span>
                    <span className="text-sm font-bold text-amber-400">{modalEvent.prize_pool || 'Trophies & Certs'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Entry Fee</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {modalEvent.fee === 0 ? 'FREE' : `₹${modalEvent.fee}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Team Size</span>
                    <span className="text-sm font-bold text-purple-300">
                      {modalEvent.min_team_size === modalEvent.max_team_size
                        ? modalEvent.min_team_size === 1 ? 'Individual' : `${modalEvent.min_team_size} Members`
                        : `${modalEvent.min_team_size}–${modalEvent.max_team_size} Members`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Schedule</span>
                    <span className="text-sm font-bold text-white">Day {modalEvent.day_number || 1}</span>
                  </div>
                </div>

                {/* Logistics */}
                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 border-b border-purple-950 pb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-purple-400" />
                    <span>{modalEvent.date_start} • {modalEvent.start_time} - {modalEvent.end_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-amber-400" />
                    <span>{modalEvent.venue}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold font-mono text-purple-300 uppercase tracking-wider">About Competition</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {modalEvent.full_description || modalEvent.short_description}
                  </p>
                </div>

                {/* Rules */}
                {modalEvent.rules && modalEvent.rules.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold font-mono text-purple-300 uppercase tracking-wider">Official Rules</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                      {modalEvent.rules.map((rule, idx) => (
                        <li key={idx} className="leading-relaxed">{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coordinators */}
                {modalEvent.coordinators && modalEvent.coordinators.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-purple-950">
                    <h4 className="text-xs font-bold font-mono text-purple-300 uppercase tracking-wider">Event Coordinators</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {modalEvent.coordinators.map((c, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5">
                          <p className="text-white font-bold">{c.name} <span className="opacity-60 text-[10px]">({c.role})</span></p>
                          <p className="text-slate-400 text-[11px]">{c.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-black/60 border-t border-purple-900/60 flex items-center justify-between gap-3 shrink-0">
                <Link
                  href={`/events/${modalEvent.id}`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Full Rulebook Page</span>
                  <ExternalLink size={13} />
                </Link>

                <button
                  onClick={() => {
                    const targetId = modalEvent.id;
                    setModalEvent(null);
                    if (!user) {
                      router.push('/auth/register');
                    } else {
                      router.push(`/events/${targetId}`);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-900/30 transition-all flex items-center gap-1.5"
                >
                  <span>Register Now →</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCardItem({
  event,
  index,
  user,
  onQuickView
}: {
  event: Event;
  index: number;
  user: ReturnType<typeof useAuth>['user'];
  onQuickView: () => void;
}) {
  const router = useRouter();

  const teamLabel = event.min_team_size === event.max_team_size
    ? event.min_team_size === 1 ? 'Individual' : `${event.min_team_size} Members`
    : `${event.min_team_size}–${event.max_team_size} Members`;

  const spotsLeft = event.capacity ? event.capacity - (event.enrolled || 0) : null;
  const almostFull = spotsLeft !== null && spotsLeft < 20 && spotsLeft > 0;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push('/auth/register');
      return;
    }
    router.push(`/events/${event.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="group bg-[#0b0716] border border-purple-950/70 hover:border-purple-500/70 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/40 relative"
    >
      {/* Poster Banner */}
      <div className="relative h-44 overflow-hidden bg-slate-950">
        <img
          src={event.poster_url}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0716] via-[#0b0716]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {event.is_popular && (
            <span className="bg-amber-500/95 text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-sm">
              ★ Flagship
            </span>
          )}
          {almostFull && (
            <span className="bg-red-500/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              ⚡ {spotsLeft} Left
            </span>
          )}
          {isFull && (
            <span className="bg-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              Full
            </span>
          )}
        </div>

        {/* Fee Pill */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md shadow-sm ${
            event.fee === 0 ? 'bg-emerald-500/90 text-black' : 'bg-black/85 text-emerald-400 border border-emerald-500/40'
          }`}>
            {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
          </span>
        </div>

        {/* Club Tag */}
        <div className="absolute bottom-3 left-3">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white border border-white/10"
            style={{ background: `${event.club_color}dd` }}
          >
            {event.club_name}
          </span>
        </div>

        {/* Prize Pool Badge */}
        {event.prize_pool && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
            <Trophy size={11} />
            <span>{event.prize_pool}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
            <span>{event.event_code}</span>
            <span className="text-slate-400">{event.category}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors font-display leading-snug">
            {event.name}
          </h3>

          {event.tagline && (
            <p className="text-xs text-slate-400 line-clamp-1 font-sans">{event.tagline}</p>
          )}

          <p className="text-xs text-slate-400/90 line-clamp-2 leading-relaxed font-sans">
            {event.short_description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-1.5 pt-3 border-t border-purple-950/80 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={13} className="text-purple-400 shrink-0" />
            <span className="truncate">{event.date_start} • {event.start_time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={13} className="text-amber-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={13} className="text-emerald-400 shrink-0" />
            <span>{teamLabel}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-purple-950/80 flex items-center gap-2">
          <button
            onClick={onQuickView}
            className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold font-mono text-purple-200 transition-all flex items-center justify-center gap-1"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleRegister}
            disabled={isFull || !event.registration_open}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
              isFull || !event.registration_open
                ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-900/30'
            }`}
          >
            <span>{isFull ? 'Full' : !event.registration_open ? 'Closed' : 'Register'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
