/* ============================================================
   BIOWATCH-AI — APPLICATION SHELL
   Persistent sidebar navigation + top status bar with the
   always-visible prototype-mode indicator.
   ============================================================ */
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { NAV, STATUS_META, ALL_ITEMS } from '../lib/nav';
import { MODES, useMode } from '../lib/mode';
import { LogoLockup, Logo } from './Brand';
import { Pill, Dot, EvidenceTag } from './ui';
import { fmtTs } from '../lib/synth';
import { SAFE_LANGUAGE } from '../lib/evidence';

function Icon({ name, size = 15, className = '' }) {
  const C = Icons[name] || Icons.Circle;
  return <C size={size} strokeWidth={1.7} className={className} />;
}

function ModeSwitcher() {
  const { mode, setMode, meta } = useMode();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button" onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-sm border px-2.5 py-1.5 transition-colors hover:bg-bw-panel2"
        style={{ borderColor: meta.color + '66', background: meta.color + '12' }}
        title="Active prototype mode"
      >
        <Dot color={meta.color} pulse />
        <span className="font-mono text-[10px] tracking-[0.14em]" style={{ color: meta.color }}>
          MODE: {meta.key}
        </span>
        <Icons.ChevronDown size={12} className="text-bw-dim" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-[330px] rounded-md border border-bw-line bg-bw-panel p-2 shadow-2xl">
            <div className="bw-label mb-1.5 px-1">Prototype mode</div>
            {Object.values(MODES).map((m) => (
              <button
                key={m.key} type="button"
                onClick={() => { setMode(m.key); setOpen(false); }}
                className={`mb-1 block w-full rounded-sm border px-2.5 py-2 text-left transition-colors ${
                  mode === m.key ? 'border-bw-line2 bg-bw-panel2' : 'border-transparent hover:bg-bw-panel2/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Dot color={m.color} />
                  <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: m.color }}>
                    MODE {Object.keys(MODES).indexOf(m.key) + 1} — {m.key}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] leading-snug text-bw-dim">{m.description}</p>
              </button>
            ))}
            <p className="mt-1.5 border-t border-bw-line px-1 pt-1.5 text-[10px] leading-snug text-bw-dim">
              Switching mode never converts synthetic values into live values. Each module re-declares
              its own data state.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function CommandPalette({ open, setOpen }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  useEffect(() => { if (!open) setQ(''); }, [open]);
  if (!open) return null;
  const results = ALL_ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 9);
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[12vh] px-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg rounded-md border border-bw-line bg-bw-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-bw-line px-3 py-2.5">
          <Icons.Search size={14} className="text-bw-dim" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to module…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) { nav(results[0].to); setOpen(false); }
              if (e.key === 'Escape') setOpen(false);
            }}
            className="w-full bg-transparent text-[13px] text-bw-text outline-none placeholder:text-bw-dim"
          />
          <kbd className="rounded border border-bw-line px-1 font-mono text-[9px] text-bw-dim">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-1.5">
          {results.map((r) => (
            <button key={r.to} type="button"
              onClick={() => { nav(r.to); setOpen(false); }}
              className="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left hover:bg-bw-panel2">
              <Icon name={r.icon} size={14} className="text-bw-dim" />
              <span className="flex-1 text-[12px] text-bw-text">{r.label}</span>
              <span className="bw-label">{r.group}</span>
            </button>
          ))}
          {results.length === 0 && <div className="px-3 py-6 text-center text-[12px] text-bw-dim">No module matches.</div>}
        </div>
      </div>
    </div>
  );
}

export default function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { meta, session } = useMode();
  const loc = useLocation();

  useEffect(() => { setMobileOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen((v) => !v); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const sidebar = (
    <nav className={`flex h-full flex-col border-r border-bw-line bg-bw-void ${collapsed ? 'w-[62px]' : 'w-[248px]'} transition-[width] duration-150`}>
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-bw-line px-3">
        <NavLink to="/" className="min-w-0">
          {collapsed ? <Logo size={26} /> : <LogoLockup size={26} wordSize="sm" sub={false} />}
        </NavLink>
        <button type="button" onClick={() => setCollapsed(!collapsed)}
          className="hidden shrink-0 text-bw-dim hover:text-bw-text lg:block" title="Collapse navigation">
          <Icons.PanelLeftClose size={14} className={collapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {NAV.map((g) => (
          <div key={g.group} className="mb-3">
            {!collapsed && <div className="bw-label px-3 pb-1">{g.group}</div>}
            {g.items.map((it) => (
              <NavLink
                key={it.to} to={it.to} end={it.end}
                title={collapsed ? it.label : STATUS_META[it.status].label}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 px-3 py-[7px] text-[12px] transition-colors ${
                    isActive ? 'bg-bw-primary/10 text-bw-text' : 'text-bw-muted hover:bg-bw-panel/70 hover:text-bw-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-0 h-full w-[2px]" style={{ background: 'var(--color-bw-primary-bright)' }} />}
                    <Icon name={it.icon} size={15} className={isActive ? 'text-bw-primary-bright' : 'text-bw-dim group-hover:text-bw-muted'} />
                    {!collapsed && <span className="min-w-0 flex-1 truncate">{it.label}</span>}
                    {!collapsed && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS_META[it.status].color, opacity: 0.65 }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="shrink-0 border-t border-bw-line p-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            {Object.entries(STATUS_META).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1" title={v.label}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: v.color }} />
                <span className="text-[9px] text-bw-dim">{v.label.split(' ')[0]}</span>
              </span>
            ))}
          </div>
          <p className="text-[9.5px] leading-snug text-bw-dim">{SAFE_LANGUAGE.notDiagnostic}</p>
        </div>
      )}
    </nav>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bw-base">
      <div className="hidden lg:block">{sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] flex lg:hidden">
          <div className="h-full">{sidebar}</div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-bw-line bg-bw-void px-3">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="text-bw-muted lg:hidden" onClick={() => setMobileOpen(true)}>
              <Icons.Menu size={18} />
            </button>
            <button type="button" onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-2.5 py-1.5 text-[11px] text-bw-dim hover:border-bw-line2 sm:flex">
              <Icons.Search size={13} />
              <span>Search modules</span>
              <kbd className="ml-3 rounded border border-bw-line px-1 font-mono text-[9px]">⌘K</kbd>
            </button>
            <Pill color="var(--color-bw-line2)" title="This build">
              <Icons.GitBranch size={10} /> v0.4.0-prototype
            </Pill>
          </div>

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden items-center gap-2 xl:flex">
              <EvidenceTag t="PLAN" size="xs" title="The end-to-end platform depicted here is a design target, not a delivered capability." />
              <span className="bw-num text-[10px] text-bw-dim">{fmtTs()}</span>
            </span>
            <ModeSwitcher />
            <NavLink to="/access" className="flex items-center gap-2 rounded-sm border border-bw-line bg-bw-panel px-2 py-1.5 hover:border-bw-line2">
              <Icons.UserRound size={13} className="text-bw-dim" />
              <span className="hidden text-[11px] text-bw-muted sm:block">
                {session?.name || 'Guest — read only'}
              </span>
            </NavLink>
          </div>
        </header>

        {/* Global standing disclaimer — never dismissible */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-bw-line bg-bw-panel/60 px-3 py-1.5">
          <Icons.Info size={12} className="text-bw-dim" />
          <span className="text-[10.5px] leading-snug text-bw-dim">
            Research prototype. Alert states are interface states, not public-health decisions. Nothing here
            confirms an outbreak or constitutes a diagnosis.
          </span>
          <span className="ml-auto font-mono text-[9.5px] tracking-[0.12em]" style={{ color: meta.color }}>
            {meta.dataBadge}
          </span>
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bw-grid-bg">
          <div className="mx-auto w-full max-w-[1680px] px-3 py-4 sm:px-5">
            <Outlet />
            <footer className="mt-8 border-t border-bw-line py-4 text-[10px] leading-relaxed text-bw-dim">
              BIOWATCH-AI research prototype · Interface demonstration of a proposed architecture ·
              No validated model performance is reported anywhere in this build ·
              Synthetic values are generated deterministically in-browser and are labelled SIMULATED.
            </footer>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}
