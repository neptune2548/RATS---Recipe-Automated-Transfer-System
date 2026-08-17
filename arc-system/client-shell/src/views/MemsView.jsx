import React, { useState, useEffect, useRef } from 'react';
import { Activity, Gauge, TrendingUp, Layers, CheckCircle2, AlertTriangle, XCircle, Server, Monitor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RATS_WS_URL = 'ws://127.0.0.1:8080/ws';

export const MemsView = () => {
  const { t } = useLanguage();
  const [machines, setMachines] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const wsRef = useRef(null);

  // Sync selectedId with live data
  useEffect(() => {
    if (machines.length > 0 && !selectedId) {
      setSelectedId(machines[0].id);
    }
  }, [machines, selectedId]);

  // Connect to WebSocket on mount
  useEffect(() => {
    let ws;
    let isComponentMounted = true;

    const connectWS = () => {
      try {
        ws = new WebSocket(RATS_WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isComponentMounted) setIsBackendOnline(true);
        };

        ws.onmessage = (event) => {
          if (!isComponentMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.machines) {
              // We map RATS machines to add mock OEE/parts based on their real backend state
              const mappedMachines = data.machines.map(m => {
                const status = m.status || 'OFFLINE';
                let oee = 0;
                let parts = 0;
                if (status === 'RUNNING') { oee = 95.0; parts = 1450; }
                else if (status === 'IDLE') { oee = 85.0; parts = 800; }
                else if (status === 'DOWN') { oee = 55.0; parts = 400; }
                
                return {
                  ...m,
                  light: status,
                  oee: oee,
                  parts: parts
                };
              });
              setMachines(mappedMachines);
            }
          } catch (e) {
            console.error('Failed to parse WS data:', e);
          }
        };

        ws.onerror = () => {
          if (isComponentMounted) setIsBackendOnline(false);
        };

        ws.onclose = () => {
          if (isComponentMounted) {
            setIsBackendOnline(false);
            setTimeout(connectWS, 3000);
          }
        };
      } catch (err) {
        if (isComponentMounted) {
          setIsBackendOnline(false);
          setTimeout(connectWS, 3000);
        }
      }
    };

    connectWS();

    return () => {
      isComponentMounted = false;
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const selectedMachine = machines.find(m => m.id === selectedId) || machines[0];

  const getTowerLightStyles = (stateLabel) => {
    switch (stateLabel) {
      case 'RUNNING':
        return {
          red: 'opacity-20 bg-red-500 border-red-800',
          yellow: 'opacity-20 bg-amber-400 border-amber-800',
          green: 'opacity-100 bg-emerald-500 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse'
        };
      case 'IDLE':
        return {
          red: 'opacity-20 bg-red-500 border-red-800',
          yellow: 'opacity-100 bg-amber-400 border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse',
          green: 'opacity-20 bg-emerald-500 border-emerald-800'
        };
      case 'DOWN':
        return {
          red: 'opacity-100 bg-red-600 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
          yellow: 'opacity-20 bg-amber-400 border-amber-800',
          green: 'opacity-20 bg-emerald-500 border-emerald-800'
        };
      default:
        return { 
          red: 'opacity-20 bg-slate-500 border-slate-800', 
          yellow: 'opacity-20 bg-slate-500 border-slate-800', 
          green: 'opacity-20 bg-slate-500 border-slate-800' 
        };
    }
  };

  // Calculate Overall Average OEE across all machines
  const totalOeeSum = machines.reduce((acc, m) => acc + m.oee, 0);
  const avgOee = machines.length > 0 ? Number((totalOeeSum / machines.length).toFixed(1)) : 0;
  const totalParts = machines.reduce((acc, m) => acc + m.parts, 0);
  const runningCount = machines.filter(m => m.light === 'RUNNING').length;
  const idleCount = machines.filter(m => m.light === 'IDLE').length;
  const downCount = machines.filter(m => m.light === 'DOWN').length;

  const getOverallLightCriteria = (val) => {
    if (val > 90) {
      return {
        color: 'GREEN',
        title: 'FLEET OEE: EXCELLENT',
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
        border: 'border-emerald-500/40',
        text: 'text-emerald-600 dark:text-emerald-400',
        dot: 'bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.9)] animate-pulse',
        badge: 'bg-emerald-500 text-white',
      };
    } else if (val >= 80) {
      return {
        color: 'YELLOW',
        title: 'FLEET OEE: MODERATE',
        bg: 'bg-amber-500/10 dark:bg-amber-950/40',
        border: 'border-amber-500/40',
        text: 'text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.9)] animate-pulse',
        badge: 'bg-amber-500 text-slate-950',
      };
    } else {
      return {
        color: 'RED',
        title: 'FLEET OEE: CRITICAL',
        bg: 'bg-red-500/10 dark:bg-red-950/40',
        border: 'border-red-500/40',
        text: 'text-red-600 dark:text-red-400',
        dot: 'bg-red-600 shadow-[0_0_16px_rgba(239,68,68,0.9)] animate-pulse',
        badge: 'bg-red-600 text-white',
      };
    }
  };

  const overallLight = getOverallLightCriteria(avgOee);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-300 dark:border-slate-800 rounded-md shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
          <div>
            <h2 className="font-header text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              {t('mems_title')}
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1.5 ${
                isBackendOnline 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isBackendOnline ? t('online') : t('offline')}
              </span>
            </h2>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {t('mems_sub')}
            </p>
          </div>
        </div>

      </div>

      {!isBackendOnline && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-700 rounded-lg font-mono text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 animate-bounce" />
            <span>
              <strong>{t('offline')}:</strong> Waiting for backend telemetry stream...
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Same split layout as RatsView */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Machine List */}
        <div className="industrial-card lg:col-span-1 space-y-0">
          <div className="industrial-card-header">
            <span>{t('bonder_fleet') || 'BONDER FLEET'}</span>
            <span className="text-xs text-slate-500 font-mono">{machines.length}{t('machines_count') || ' MACHINES'}</span>
          </div>

          <div className="p-3 space-y-2 max-h-[520px] overflow-y-auto">
            {machines.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-slate-400">Loading machines from database...</div>
            ) : (
              machines.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`w-full text-left p-3 rounded border font-mono transition-all flex flex-col gap-1 ${
                    selectedId === m.id
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{m.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      m.light === 'RUNNING' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' :
                      m.light === 'IDLE' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800' :
                      m.light === 'DOWN' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-800' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}>
                      {m.light}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-semibold">{m.id}</span>
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">OEE: {m.oee}%</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Selected Machine Action Panel & Details */}
        <div className="industrial-card lg:col-span-2 space-y-0">
          <div className="industrial-card-header">
            <span>{t('selected_machine') || 'SELECTED MACHINE: '} {selectedMachine?.name} [{selectedMachine?.id}]</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
              <Monitor className="w-4 h-4" />
              TELEMETRY ACTIVE
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            
            {/* Overall Fleet Status (Moved from header and bottom to here) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Overall OEE */}
              <div className={`p-3 rounded border ${overallLight.bg} ${overallLight.border} flex items-center gap-3 shadow-xs`}>
                <div className={`w-8 h-8 rounded-full ${overallLight.dot} flex items-center justify-center shadow-lg flex-shrink-0`}></div>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{t('oee_overall') || 'OVERALL OEE'}</div>
                  <div className={`font-bold text-sm ${overallLight.text}`}>{avgOee}% — {overallLight.title.replace('FLEET OEE: ', '')}</div>
                </div>
              </div>

              {/* Total Output */}
              <div className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">{t('total_output') || 'TOTAL OUTPUT'}</div>
                  <div className="font-bold text-sm text-sky-600 dark:text-sky-400">{totalParts.toLocaleString()} PARTS</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-bold mr-2 text-[10px] uppercase">STATUS COUNT:</span>
              <div className="flex items-center gap-1.5 pr-4 border-r border-slate-300 dark:border-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{runningCount} RUN</span>
              </div>
              <div className="flex items-center gap-1.5 pr-4 border-r border-slate-300 dark:border-slate-600">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">{idleCount} IDLE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-red-700 dark:text-red-400 font-bold">{downCount} DOWN</span>
              </div>
            </div>

            {/* Selected Machine Details Container */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-xs mt-2">
              <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                <Monitor className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                TELEMETRY: {selectedMachine?.name}
              </div>
              
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-900">
                {/* OEE Highlight */}
                <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">Efficiency</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{selectedMachine?.oee}%</div>
                  </div>
                  <Gauge className={`w-7 h-7 opacity-70 ${
                    selectedMachine?.oee > 90 ? 'text-emerald-500' : selectedMachine?.oee > 75 ? 'text-amber-500' : 'text-red-500'
                  }`} />
                </div>
                
                {/* Output Parts */}
                <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">Production</div>
                    <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-0.5">{selectedMachine?.parts.toLocaleString()}</div>
                  </div>
                  <TrendingUp className="w-7 h-7 text-sky-500 opacity-70" />
                </div>
              </div>

              {/* Tower Light Visual */}
              {selectedMachine && (() => {
                const l = getTowerLightStyles(selectedMachine.light);
                return (
                  <div className="px-4 pb-4 bg-white dark:bg-slate-900">
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-between">
                      <div className="text-slate-400 font-mono text-[10px] uppercase tracking-widest pl-2">
                        Tower Light
                      </div>
                      <div className="flex items-center gap-3 p-1.5 bg-black rounded-md border border-slate-800">
                        <div className={`w-3.5 h-3.5 rounded-full ${l.red}`}></div>
                        <div className={`w-3.5 h-3.5 rounded-full ${l.yellow}`}></div>
                        <div className={`w-3.5 h-3.5 rounded-full ${l.green}`}></div>
                      </div>
                      <div className={`text-xs pr-2 font-bold font-mono tracking-widest ${
                          selectedMachine.light === 'RUNNING' ? 'text-emerald-400' :
                          selectedMachine.light === 'IDLE' ? 'text-amber-400' :
                          selectedMachine.light === 'DOWN' ? 'text-red-400' : 'text-slate-500'
                        }`}>
                        {selectedMachine.light}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
