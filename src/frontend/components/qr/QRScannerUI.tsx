'use client';

import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { QrCode, Search, ShieldCheck, AlertTriangle, CheckCircle2, User, Building, Clock, MapPin, RefreshCw } from 'lucide-react';
import { CheckInRecord } from '../../types';

export const QRScannerUI = () => {
  const { getRegistrationByToken, performCheckIn, checkInHistory } = useFest();
  
  const [scannedInput, setScannedInput] = useState('');
  const [selectedDesk, setSelectedDesk] = useState('Desk 1 - Main Gate');
  const [selectedEventId, setSelectedEventId] = useState('evt-01');
  const [lastCheckInResult, setLastCheckInResult] = useState<{
    success: boolean;
    message: string;
    record?: CheckInRecord;
  } | null>(null);

  const [lookupParticipant, setLookupParticipant] = useState<any>(null);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedInput.trim()) return;

    // Search token or Participant ID
    const found = getRegistrationByToken(scannedInput.trim());
    if (found) {
      setLookupParticipant(found);
      setLastCheckInResult(null);
    } else {
      setLookupParticipant(null);
      setLastCheckInResult({
        success: false,
        message: 'Invalid or unknown Participant QR Code / Pass Token.',
      });
    }
  };

  const handleExecuteCheckIn = () => {
    if (!lookupParticipant) return;
    const res = performCheckIn(
      lookupParticipant.pass.token,
      selectedEventId,
      selectedDesk
    );
    setLastCheckInResult(res);
  };

  const handleQuickDemoScan = (token: string) => {
    setScannedInput(token);
    const found = getRegistrationByToken(token);
    if (found) {
      setLookupParticipant(found);
      setLastCheckInResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 sm:px-6">
      
      {/* Scanner Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ORGANIZER DESK SCANNER</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              Festival Gate & Venue Check-In
            </h2>
          </div>

          {/* Desk Selector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Desk:</span>
            <select
              value={selectedDesk}
              onChange={(e) => setSelectedDesk(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="Desk 1 - Main Gate">Desk 1 - Main Gate</option>
              <option value="Desk 2 - Innovation Hall">Desk 2 - Innovation Hall</option>
              <option value="Desk 3 - Amphitheatre">Desk 3 - Amphitheatre</option>
            </select>
          </div>
        </div>

        {/* Target Event Check-in Selector */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300">
          <span className="text-slate-400">Checking in for:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-amber-400 px-3 py-1.5 rounded-lg focus:outline-none font-bold"
          >
            <option value="evt-01">HackArena 3.0 (Innovation Hall)</option>
            <option value="evt-02">RoboWars 2026 (Amphitheatre)</option>
            <option value="evt-04">Gaming Arena Valorant (Esports Stadium)</option>
            <option value="evt-05">Battle of Bands (Main Stage)</option>
          </select>
        </div>
      </div>

      {/* Camera Simulator & Manual QR Code Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Camera Scanner Box Simulation */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[280px] relative overflow-hidden group">
          <div className="w-48 h-48 border-2 border-dashed border-primary/60 rounded-2xl flex flex-col items-center justify-center space-y-2 relative bg-slate-900/40">
            <QrCode className="w-12 h-12 text-primary animate-pulse" />
            <span className="text-xs font-mono text-slate-400">ALIGN QR CODE HERE</span>
            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
          </div>
          
          <p className="text-xs font-mono text-slate-400 mt-4">
            Camera active • Ready for participant scan
          </p>

          <button
            onClick={() => handleQuickDemoScan('parinaam268k3n91-a8f9c72e1d04')}
            className="mt-3 text-[11px] font-mono text-primary hover:underline"
          >
            [ Simulate Demo QR Scan: PARINAAM26-8K3N91 ]
          </button>
        </div>

        {/* Manual Token Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <span>Manual Token / ID Search</span>
          </h3>

          <form onSubmit={handleScanSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Paste QR payload token or Participant ID..."
              value={scannedInput}
              onChange={(e) => setScannedInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-primary"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2"
            >
              <span>Verify Registration Token</span>
            </button>
          </form>

          {/* Quick instructions */}
          <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-2 border-t border-slate-800">
            <p>• Validates token against database</p>
            <p>• Prevents duplicate check-in entries</p>
          </div>
        </div>

      </div>

      {/* Verification & Check-in Execution Results Area */}
      {lookupParticipant && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">✓ VERIFIED PARTICIPANT</span>
                <h3 className="text-xl font-bold text-white">{lookupParticipant.participant.name}</h3>
              </div>
            </div>

            <span className="text-sm font-mono font-bold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-white">
              {lookupParticipant.participant.participantId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block">College</span>
              <span className="font-bold text-white">{lookupParticipant.participant.college}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Department</span>
              <span className="text-slate-300">{lookupParticipant.participant.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Pass Status</span>
              <span className="text-emerald-400 font-bold">{lookupParticipant.pass.status}</span>
            </div>
          </div>

          {/* Action to Mark Check-in */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-400">
              Ready to record check-in at <strong className="text-white">{selectedDesk}</strong>
            </div>

            <button
              onClick={handleExecuteCheckIn}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-sm shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK CHECK-IN</span>
            </button>
          </div>

        </div>
      )}

      {/* Alert Result Display */}
      {lastCheckInResult && (
        <div
          className={`p-5 rounded-2xl border flex items-start gap-4 ${
            lastCheckInResult.success
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
          }`}
        >
          {lastCheckInResult.success ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <h4 className="font-mono font-bold text-sm">
              {lastCheckInResult.success ? 'CHECK-IN RECORDED' : 'WARNING / ATTENTION'}
            </h4>
            <p className="text-xs font-mono leading-relaxed">{lastCheckInResult.message}</p>
          </div>
        </div>
      )}

      {/* Live Check-in Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Recent Check-In Log ({checkInHistory.length})</span>
          </span>
        </h3>

        {checkInHistory.length === 0 ? (
          <p className="text-xs font-mono text-slate-400 py-4 text-center">
            No check-ins recorded yet in current session.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">Participant ID</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Desk</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {checkInHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/50">
                    <td className="py-2.5 text-slate-400">{item.checkedInAt}</td>
                    <td className="py-2.5 text-white font-bold">{item.participantId}</td>
                    <td className="py-2.5">{item.participantName}</td>
                    <td className="py-2.5 text-amber-400">{item.eventName}</td>
                    <td className="py-2.5 text-slate-400">{item.checkedInBy}</td>
                    <td className="py-2.5">
                      {item.status === 'SUCCESS' ? (
                        <span className="text-emerald-400 font-bold">✓ OK</span>
                      ) : (
                        <span className="text-amber-400 font-bold">⚠ DUPLICATE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
