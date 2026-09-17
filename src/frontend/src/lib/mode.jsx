/* ============================================================
   BIOWATCH-AI — PROTOTYPE MODE CONTEXT
   Three modes, always visible in the top bar:
     DEMONSTRATION  clearly-labelled synthetic data
     RESEARCH       user-uploaded datasets / real experiments
     LIVE DATA      configured public API feeds
   ============================================================ */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const MODES = {
  DEMONSTRATION: {
    key: 'DEMONSTRATION',
    short: 'DEMO',
    color: 'var(--color-ev-simulated)',
    description:
      'All figures shown are deterministic synthetic values generated inside the browser for interface demonstration. No real surveillance data is present.',
    dataBadge: 'DEMO DATA',
  },
  RESEARCH: {
    key: 'RESEARCH',
    short: 'RESEARCH',
    color: 'var(--color-bw-primary-bright)',
    description:
      'Modules operate on datasets uploaded by the researcher. Only results actually computed in an experiment run are displayed; everything else reads "Awaiting experiment".',
    dataBadge: 'RESEARCH DATA',
  },
  LIVE: {
    key: 'LIVE',
    short: 'LIVE',
    color: 'var(--color-bw-data)',
    description:
      'Modules read from configured public data connectors. Unconfigured connectors are shown as such and are never substituted with synthetic values.',
    dataBadge: 'LIVE',
  },
};

const ModeCtx = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('bw.mode') || 'DEMONSTRATION'; }
    catch { return 'DEMONSTRATION'; }
  });
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bw.session') || 'null'); }
    catch { return null; }
  });

  useEffect(() => { try { localStorage.setItem('bw.mode', mode); } catch { /* ignore */ } }, [mode]);
  useEffect(() => {
    try {
      if (session) localStorage.setItem('bw.session', JSON.stringify(session));
      else localStorage.removeItem('bw.session');
    } catch { /* ignore */ }
  }, [session]);

  const value = useMemo(
    () => ({
      mode, setMode, meta: MODES[mode],
      isDemo: mode === 'DEMONSTRATION',
      isResearch: mode === 'RESEARCH',
      isLive: mode === 'LIVE',
      session, setSession,
    }),
    [mode, session],
  );
  return <ModeCtx.Provider value={value}>{children}</ModeCtx.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeCtx);
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>');
  return ctx;
}
