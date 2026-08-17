import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { Server, Database, Shield, Cpu, Activity, CheckCircle2, Terminal } from 'lucide-react';

export const SystemView = ({ onOpenAuthModal }) => {
  const { currentRole } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-300 dark:border-slate-800 rounded-md shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 rounded text-sky-700 dark:text-sky-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-header text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              System Infrastructure & Role Security
            </h2>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Backend Microservices, Database Connection, and Role Management
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-mono-industrial text-xs font-bold rounded shadow hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
        >
          <Shield className="w-4 h-4 text-amber-400" />
          <span>LOGIN / CHANGE ROLE</span>
        </button>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Service 1: Express Auth & Recipe API */}
        <div className="industrial-card">
          <div className="industrial-card-header">
            <span>EXPRESS SERVICE ENGINE</span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ONLINE
            </span>
          </div>
          <div className="p-4 space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Auth Route:</span>
              <span className="font-semibold text-slate-900 dark:text-white">/api/v1/auth</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Recipe API:</span>
              <span className="font-semibold text-slate-900 dark:text-white">/api/v1/recipes</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">SECS/GEM Driver:</span>
              <span className="font-semibold text-emerald-600">CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Service 2: MEMS Python FastAPI Server */}
        <div className="industrial-card">
          <div className="industrial-card-header">
            <span>MEMS FASTAPI ENGINE</span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ONLINE
            </span>
          </div>
          <div className="p-4 space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Database:</span>
              <span className="font-semibold text-slate-900 dark:text-white">SQLite (mems.db)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Deduplication Gap:</span>
              <span className="font-semibold text-slate-900 dark:text-white">2.0 seconds</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">ESP32 Listener:</span>
              <span className="font-semibold text-emerald-600">LISTENING</span>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="industrial-card">
          <div className="industrial-card-header">
            <span>ACTIVE ROLE CREDENTIALS</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="p-4 space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Current Role:</span>
              <span className="font-bold text-sky-600 uppercase">{currentRole}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Operator Level:</span>
              <span className="font-semibold text-emerald-600">ACTIVE</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 py-1">
              <span className="text-slate-500">Technician Level:</span>
              <span className="font-semibold">PROTECTED</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Administrator Level:</span>
              <span className="font-semibold">PROTECTED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
