/* ============================================================
   BIOWATCH-AI — CHART PRIMITIVES
   Thin, consistently-styled wrappers over Recharts so that every
   module renders data with the same visual grammar:
     observed = solid line, baseline = dashed, interval = band,
     flagged points = ringed markers.
   ============================================================ */
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar, BarChart, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Scatter, Cell, LineChart, RadialBarChart, RadialBar,
} from 'recharts';

export const AXIS = { stroke: '#3a5061', fontSize: 10, fontFamily: 'var(--font-mono)' };
const GRID = '#1e2c37';

function TipBox({ active, payload, label, unit, note }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-bw-line2 bg-bw-panel2 px-2.5 py-2 shadow-xl">
      <div className="bw-num mb-1 text-[10px] text-bw-dim">{label}</div>
      {payload.filter((p) => p.value !== undefined && p.value !== null).map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color || p.stroke }} />
          <span className="text-bw-muted">{p.name}</span>
          <span className="bw-num ml-auto text-bw-text">
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{unit || ''}
          </span>
        </div>
      ))}
      <div className="mt-1 border-t border-bw-line pt-1 font-mono text-[8.5px] tracking-[0.1em] text-[var(--color-ev-simulated)]">
        {note || 'SIMULATED'}
      </div>
    </div>
  );
}

/** Observed series vs baseline with 95% interval and flagged deviations. */
export function SignalChart({
  data, height = 200, color = 'var(--color-bw-primary-bright)', showBaseline = true,
  showBand = true, flagKey = 'flag', yLabel, note, valueName = 'Observed',
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="date" {...AXIS} tickLine={false} axisLine={{ stroke: GRID }}
          minTickGap={44} tickFormatter={(v) => String(v).slice(2, 7)} />
        <YAxis {...AXIS} tickLine={false} axisLine={false} width={46}
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#3a5061', fontSize: 9, offset: 16 } : undefined} />
        <Tooltip content={<TipBox note={note} />} cursor={{ stroke: '#2a3b49' }} />
        {showBand && <Area type="monotone" dataKey="hi" stroke="none" fill="#2ea89a" fillOpacity={0.09} name="Upper 95%" isAnimationActive={false} />}
        {showBand && <Area type="monotone" dataKey="lo" stroke="none" fill="#0b1117" fillOpacity={1} name="Lower 95%" isAnimationActive={false} />}
        {showBaseline && <Line type="monotone" dataKey="baseline" stroke="#7f95a6" strokeWidth={1.2} strokeDasharray="4 3" dot={false} name="Baseline" isAnimationActive={false} />}
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.7} dot={false} name={valueName} isAnimationActive={false} />
        <Scatter dataKey={flagKey} fill="var(--color-alert-orange)" shape="circle" name="Flagged" isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function Spark({ data, dataKey = 'value', color = 'var(--color-bw-primary)', height = 34, type = 'line' }) {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey={dataKey} fill={color} radius={[1, 1, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 3, right: 1, bottom: 1, left: 1 }}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.4} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, xKey = 'name', yKey = 'value', height = 200, color = 'var(--color-bw-primary)', horizontal = false, note, unit, colorKey }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 4, right: 10, bottom: 0, left: horizontal ? 8 : -20 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? <>
          <XAxis type="number" {...AXIS} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey={xKey} {...AXIS} tickLine={false} axisLine={false} width={128} />
        </> : <>
          <XAxis dataKey={xKey} {...AXIS} tickLine={false} axisLine={{ stroke: GRID }} interval={0} angle={0} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} width={46} />
        </>}
        <Tooltip content={<TipBox note={note} unit={unit} />} cursor={{ fill: '#16212b' }} />
        <Bar dataKey={yKey} radius={horizontal ? [0, 2, 2, 0] : [2, 2, 0, 0]} isAnimationActive={false}>
          {data.map((d, i) => <Cell key={i} fill={colorKey ? d[colorKey] : color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Diverging contribution chart (SHAP-style layout, model-agnostic). */
export function Contributions({ data, height = 220, note }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" horizontal={false} />
        <XAxis type="number" {...AXIS} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="feature" {...AXIS} tickLine={false} axisLine={false} width={168} />
        <Tooltip content={<TipBox note={note} />} cursor={{ fill: '#16212b' }} />
        <ReferenceLine x={0} stroke="#3a5061" />
        <Bar dataKey="contribution" radius={2} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.contribution >= 0 ? 'var(--color-alert-orange)' : 'var(--color-bw-data)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Stacked({ data, keys, colors, xKey = 'date', height = 200, note }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey={xKey} {...AXIS} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={40}
          tickFormatter={(v) => String(v).slice(2, 7)} />
        <YAxis {...AXIS} tickLine={false} axisLine={false} width={46} />
        <Tooltip content={<TipBox note={note} />} cursor={{ fill: '#16212b' }} />
        {keys.map((k, i) => (
          <Area key={k} type="monotone" dataKey={k} stackId="1" stroke={colors[i]} fill={colors[i]}
            fillOpacity={0.28} strokeWidth={1.2} isAnimationActive={false} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function Gauge({ value, max = 1, color = 'var(--color-bw-primary)', height = 110, label }) {
  const data = [{ name: label, value: Math.max(0, Math.min(max, value)), fill: color }];
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart innerRadius="72%" outerRadius="100%" data={data} startAngle={210} endAngle={-30}>
          <RadialBar background={{ fill: '#1e2c37' }} dataKey="value" cornerRadius={2} isAnimationActive={false} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
