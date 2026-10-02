'use client';

import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { MOCK_EVENTS } from '../../data/eventsData';
import { FestEvent, Participant, ParticipantPass } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { CheckCircle2, User, Ticket, CreditCard, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface RegistrationFlowProps {
  initialEventId?: string;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ initialEventId }) => {
  const { registerParticipant } = useFest();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [basicInfo, setBasicInfo] = useState({
    name: 'Deepak E',
    email: 'parinaam@av.amrita.edu',
    phone: '+91 98765 43210',
    college: 'Amrita Vishwa Vidyapeetham',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    rollNumber: 'CB.EN.U4CSE22015',
    city: 'Coimbatore',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 2 State (Selected Events)
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(
    initialEventId ? [initialEventId] : ['evt-01', 'evt-02']
  );

  // Completed State
  const [completedPass, setCompletedPass] = useState<ParticipantPass | null>(null);
  const [completedParticipant, setCompletedParticipant] = useState<Participant | null>(null);

  // Validation step 1
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!basicInfo.name.trim()) errors.name = 'Full name is required';
    if (!basicInfo.email.trim() || !basicInfo.email.includes('@')) errors.email = 'Valid email is required';
    if (!basicInfo.phone.trim() || basicInfo.phone.length < 10) errors.phone = 'Valid phone number required';
    if (!basicInfo.college.trim()) errors.college = 'College name is required';
    if (!basicInfo.department.trim()) errors.department = 'Department is required';
    if (!basicInfo.year) errors.year = 'Year of study is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const toggleEventSelection = (eventId: string) => {
    if (selectedEventIds.includes(eventId)) {
      setSelectedEventIds(selectedEventIds.filter((id) => id !== eventId));
    } else {
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };

  const selectedEvents = MOCK_EVENTS.filter((e) => selectedEventIds.includes(e.id));
  const totalAmount = selectedEvents.reduce((sum, e) => sum + e.fee, 0);

  const handleConfirmRegistration = () => {
    // Invoke context registration
    const result = registerParticipant(basicInfo, selectedEventIds);
    setCompletedParticipant(result.participant);
    setCompletedPass(result.pass);
    setCurrentStep(4); // Step 4 = Success Screen

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti failed:', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Progress Steps Header */}
      {currentStep < 4 && (
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
            <span className={currentStep >= 1 ? 'text-primary font-bold' : ''}>1. BASIC INFO</span>
            <span className={currentStep >= 2 ? 'text-primary font-bold' : ''}>2. SELECT EVENTS</span>
            <span className={currentStep >= 3 ? 'text-primary font-bold' : ''}>3. REVIEW & CONFIRM</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Basic Participant Info */}
      {currentStep === 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-display">Step 1: Participant Information</h2>
            <p className="text-sm text-slate-400">
              Provide your details for festival delegate badge and QR pass issuance.
            </p>
          </div>

          <form onSubmit={handleNextStep1} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="e.g. Deepak E"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.name ? 'border-primary' : 'border-slate-800'
                  } text-white text-sm focus:outline-none focus:border-primary`}
                />
                {formErrors.name && <p className="text-xs text-primary font-mono">{formErrors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={basicInfo.email}
                  onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                  placeholder="e.g. deepak@college.edu"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.email ? 'border-primary' : 'border-slate-800'
                  } text-white text-sm focus:outline-none focus:border-primary`}
                />
                {formErrors.email && <p className="text-xs text-primary font-mono">{formErrors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={basicInfo.phone}
                  onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.phone ? 'border-primary' : 'border-slate-800'
                  } text-white text-sm focus:outline-none focus:border-primary`}
                />
                {formErrors.phone && <p className="text-xs text-primary font-mono">{formErrors.phone}</p>}
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  College / Institution *
                </label>
                <input
                  type="text"
                  value={basicInfo.college}
                  onChange={(e) => setBasicInfo({ ...basicInfo, college: e.target.value })}
                  placeholder="e.g. Amrita Vishwa Vidyapeetham"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.college ? 'border-primary' : 'border-slate-800'
                  } text-white text-sm focus:outline-none focus:border-primary`}
                />
                {formErrors.college && <p className="text-xs text-primary font-mono">{formErrors.college}</p>}
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Department / Branch *
                </label>
                <input
                  type="text"
                  value={basicInfo.department}
                  onChange={(e) => setBasicInfo({ ...basicInfo, department: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border ${
                    formErrors.department ? 'border-primary' : 'border-slate-800'
                  } text-white text-sm focus:outline-none focus:border-primary`}
                />
                {formErrors.department && <p className="text-xs text-primary font-mono">{formErrors.department}</p>}
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  Year of Study *
                </label>
                <select
                  value={basicInfo.year}
                  onChange={(e) => setBasicInfo({ ...basicInfo, year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate (M.Tech / MBA / MCA)</option>
                </select>
              </div>

              {/* Roll / Student ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  College Student / Roll ID (Optional)
                </label>
                <input
                  type="text"
                  value={basicInfo.rollNumber}
                  onChange={(e) => setBasicInfo({ ...basicInfo, rollNumber: e.target.value })}
                  placeholder="e.g. CB.EN.U4CSE22015"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  City / State
                </label>
                <input
                  type="text"
                  value={basicInfo.city}
                  onChange={(e) => setBasicInfo({ ...basicInfo, city: e.target.value })}
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-fest-brand flex items-center gap-2 transition-all"
              >
                <span>Proceed to Event Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Event Selection */}
      {currentStep === 2 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-display">Step 2: Select Competitions & Workshops</h2>
            <p className="text-sm text-slate-400">
              Pick the events you wish to participate in during Parinaam 2026.
            </p>
          </div>

          {/* Events Selector List */}
          <div className="space-y-3">
            {MOCK_EVENTS.map((event) => {
              const isSelected = selectedEventIds.includes(event.id);
              return (
                <div
                  key={event.id}
                  onClick={() => toggleEventSelection(event.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {event.eventCode}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {event.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{event.name}</h4>
                      <p className="text-xs text-slate-400">
                        {event.date} • {event.venue} • {event.teamSize}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-white block">
                      {formatCurrency(event.fee)}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      Prize: {event.prizePool}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fee Summary Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-sm">
            <div>
              <span className="text-slate-400 text-xs font-mono block">Selected Events</span>
              <span className="font-bold text-white font-mono">{selectedEvents.length} Events Chosen</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-mono block">Total Registration Fee</span>
              <span className="text-xl font-extrabold text-primary font-mono">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Basic Info</span>
            </button>

            <button
              onClick={() => {
                if (selectedEvents.length === 0) {
                  alert('Please select at least one event to proceed.');
                  return;
                }
                setCurrentStep(3);
              }}
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-fest-brand flex items-center gap-2 transition-all"
            >
              <span>Review Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Confirm */}
      {currentStep === 3 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-display">Step 3: Review Registration Summary</h2>
            <p className="text-sm text-slate-400">
              Verify your information before authoritative pass issuance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Participant Card */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-mono uppercase font-bold text-primary flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Participant Profile</span>
              </h4>
              <div className="space-y-1.5 text-slate-300">
                <p><strong className="text-white font-semibold">Name:</strong> {basicInfo.name}</p>
                <p><strong className="text-white font-semibold">Email:</strong> {basicInfo.email}</p>
                <p><strong className="text-white font-semibold">Phone:</strong> {basicInfo.phone}</p>
                <p><strong className="text-white font-semibold">College:</strong> {basicInfo.college}</p>
                <p><strong className="text-white font-semibold">Dept / Year:</strong> {basicInfo.department} ({basicInfo.year})</p>
                {basicInfo.rollNumber && <p><strong className="text-white font-semibold">Roll ID:</strong> {basicInfo.rollNumber}</p>}
              </div>
            </div>

            {/* Selected Events Breakdown */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                <span>Selected Registrations ({selectedEvents.length})</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <div>
                      <span className="font-bold text-white block">{evt.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{evt.category} • Day {evt.day}</span>
                    </div>
                    <span className="font-mono text-slate-200 font-semibold">{formatCurrency(evt.fee)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Payment & Security Confirmation Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="text-white font-bold block">Authoritative Pass Allocation</span>
                <span className="text-slate-400">QR token will be securely generated upon confirmation.</span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">Total Payable</span>
              <span className="text-2xl font-extrabold text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Events</span>
            </button>

            <button
              onClick={handleConfirmRegistration}
              className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-fest-brand flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Confirm & Generate Pass</span>
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Screen */}
      {currentStep === 4 && completedParticipant && completedPass && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-12 text-center space-y-8 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              YOU'RE IN • REGISTRATION CONFIRMED
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
              Welcome to Parinaam 2026!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your official fest delegate pass and unique QR verification code have been generated.
            </p>
          </div>

          {/* Pass Preview Card */}
          <div className="max-w-sm mx-auto bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-primary">PARINAAM 2026 PASS</span>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400">PARTICIPANT ID</span>
              <p className="text-xl font-extrabold font-mono text-white tracking-wider">
                {completedParticipant.participantId}
              </p>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <p><strong className="text-white">Delegate:</strong> {completedParticipant.name}</p>
              <p><strong className="text-white">College:</strong> {completedParticipant.college}</p>
              <p><strong className="text-white">Registered Events:</strong> {selectedEvents.length} Events</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/pass"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-fest-brand flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>View & Download Digital Pass</span>
            </Link>

            <Link
              href="/events"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm"
            >
              Explore More Events
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
