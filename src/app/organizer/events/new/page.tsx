'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info, MapPin, Users, IndianRupee, Trophy, FileText,
  Plus, Trash2, ChevronDown, Save, Eye, AlertCircle,
  Clock, Tag, CheckCircle, Layers
} from 'lucide-react';
import { useRequireRole } from '@/context/AuthContext';

const CATEGORIES = [
  'Technical', 'Cultural', 'Coding & Hackathon', 'Robotics',
  'Gaming', 'Workshops', 'Quiz & Literary', 'Arts & Media',
  'Management', 'Dance', 'Music', 'Film & Media', 'Sports', 'Other'
];

const SECTIONS = [
  { id: 'basic',       label: 'Basic Info',     icon: <Info size={15} /> },
  { id: 'schedule',   label: 'Schedule',        icon: <Clock size={15} /> },
  { id: 'team',       label: 'Team & Capacity', icon: <Users size={15} /> },
  { id: 'fees',       label: 'Fees & Prizes',   icon: <IndianRupee size={15} /> },
  { id: 'rounds',     label: 'Rounds',          icon: <Layers size={15} /> },
  { id: 'rules',      label: 'Rules & Eligibility', icon: <FileText size={15} /> },
  { id: 'coordinators', label: 'Coordinators',  icon: <Users size={15} /> },
  { id: 'publish',    label: 'Publish',         icon: <Eye size={15} /> },
];

interface Round { name: string; description: string; date: string; }
interface Coordinator { name: string; role: string; phone: string; email: string; }

export default function CreateEventPage() {
  const { user } = useRequireRole(['club_admin', 'super_admin']);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([]);

  // Form state
  const [form, setForm] = useState({
    name: '', tagline: '', short_description: '', full_description: '',
    category: '', tags: [] as string[], tagInput: '',
    venue: '', date_start: '', date_end: '', start_time: '', end_time: '',
    day_number: '1',
    min_team_size: '1', max_team_size: '1',
    capacity: '', fee: '0', prize_pool: '',
    eligibility: '',
    rules: [''] as string[],
    rounds: [] as Round[],
    coordinators: [{ name: '', role: '', phone: '', email: '' }] as Coordinator[],
    poster_url: '', rulebook_url: '',
    status: 'draft', registration_open: false, is_popular: false,
    club_id: '',
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetch('/api/clubs').then(r => r.json()).then(d => {
        if (d.success) setClubs(d.data.clubs);
      });
    }
  }, [user]);

  const addTag = () => {
    if (!form.tagInput.trim()) return;
    set('tags', [...form.tags, form.tagInput.trim()]);
    set('tagInput', '');
  };

  const removeTag = (i: number) => set('tags', form.tags.filter((_, idx) => idx !== i));

  const addRule = () => set('rules', [...form.rules, '']);
  const updateRule = (i: number, v: string) => set('rules', form.rules.map((r, idx) => idx === i ? v : r));
  const removeRule = (i: number) => set('rules', form.rules.filter((_, idx) => idx !== i));

  const addRound = () => set('rounds', [...form.rounds, { name: '', description: '', date: '' }]);
  const updateRound = (i: number, k: keyof Round, v: string) =>
    set('rounds', form.rounds.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const removeRound = (i: number) => set('rounds', form.rounds.filter((_, idx) => idx !== i));

  const addCoord = () => set('coordinators', [...form.coordinators, { name: '', role: '', phone: '', email: '' }]);
  const updateCoord = (i: number, k: keyof Coordinator, v: string) =>
    set('coordinators', form.coordinators.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const removeCoord = (i: number) => set('coordinators', form.coordinators.filter((_, idx) => idx !== i));

  const handleSave = async (publish = false) => {
    if (!form.name.trim()) { setError('Event name is required'); setActiveSection('basic'); return; }
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      status: publish ? 'published' : form.status,
      registration_open: publish ? true : form.registration_open,
      fee: parseInt(form.fee) || 0,
      min_team_size: parseInt(form.min_team_size) || 1,
      max_team_size: parseInt(form.max_team_size) || 1,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      day_number: parseInt(form.day_number) || 1,
      rules: form.rules.filter(r => r.trim()),
      tags: form.tags,
      rounds: form.rounds.filter(r => r.name.trim()),
      coordinators: form.coordinators.filter(c => c.name.trim()),
      club_id: user?.role === 'super_admin' ? form.club_id : user?.club_id,
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (data.success) {
      router.push('/organizer');
    } else {
      setError(data.error || 'Failed to create event');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05030a] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Event</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {user.role === 'super_admin' ? 'Super Admin — any club' : user.club_name}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50">
              <Save size={14} /> Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg disabled:opacity-50">
              <Eye size={14} /> Publish
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
            <AlertCircle size={15} />{error}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sticky top-24 space-y-1">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-xl text-sm transition-all ${activeSection === s.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

                {/* ── BASIC INFO ── */}
                {activeSection === 'basic' && (
                  <>
                    <SectionHeader title="Basic Information" />
                    {user.role === 'super_admin' && (
                      <FormField label="Club *">
                        <select value={form.club_id} onChange={e => set('club_id', e.target.value)} className={sel}>
                          <option value="">Select club</option>
                          {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </FormField>
                    )}
                    <FormField label="Event Name *">
                      <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. HackArena 3.0" className={inp} />
                    </FormField>
                    <FormField label="Tagline">
                      <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="One-line hook" className={inp} />
                    </FormField>
                    <FormField label="Category">
                      <select value={form.category} onChange={e => set('category', e.target.value)} className={sel}>
                        <option value="">Select category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Short Description">
                      <textarea value={form.short_description} onChange={e => set('short_description', e.target.value)}
                        rows={2} placeholder="Brief summary shown on event cards" className={txta} />
                    </FormField>
                    <FormField label="Full Description">
                      <textarea value={form.full_description} onChange={e => set('full_description', e.target.value)}
                        rows={5} placeholder="Detailed event description — markdown supported" className={txta} />
                    </FormField>
                    {/* Tags */}
                    <FormField label="Tags">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {form.tags.map((t, i) => (
                          <span key={i} className="flex items-center gap-1 bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                            {t} <button onClick={() => removeTag(i)}><Trash2 size={10} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={form.tagInput} onChange={e => set('tagInput', e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          placeholder="Add tag & press Enter" className={`${inp} flex-1`} />
                        <button onClick={addTag} className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 px-3 rounded-lg text-sm">Add</button>
                      </div>
                    </FormField>
                    <FormField label="Event Poster URL">
                      <input value={form.poster_url} onChange={e => set('poster_url', e.target.value)} placeholder="https://..." className={inp} />
                    </FormField>
                    <FormField label="Rulebook / PDF URL">
                      <input value={form.rulebook_url} onChange={e => set('rulebook_url', e.target.value)} placeholder="https://..." className={inp} />
                    </FormField>
                  </>
                )}

                {/* ── SCHEDULE ── */}
                {activeSection === 'schedule' && (
                  <>
                    <SectionHeader title="Schedule & Venue" />
                    <FormField label="Venue">
                      <input value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Room / Hall / Location" className={inp} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Start Date">
                        <input type="date" value={form.date_start} onChange={e => set('date_start', e.target.value)} className={inp} />
                      </FormField>
                      <FormField label="End Date">
                        <input type="date" value={form.date_end} onChange={e => set('date_end', e.target.value)} className={inp} />
                      </FormField>
                      <FormField label="Start Time">
                        <input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} className={inp} />
                      </FormField>
                      <FormField label="End Time">
                        <input type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)} className={inp} />
                      </FormField>
                    </div>
                    <FormField label="Fest Day">
                      <select value={form.day_number} onChange={e => set('day_number', e.target.value)} className={sel}>
                        <option value="1">Day 1</option>
                        <option value="2">Day 2</option>
                        <option value="3">Day 3</option>
                      </select>
                    </FormField>
                  </>
                )}

                {/* ── TEAM & CAPACITY ── */}
                {activeSection === 'team' && (
                  <>
                    <SectionHeader title="Team Size & Capacity" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Min Team Size">
                        <input type="number" min="1" value={form.min_team_size} onChange={e => set('min_team_size', e.target.value)} className={inp} />
                      </FormField>
                      <FormField label="Max Team Size">
                        <input type="number" min="1" value={form.max_team_size} onChange={e => set('max_team_size', e.target.value)} className={inp} />
                      </FormField>
                    </div>
                    <FormField label="Participant Capacity">
                      <input type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} placeholder="Leave blank for unlimited" className={inp} />
                    </FormField>
                    <p className="text-slate-500 text-xs">Min = Max = 1 means individual event. Capacity controls max registrations (enforced server-side).</p>
                  </>
                )}

                {/* ── FEES & PRIZES ── */}
                {activeSection === 'fees' && (
                  <>
                    <SectionHeader title="Fees & Prize Pool" />
                    <FormField label="Registration Fee (₹)">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                        <input type="number" min="0" value={form.fee} onChange={e => set('fee', e.target.value)} className={`${inp} pl-7`} />
                      </div>
                    </FormField>
                    <p className="text-slate-500 text-xs -mt-3">Set to 0 for free events. Students pay after registering via Razorpay.</p>
                    <FormField label="Prize Pool">
                      <input value={form.prize_pool} onChange={e => set('prize_pool', e.target.value)} placeholder="e.g. ₹1,00,000 or Certificates" className={inp} />
                    </FormField>
                  </>
                )}

                {/* ── ROUNDS ── */}
                {activeSection === 'rounds' && (
                  <>
                    <SectionHeader title="Event Rounds" subtitle="Optional: define multiple rounds (prelims, semis, finals)" />
                    {form.rounds.map((round, i) => (
                      <div key={i} className="bg-white/3 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">Round {i + 1}</span>
                          <button onClick={() => removeRound(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                        </div>
                        <FormField label="Round Name">
                          <input value={round.name} onChange={e => updateRound(i, 'name', e.target.value)} placeholder="e.g. Prelims / Finals" className={inp} />
                        </FormField>
                        <FormField label="Description">
                          <textarea value={round.description} onChange={e => updateRound(i, 'description', e.target.value)} rows={2} placeholder="What happens in this round" className={txta} />
                        </FormField>
                        <FormField label="Date">
                          <input type="date" value={round.date} onChange={e => updateRound(i, 'date', e.target.value)} className={inp} />
                        </FormField>
                      </div>
                    ))}
                    <button onClick={addRound} className="flex items-center gap-2 w-full border-2 border-dashed border-white/15 hover:border-purple-500/40 rounded-xl py-3 text-slate-500 hover:text-purple-400 text-sm transition-all justify-center">
                      <Plus size={15} /> Add Round
                    </button>
                  </>
                )}

                {/* ── RULES ── */}
                {activeSection === 'rules' && (
                  <>
                    <SectionHeader title="Rules & Eligibility" />
                    <FormField label="Eligibility Criteria">
                      <textarea value={form.eligibility} onChange={e => set('eligibility', e.target.value)}
                        rows={3} placeholder="Who can participate?" className={txta} />
                    </FormField>
                    <FormField label="Rules">
                      <div className="space-y-2">
                        {form.rules.map((rule, i) => (
                          <div key={i} className="flex gap-2">
                            <input value={rule} onChange={e => updateRule(i, e.target.value)}
                              placeholder={`Rule ${i + 1}`} className={`${inp} flex-1`} />
                            {form.rules.length > 1 && (
                              <button onClick={() => removeRule(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button onClick={addRule} className="mt-2 flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm">
                        <Plus size={14} /> Add Rule
                      </button>
                    </FormField>
                  </>
                )}

                {/* ── COORDINATORS ── */}
                {activeSection === 'coordinators' && (
                  <>
                    <SectionHeader title="Event Coordinators" subtitle="Contact persons visible to participants" />
                    {form.coordinators.map((c, i) => (
                      <div key={i} className="bg-white/3 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">Coordinator {i + 1}</span>
                          {form.coordinators.length > 1 && (
                            <button onClick={() => removeCoord(i)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField label="Full Name">
                            <input value={c.name} onChange={e => updateCoord(i, 'name', e.target.value)} placeholder="Name" className={inp} />
                          </FormField>
                          <FormField label="Role">
                            <input value={c.role} onChange={e => updateCoord(i, 'role', e.target.value)} placeholder="e.g. Event Head" className={inp} />
                          </FormField>
                          <FormField label="Phone">
                            <input value={c.phone} onChange={e => updateCoord(i, 'phone', e.target.value)} placeholder="+91 ..." className={inp} />
                          </FormField>
                          <FormField label="Email">
                            <input type="email" value={c.email} onChange={e => updateCoord(i, 'email', e.target.value)} placeholder="email@..." className={inp} />
                          </FormField>
                        </div>
                      </div>
                    ))}
                    <button onClick={addCoord} className="flex items-center gap-2 w-full border-2 border-dashed border-white/15 hover:border-purple-500/40 rounded-xl py-3 text-slate-500 hover:text-purple-400 text-sm transition-all justify-center">
                      <Plus size={15} /> Add Coordinator
                    </button>
                  </>
                )}

                {/* ── PUBLISH ── */}
                {activeSection === 'publish' && (
                  <>
                    <SectionHeader title="Publish Settings" />
                    <div className="space-y-4">
                      <Toggle label="Mark as Popular" desc="Show in featured/popular events section" value={form.is_popular} onChange={v => set('is_popular', v)} />
                      <Toggle label="Open Registrations" desc="Allow students to register immediately on publish" value={form.registration_open} onChange={v => set('registration_open', v)} />
                      <div className="border-t border-white/10 pt-4 flex gap-3">
                        <button onClick={() => handleSave(false)} disabled={saving}
                          className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50">
                          <Save size={15} /> Save as Draft
                        </button>
                        <button onClick={() => handleSave(true)} disabled={saving}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
                          {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={15} /> Publish Event</>}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared style strings
const inp  = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all";
const sel  = "w-full bg-[#0e0b1a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-all";
const txta = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between bg-white/3 border border-white/10 rounded-xl px-4 py-3">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-purple-600' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
