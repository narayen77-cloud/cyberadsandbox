import React, { useState, useEffect } from 'react';
import { Activity, X, Trash2, ChevronDown, ChevronUp, CheckCircle, Terminal } from 'lucide-react';
import { ga4 } from '../utils/ga4';
import { GA4Event } from '../types';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export const GA4DebugDrawer: React.FC = () => {
  const { isGA4DrawerOpen, toggleGA4Drawer } = useTheme();
  const [events, setEvents] = useState<GA4Event[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(ga4.getEvents());
    const unsubscribe = ga4.subscribe((newEvent) => {
      setEvents(ga4.getEvents());
    });
    return unsubscribe;
  }, []);

  if (!isGA4DrawerOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 text-slate-200 border-t-2 border-emerald-500 shadow-2xl font-mono max-h-[380px] flex flex-col"
      >
        {/* Header Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-400">GA4 Analytics Event Inspector</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] border border-slate-700">
              ID: {ga4.getMeasurementId()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => ga4.clearEvents()}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
              title="Clear event history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={toggleGA4Drawer}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Event List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 text-xs">
          {events.length === 0 ? (
            <div className="py-8 text-center text-slate-500 flex flex-col items-center gap-2">
              <Terminal className="w-6 h-6 stroke-1 text-slate-600" />
              <p>No GA4 events captured yet in this session.</p>
              <p className="text-[10px] text-slate-600">
                Click articles, search, subscribe, or submit forms to see live telemetry!
              </p>
            </div>
          ) : (
            events.map((evt) => {
              const isExpanded = expandedId === evt.id;
              return (
                <div
                  key={evt.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 hover:border-slate-700 transition-colors"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                        {evt.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {evt.params.page_title || evt.params.title || ''}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Expanded Payload */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-emerald-300/90 bg-slate-950 p-2 rounded border border-slate-800/50 overflow-x-auto">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(evt.params, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
