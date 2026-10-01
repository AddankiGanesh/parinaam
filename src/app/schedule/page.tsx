'use client';

import React, { useState } from 'react';
import { MOCK_EVENTS } from '../../data/eventsData';
import { Calendar, Clock, MapPin, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const dayEvents = MOCK_EVENTS.filter((e) => e.day === activeDay);

  const dayDates = {
    1: 'Saturday, October 11, 2026',
    2: 'Sunday, October 12, 2026',
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      <div className="space-y-3">
        <span className="text-xs font-pixel text-primary font-bold uppercase tracking-widest">
          TIMELINE & SLOTS
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-pixel">
          Festival Schedule
        </h1>
        <p className="text-slate-400 text-sm font-pixel max-w-xl">
          Plan your two days at Amrita campus. View event timing, venue blocks, and competition slots.
        </p>
      </div>

      {/* Day Selector Pills */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        {([1, 2] as (1 | 2)[]).map((dayNum) => (
          <button
            key={dayNum}
            onClick={() => setActiveDay(dayNum as 1 | 2)}
            className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold font-pixel transition-all flex flex-col items-center justify-center ${
              activeDay === dayNum
                ? 'bg-primary text-white shadow-fest-brand'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>DAY 0{dayNum}</span>
            <span className="text-[10px] font-normal opacity-80 hidden sm:block">
              {dayDates[dayNum].split(',')[1]}
            </span>
          </button>
        ))}
      </div>

      {/* Active Day Headline */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-sm font-mono text-slate-300">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-bold text-white">{dayDates[activeDay]}</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {dayEvents.length} Sessions Scheduled
        </span>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {dayEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-24 shrink-0 font-mono text-xs text-primary font-bold bg-primary/10 p-2.5 rounded-xl border border-primary/20 text-center">
                <Clock className="w-3.5 h-3.5 inline mr-1" />
                <span>{evt.startTime}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {evt.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{evt.eventCode}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{evt.name}</h3>
                <p className="text-xs text-slate-400">{evt.shortDescription}</p>
                
                <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {evt.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    {evt.prizePool}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/register?event=${evt.id}`}
              className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-primary text-white text-xs font-bold font-mono transition-colors text-center shrink-0"
            >
              Register Slot
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
