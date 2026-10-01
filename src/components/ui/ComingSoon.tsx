'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Sparkles, CheckCircle2 } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  subtitle: string;
  category: string;
  expectedDate?: string;
  backHref?: string;
  features?: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  subtitle,
  category,
  expectedDate = 'OCTOBER 2026',
  backHref = '/',
  features = ['Exclusive Drop', 'Limited Quantities', 'Festival Pass Holders Priority'],
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 sm:px-6">
      <div className="max-w-xl w-full text-center space-y-8 relative">
        
        {/* Glowing backdrop */}
        <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-amber-500 rounded-3xl opacity-30 blur-3xl pointer-events-none" />

        <div className="relative bg-[#0b0716] border-2 border-fuchsia-500/50 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 mi-glow-card">
          
          {/* Top Category Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-fuchsia-500/40 text-xs font-pixel text-[#ff00ff] shadow-purple-glow">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-widest uppercase">{category}</span>
            <span className="text-purple-600">•</span>
            <span className="text-amber-400 font-bold">{expectedDate}</span>
          </div>

          {/* Glitch / Pixel COMING SOON Banner */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black font-pixel tracking-widest text-[#ff00ff] drop-shadow-[0_0_15px_rgba(255,0,255,0.9)] uppercase">
              COMING SOON
            </h1>
            <h2 className="text-lg sm:text-xl font-bold font-pixel tracking-wider text-white">
              {title}
            </h2>
            <p className="text-xs sm:text-sm font-pixel text-slate-400 max-w-md mx-auto leading-relaxed tracking-wide">
              {subtitle}
            </p>
          </div>

          {/* Progress / Loading Bar */}
          <div className="space-y-1.5 max-w-sm mx-auto font-pixel text-left">
            <div className="flex justify-between text-[11px] text-slate-400 tracking-wider">
              <span>UNVEILING PROGRESS</span>
              <span className="text-amber-400 font-bold">88% LOADED</span>
            </div>
            <div className="w-full h-2.5 bg-purple-950/80 rounded-full border border-purple-800/80 overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-amber-400 rounded-full w-[88%] shadow-purple-glow" />
            </div>
          </div>

          {/* Feature highlights */}
          {features.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="text-[10px] font-pixel px-3 py-1 rounded-lg bg-purple-950/60 text-purple-200 border border-purple-800/80 tracking-wider"
                >
                  ✓ {f}
                </span>
              ))}
            </div>
          )}

          {/* Notify Me Form */}
          <div className="pt-2">
            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-pixel text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You will be notified the moment this drops!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for drop alert..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-900 text-white placeholder-slate-500 text-xs font-pixel focus:outline-none focus:border-fuchsia-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-pixel font-bold text-xs tracking-wider shadow-purple-glow flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>NOTIFY ME</span>
                </button>
              </form>
            )}
          </div>

          {/* Back button */}
          <div className="pt-4 border-t border-purple-950">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-xs font-pixel text-slate-400 hover:text-white transition-colors tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO MAIN STAGE</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
