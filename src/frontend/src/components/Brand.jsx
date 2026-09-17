/* ============================================================
   BIOWATCH-AI — BRAND / VISUAL IDENTITY (PART 1)
   ------------------------------------------------------------
   Mark concept: a hexagonal "field of view" (surveillance /
   microscope aperture) enclosing a double-helix strand that
   resolves into a signal trace with a detected deviation.
   Reads as: BIOLOGY inside SURVEILLANCE producing a SIGNAL.
   Drawn as inline SVG so it renders without any network access.
   ============================================================ */

export function Logo({ size = 32, tone = 'var(--color-bw-primary-bright)', tone2 = 'var(--color-bw-genomic)', title = 'BIOWATCH-AI' }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" role="img" aria-label={title} className="shrink-0">
      <title>{title}</title>
      {/* aperture hexagon — the "watch" field of view */}
      <path
        d="M24 2.6 41.5 12.8v20.4L24 43.4 6.5 33.2V12.8Z"
        fill="none" stroke={tone} strokeWidth="1.6" strokeLinejoin="round" opacity="0.85"
      />
      <path
        d="M24 7.6 37.2 15.3v15.4L24 38.4 10.8 30.7V15.3Z"
        fill="none" stroke={tone} strokeWidth="0.7" strokeLinejoin="round" opacity="0.3"
      />
      {/* double helix strands */}
      <path d="M17 13c6 4 6 7.5 0 11.5S11 32 17 36" fill="none" stroke={tone2} strokeWidth="1.7" strokeLinecap="round" opacity="0.95" />
      <path d="M31 13c-6 4-6 7.5 0 11.5s6 7.5 0 11.5" fill="none" stroke={tone2} strokeWidth="1.7" strokeLinecap="round" opacity="0.6" />
      {/* base pairs */}
      <g stroke={tone} strokeWidth="1.1" strokeLinecap="round" opacity="0.55">
        <line x1="18.6" y1="16.2" x2="29.4" y2="16.2" />
        <line x1="20.4" y1="24.5" x2="27.6" y2="24.5" />
        <line x1="18.6" y1="32.8" x2="29.4" y2="32.8" />
      </g>
      {/* signal trace with detected deviation */}
      <path d="M11 27.5h5.5l2.4-3.1 2.6 6.4 2.5-9.6 2.6 6.6 2-2.4H37"
        fill="none" stroke={tone} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="21.2" r="2.5" fill="none" stroke={tone} strokeWidth="1" opacity="0.9" />
      <circle cx="24" cy="21.2" r="1" fill={tone} />
    </svg>
  );
}

export function Wordmark({ size = 'md', sub = true }) {
  const scale = { sm: 'text-[13px]', md: 'text-[15px]', lg: 'text-[22px]', xl: 'text-[32px]' }[size];
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span className={`${scale} font-semibold tracking-[0.16em] text-bw-text`}>
        BIOWATCH<span className="text-bw-primary-bright">-AI</span>
      </span>
      {sub && (
        <span className="mt-1 font-mono text-[8.5px] tracking-[0.22em] text-bw-dim">
          BIOLOGICAL SIGNAL INTELLIGENCE
        </span>
      )}
    </span>
  );
}

export function LogoLockup({ size = 30, wordSize = 'md', sub = true }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Logo size={size} />
      <Wordmark size={wordSize} sub={sub} />
    </span>
  );
}

export const TAGLINE = 'Watching biology for the signal before the story.';
export const TAGLINE_FORMAL =
  'AI-assisted biological surveillance and early outbreak signal detection';
