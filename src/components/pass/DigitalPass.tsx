'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Participant, ParticipantPass, Registration } from '../../types';
import { Ticket, Download, Share2, ShieldCheck, Calendar, MapPin, CheckCircle2, Copy, Sparkles } from 'lucide-react';
import { FEST_CONFIG } from '../../data/festData';

interface DigitalPassProps {
  participant: Participant;
  pass: ParticipantPass;
  registrations: Registration[];
}

export const DigitalPass: React.FC<DigitalPassProps> = ({ participant, pass, registrations }) => {
  const passRef = useRef<HTMLDivElement>(null);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(pass.qrPayload);
    alert('Pass verification link copied to clipboard!');
  };

  const handleDownloadPass = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Ticket Pass Container */}
      <div
        ref={passRef}
        className="bg-slate-900/90 border-2 border-blue-500/40 rounded-3xl overflow-hidden shadow-2xl relative text-white ticket-notch-left ticket-notch-right mi-glow-card"
      >
        {/* Mood Indigo Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 p-6 flex items-center justify-between text-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl tracking-tight">
                {FEST_CONFIG.name}
              </span>
              <span className="text-xs font-mono font-bold bg-black/30 px-2 py-0.5 rounded border border-white/20">
                {FEST_CONFIG.edition}
              </span>
            </div>
            <p className="text-xs font-mono tracking-widest uppercase opacity-90 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              OFFICIAL DELEGATE FEST PASS
            </p>
          </div>

          <div className="h-12 w-12 rounded-xl overflow-hidden bg-black/40 border border-white/30 shrink-0">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* QR Code & ID Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div className="bg-white p-3 rounded-xl shrink-0 shadow-lg border-2 border-blue-500">
              <QRCodeSVG
                value={pass.qrPayload}
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">
                  AUTHORITATIVE DELEGATE ID
                </span>
                <span className="text-2xl font-extrabold font-mono text-white tracking-wider">
                  {participant.participantId}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{pass.passType} • {pass.status}</span>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                Scan at gate counter for badge printing & arena access.
              </p>
            </div>
          </div>

          {/* Participant Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block mb-0.5">DELEGATE NAME</span>
              <span className="text-sm font-bold text-white uppercase">{participant.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">COLLEGE / INSTITUTION</span>
              <span className="text-sm font-bold text-slate-200 truncate block">{participant.college}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">DEPARTMENT</span>
              <span className="text-slate-300 font-semibold">{participant.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">VALID DATES</span>
              <span className="text-slate-300 font-semibold">{pass.validDates}</span>
            </div>
          </div>

          {/* Registered Events Summary */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Registered Competitions ({registrations.length})</span>
            </span>

            <div className="space-y-1.5">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between font-mono"
                >
                  <span className="font-bold text-white">{reg.eventName}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    CONFIRMED
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-slate-800 text-center text-[10px] font-mono text-slate-400">
            <span>AMRITA VISHWA VIDYAPEETHAM • AMARAVATI CAMPUS</span>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleDownloadPass}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Print / Save Pass (PDF)</span>
        </button>

        <button
          onClick={handleCopyToken}
          className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold border border-slate-800 flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Verification Token</span>
        </button>
      </div>

    </div>
  );
};
