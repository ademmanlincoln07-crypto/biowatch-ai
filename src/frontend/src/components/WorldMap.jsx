/* ============================================================
   BIOWATCH-AI — WORLD SURVEILLANCE MAP
   d3-geo + local Natural-Earth topology (no network dependency).
   Visual encoding is deliberately conservative:
     - fill  = signal STATE (none / review / investigate / assess)
     - ring  = data availability, NOT disease burden
     - hatch = insufficient data (never rendered as "low activity")
   A signal is never rendered as a confirmed outbreak.
   ============================================================ */
import { useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule10, geoOrthographic, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';
import topo from '../data/countries-110m.json';
import { ALERT_STATES } from '../lib/evidence';

/* ISO3 ⇄ M49 numeric ids for the subset used by the prototype */
export const ISO_NUM = {
  NGA: '566', GHA: '288', ZAF: '710', KEN: '404', ETH: '231', COD: '180', EGY: '818',
  PAK: '586', GBR: '826', DEU: '276', FRA: '250', ITA: '380', USA: '840', BRA: '076',
  MEX: '484', IND: '356', IDN: '360', THA: '764', JPN: '392', PHL: '608', AUS: '036', CHN: '156',
  SEN: '686', MAR: '504', DZA: '012', TZA: '834', UGA: '800', ZMB: '894', MOZ: '508',
  CMR: '120', CIV: '384', SDN: '729', SOM: '706', MDG: '450', AGO: '024', NER: '562',
  MLI: '466', BFA: '854', TCD: '148', ZWE: '716', RWA: '646', BDI: '108', LBR: '430',
  SLE: '694', GIN: '324', TUN: '788', LBY: '434', BWA: '072', NAM: '516', MWI: '454',
};
export const NUM_ISO = Object.fromEntries(Object.entries(ISO_NUM).map(([k, v]) => [String(Number(v)), k]));

const STATE_FILL = {
  GREEN: '#16323f',
  YELLOW: 'rgba(215,178,60,0.42)',
  ORANGE: 'rgba(217,130,43,0.5)',
  RED: 'rgba(207,74,74,0.55)',
  NODATA: '#121b23',
};

export default function WorldMap({
  values = {},            // { ISO3: { state, label, metrics: [{k,v}], availability } }
  height = 420,
  projection = 'natural',
  onSelect,
  selected,
  points = [],            // [{lon,lat,label,color,r}]
  focus = null,           // [lon, lat, scaleFactor] to centre on a region
  showGraticule = true,
}) {
  const [hover, setHover] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const width = 960;

  const land = useMemo(() => feature(topo, topo.objects.countries), []);

  const { path, proj } = useMemo(() => {
    let p;
    if (projection === 'orthographic') p = geoOrthographic().rotate([-20, -5]).fitExtent([[8, 8], [width - 8, height - 8]], land);
    else if (projection === 'mercator') p = geoMercator().fitExtent([[8, 8], [width - 8, height - 8]], land);
    else p = geoNaturalEarth1().fitExtent([[8, 8], [width - 8, height - 8]], land);
    if (focus) {
      p.center([focus[0], focus[1]]).scale(p.scale() * (focus[2] || 3)).translate([width / 2, height / 2]);
    }
    return { path: geoPath(p), proj: p };
  }, [projection, height, land, focus]);

  const graticule = useMemo(() => (showGraticule ? geoPath(proj)(geoGraticule10()) : null), [proj, showGraticule]);

  return (
    <div className="relative w-full overflow-hidden rounded-md border border-bw-line bg-[#08121a]">
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <pattern id="bw-hatch" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="#101a22" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="#22323f" strokeWidth="1.4" />
          </pattern>
          <radialGradient id="bw-ocean">
            <stop offset="0%" stopColor="#0a1620" />
            <stop offset="100%" stopColor="#070d13" />
          </radialGradient>
        </defs>

        <rect width={width} height={height} fill="url(#bw-ocean)" />
        {graticule && <path d={graticule} fill="none" stroke="#132029" strokeWidth="0.5" />}

        {land.features.map((f, fi) => {
          const iso = NUM_ISO[String(Number(f.id))];
          const v = iso ? values[iso] : null;
          const isSel = iso && selected === iso;
          const fill = v ? (v.availability === 'none' ? 'url(#bw-hatch)' : STATE_FILL[v.state] || STATE_FILL.NODATA) : STATE_FILL.NODATA;
          return (
            <path
              key={`${f.id ?? 'na'}-${fi}`}
              d={path(f)}
              fill={fill}
              stroke={isSel ? 'var(--color-bw-primary-bright)' : '#1c2a34'}
              strokeWidth={isSel ? 1.4 : 0.4}
              className={v ? 'cursor-pointer' : ''}
              onMouseEnter={() => setHover({ iso, name: f.properties.name, v })}
              onClick={() => iso && onSelect && onSelect(iso)}
            />
          );
        })}

        {points.map((pt, i) => {
          const xy = proj([pt.lon, pt.lat]);
          if (!xy) return null;
          return (
            <g key={i} transform={`translate(${xy[0]},${xy[1]})`} className={onSelect ? 'cursor-pointer' : ''}
              onMouseEnter={() => setHover({ name: pt.label, v: pt })}
              onClick={() => pt.iso && onSelect && onSelect(pt.iso)}>
              <circle r={(pt.r || 4) + 3} fill="none" stroke={pt.color} strokeWidth="0.8" opacity="0.45" />
              <circle r={pt.r || 4} fill={pt.color} fillOpacity="0.75" stroke={pt.color} strokeWidth="0.7" />
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-20 max-w-[240px] rounded-sm border border-bw-line2 bg-bw-panel2/95 px-2.5 py-2 shadow-xl"
          style={{ left: `min(${mouse.x}%, calc(100% - 250px))`, top: `min(${mouse.y}%, calc(100% - 90px))` }}
        >
          <div className="text-[12px] font-medium text-bw-text">{hover.name}</div>
          {hover.v ? (
            <>
              {hover.v.state && (
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ALERT_STATES[hover.v.state]?.color }} />
                  <span className="font-mono text-[9.5px] tracking-[0.1em]" style={{ color: ALERT_STATES[hover.v.state]?.color }}>
                    {hover.v.label || ALERT_STATES[hover.v.state]?.title}
                  </span>
                </div>
              )}
              {hover.v.metrics?.map((m) => (
                <div key={m.k} className="mt-0.5 flex justify-between gap-3 text-[10.5px]">
                  <span className="text-bw-dim">{m.k}</span><span className="bw-num text-bw-muted">{m.v}</span>
                </div>
              ))}
              <div className="mt-1 border-t border-bw-line pt-1 font-mono text-[8.5px] tracking-[0.1em] text-[var(--color-ev-simulated)]">
                SIMULATED — NOT REAL SURVEILLANCE
              </div>
            </>
          ) : (
            <div className="mt-1 font-mono text-[9.5px] tracking-[0.1em] text-bw-dim">NO STREAM CONFIGURED</div>
          )}
        </div>
      )}
    </div>
  );
}

export function MapLegend({ compact = false }) {
  const items = [
    ['GREEN', 'No unusual activity detected'],
    ['YELLOW', 'Signal detected — review'],
    ['ORANGE', 'Unusual activity — investigate'],
    ['RED', 'Elevated reporting — human assessment'],
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map(([k, label]) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-[2px] border border-bw-line" style={{ background: STATE_FILL[k] }} />
          <span className="text-[10px] text-bw-muted">{compact ? k : label}</span>
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <svg width="16" height="10"><rect width="16" height="10" fill="url(#bw-hatch)" stroke="#22323f" /></svg>
        <span className="text-[10px] text-bw-dim">Insufficient data — not "low activity"</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-[2px] border border-bw-line" style={{ background: STATE_FILL.NODATA }} />
        <span className="text-[10px] text-bw-dim">No stream configured</span>
      </span>
    </div>
  );
}
