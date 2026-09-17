/* ============================================================
   BIOWATCH-AI — UI KIT (design system components)
   ============================================================ */
import { useState } from 'react';
import { EVIDENCE, SAFE_LANGUAGE } from '../lib/evidence';
import { useMode } from '../lib/mode';
import { fmtTs } from '../lib/synth';

/* ---------- Evidence tag ---------------------------------- */
export function EvidenceTag({ t = 'SIMULATED', size = 'sm', title }) {
  const e = EVIDENCE[t] || EVIDENCE.ASSUMPTION;
  return (
    <span
      title={title || e.definition}
      className={`inline-flex items-center gap-1 rounded-sm border font-mono uppercase tracking-[0.12em] ${
        size === 'xs' ? 'px-1 py-[1px] text-[9px]' : 'px-1.5 py-[2px] text-[10px]'
      }`}
      style={{ color: e.color, borderColor: e.color + '66', background: e.color + '14' }}
    >
      {e.label}
    </span>
  );
}

/* ---------- Generic pill / badge -------------------------- */
export function Pill({ children, color = 'var(--color-bw-muted)', filled = false, className = '', title }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.1em] ${className}`}
      style={{
        color: filled ? '#08121a' : color,
        borderColor: color + (filled ? '' : '55'),
        background: filled ? color : color + '12',
      }}
    >
      {children}
    </span>
  );
}

export function Dot({ color, pulse = false }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${pulse ? 'bw-pulse-dot' : ''}`}
      style={{ background: color, color }}
    />
  );
}

/* ---------- Panel ----------------------------------------- */
export function Panel({
  title, subtitle, evidence, actions, children, className = '',
  bodyClass = '', dense = false, accent,
}) {
  return (
    <section
      className={`flex min-w-0 flex-col rounded-md border border-bw-line bg-bw-panel ${className}`}
      style={accent ? { borderTopColor: accent, borderTopWidth: 2 } : undefined}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-bw-line px-3 py-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {title && <h3 className="bw-h2 truncate text-bw-text">{title}</h3>}
              {evidence && <EvidenceTag t={evidence} size="xs" />}
            </div>
            {subtitle && <p className="mt-0.5 text-[11px] leading-snug text-bw-dim">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={`min-w-0 flex-1 ${dense ? 'p-2' : 'p-3'} ${bodyClass}`}>{children}</div>
    </section>
  );
}

/* ---------- Stat tile ------------------------------------- */
export function Stat({ label, value, unit, evidence, hint, color, sub }) {
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <span className="bw-label">{label}</span>
        {evidence && <EvidenceTag t={evidence} size="xs" />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="bw-num text-2xl font-semibold leading-none" style={{ color: color || 'var(--color-bw-text)' }}>
          {value}
        </span>
        {unit && <span className="bw-num text-[11px] text-bw-dim">{unit}</span>}
      </div>
      {sub && <div className="mt-1 text-[11px] text-bw-muted">{sub}</div>}
      {hint && <div className="mt-1 text-[10px] leading-snug text-bw-dim">{hint}</div>}
    </div>
  );
}

/* ---------- Data-state badge (mode aware) ----------------- */
export function DataState({ state, ts, source }) {
  const { meta } = useMode();
  const s = state || meta.dataBadge;
  const map = {
    LIVE: 'var(--color-bw-data)',
    'DEMO DATA': 'var(--color-ev-simulated)',
    'RESEARCH DATA': 'var(--color-bw-primary-bright)',
    'CONNECTOR NOT CONFIGURED': 'var(--color-bw-dim)',
    STALE: 'var(--color-alert-yellow)',
    ERROR: 'var(--color-alert-red)',
  };
  const color = map[s] || 'var(--color-bw-muted)';
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Pill color={color}><Dot color={color} pulse={s === 'LIVE'} />{s}</Pill>
      {ts !== undefined && (
        <span className="bw-num text-[10px] text-bw-dim">Last updated: {ts || '—'}</span>
      )}
      {source && <span className="text-[10px] text-bw-dim">· {source}</span>}
    </span>
  );
}

/* ---------- Banners --------------------------------------- */
export function SimulatedBanner({ text, compact = false, evidence = 'SIMULATED' }) {
  const { isDemo } = useMode();
  if (!isDemo && !text) return null;
  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-md border ${compact ? 'px-2.5 py-1.5' : 'px-3 py-2'}`}
      style={{ borderColor: 'var(--color-ev-simulated)55', background: 'var(--color-ev-simulated)0f' }}
    >
      <EvidenceTag t={evidence} size="xs" />
      <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--color-ev-simulated)]">
        {text || SAFE_LANGUAGE.simulatedBanner}
      </span>
    </div>
  );
}

export function Callout({ tone = 'info', title, children, icon }) {
  const tones = {
    info: 'var(--color-bw-data)',
    warn: 'var(--color-alert-yellow)',
    danger: 'var(--color-alert-red)',
    ok: 'var(--color-alert-green)',
    neutral: 'var(--color-bw-line2)',
  };
  const c = tones[tone] || tones.info;
  return (
    <div className="rounded-md border px-3 py-2" style={{ borderColor: c + '55', background: c + '0d' }}>
      {title && (
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: c }}>
          {icon}{title}
        </div>
      )}
      <div className="text-[12px] leading-relaxed text-bw-muted">{children}</div>
    </div>
  );
}

/* ---------- Not-implemented / awaiting placeholders -------- */
export function NotImplemented({ what, plan, className = '' }) {
  return (
    <div className={`rounded-md border border-dashed border-bw-line2 bg-bw-panel2/40 p-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <EvidenceTag t="PLAN" size="xs" />
        <span className="font-mono text-[10px] tracking-[0.12em] text-bw-muted">
          {SAFE_LANGUAGE.notImplemented}
        </span>
      </div>
      {what && <p className="mt-2 text-[12px] text-bw-text">{what}</p>}
      {plan && <p className="mt-1 text-[11px] leading-relaxed text-bw-dim">{plan}</p>}
    </div>
  );
}

export function Awaiting({ label = SAFE_LANGUAGE.awaitingExperiment, note }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="bw-num text-[13px] text-bw-dim italic">{label}</span>
      {note && <span className="text-[10px] text-bw-dim">{note}</span>}
    </div>
  );
}

export function NoData({ reason }) {
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel2/50 px-3 py-4 text-center">
      <div className="font-mono text-[11px] tracking-[0.14em] text-bw-dim">{SAFE_LANGUAGE.noData}</div>
      {reason && <div className="mt-1 text-[11px] text-bw-dim">{reason}</div>}
    </div>
  );
}

/* ---------- Table ----------------------------------------- */
export function Table({ columns, rows, empty = 'No records', dense = false, rowKey }) {
  if (!rows || rows.length === 0) {
    return <div className="px-2 py-6 text-center text-[12px] text-bw-dim">{empty}</div>;
  }
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-bw-line">
            {columns.map((c) => (
              <th
                key={c.key}
                className="bw-label whitespace-nowrap px-2 pb-1.5 pt-1 font-normal"
                style={{ textAlign: c.align || 'left', width: c.width }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={rowKey ? r[rowKey] : i}
              className="border-b border-bw-line/60 last:border-0 hover:bg-bw-panel2/60"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-2 align-top ${dense ? 'py-1' : 'py-2'} text-[12px] text-bw-text`}
                  style={{ textAlign: c.align || 'left' }}
                >
                  {c.render ? c.render(r, i) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Segmented control ----------------------------- */
export function Segmented({ options, value, onChange, size = 'sm' }) {
  return (
    <div className="inline-flex flex-wrap overflow-hidden rounded-sm border border-bw-line bg-bw-panel2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`border-r border-bw-line px-2.5 font-mono uppercase tracking-[0.08em] transition-colors last:border-0 ${
              size === 'xs' ? 'py-[3px] text-[9px]' : 'py-1 text-[10px]'
            } ${active ? 'text-[#08121a]' : 'text-bw-muted hover:bg-bw-line/40 hover:text-bw-text'}`}
            style={active ? { background: o.color || 'var(--color-bw-primary)' } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Buttons --------------------------------------- */
export function Btn({ children, onClick, variant = 'ghost', size = 'sm', disabled, title, type = 'button', className = '' }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-sm border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  const sizes = { xs: 'px-2 py-1 text-[10px]', sm: 'px-2.5 py-1.5 text-[11px]', md: 'px-3.5 py-2 text-[12px]' };
  const variants = {
    primary: 'border-bw-primary bg-bw-primary/90 text-[#04120f] hover:bg-bw-primary',
    ghost: 'border-bw-line bg-bw-panel2 text-bw-muted hover:border-bw-line2 hover:text-bw-text',
    outline: 'border-bw-primary/50 bg-transparent text-bw-primary-bright hover:bg-bw-primary/10',
    danger: 'border-[var(--color-alert-red)]/50 bg-transparent text-[var(--color-alert-red)] hover:bg-[var(--color-alert-red)]/10',
  };
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

/* ---------- Field / select / input ------------------------ */
export function Field({ label, hint, children, evidence }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="bw-label">{label}</span>
        {evidence && <EvidenceTag t={evidence} size="xs" />}
      </div>
      {children}
      {hint && <p className="mt-1 text-[10px] leading-snug text-bw-dim">{hint}</p>}
    </label>
  );
}

export function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[12px] text-bw-text outline-none focus:border-bw-primary ${className}`}
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

export function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-sm border border-bw-line bg-bw-panel2 px-2 py-1.5 text-[12px] text-bw-text placeholder:text-bw-dim outline-none focus:border-bw-primary ${className}`}
    />
  );
}

export function Checkbox({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 py-0.5">
      <input
        type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[var(--color-bw-primary)]"
      />
      <span className="min-w-0">
        <span className="block text-[12px] text-bw-text">{label}</span>
        {hint && <span className="block text-[10px] text-bw-dim">{hint}</span>}
      </span>
    </label>
  );
}

/* ---------- Meter ----------------------------------------- */
export function Meter({ value, max = 100, color = 'var(--color-bw-primary)', height = 6, label, right }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      {(label || right) && (
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[11px] text-bw-muted">{label}</span>
          <span className="bw-num text-[11px] text-bw-dim">{right}</span>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-sm bg-bw-line/70" style={{ height }}>
        <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ---------- Key/value list -------------------------------- */
export function KV({ items, cols = 1, mono = true }) {
  return (
    <dl className={`grid gap-x-6 gap-y-2 ${cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
      {items.map((it) => (
        <div key={it.k} className="min-w-0 border-b border-bw-line/50 pb-1.5 last:border-0">
          <dt className="bw-label">{it.k}</dt>
          <dd className={`mt-0.5 break-words text-[12px] text-bw-text ${mono && it.mono !== false ? 'bw-num' : ''}`}>
            {it.v ?? '—'}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Collapsible ----------------------------------- */
export function Disclosure({ summary, children, defaultOpen = false, tag }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-bw-line bg-bw-panel2/40">
      <button
        type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-[12px] font-medium text-bw-text">
          {summary} {tag && <EvidenceTag t={tag} size="xs" />}
        </span>
        <span className="bw-num text-[11px] text-bw-dim">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="border-t border-bw-line px-3 py-2.5">{children}</div>}
    </div>
  );
}

/* ---------- Page header ----------------------------------- */
export function PageHeader({ title, kicker, description, evidence, right, children }) {
  const { meta } = useMode();
  return (
    <div className="mb-4 border-b border-bw-line pb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {kicker && <div className="bw-label mb-1">{kicker}</div>}
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="bw-h1 text-bw-text">{title}</h1>
            {evidence && <EvidenceTag t={evidence} />}
          </div>
          {description && (
            <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-bw-muted">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <DataState ts={fmtTs()} />
          {right}
        </div>
      </div>
      {children}
      <div className="mt-2 text-[10px] text-bw-dim">
        Active mode: <span style={{ color: meta.color }}>{meta.key}</span> — {meta.description}
      </div>
    </div>
  );
}

export function Grid({ cols = 'md:grid-cols-2', gap = 'gap-3', children, className = '' }) {
  return <div className={`grid grid-cols-1 ${cols} ${gap} ${className}`}>{children}</div>;
}
