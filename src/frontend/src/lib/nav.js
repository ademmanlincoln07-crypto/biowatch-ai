/* ============================================================
   BIOWATCH-AI — NAVIGATION REGISTRY
   Single source of truth for modules, routes and their status.
   ============================================================ */
export const NAV = [
  {
    group: 'Surveillance',
    items: [
      { to: '/app', label: 'Global Command Center', icon: 'LayoutDashboard', end: true, status: 'prototype' },
      { to: '/app/map', label: 'Surveillance Map', icon: 'Globe2', status: 'prototype' },
      { to: '/app/disease', label: 'Disease Intelligence', icon: 'Activity', status: 'prototype' },
    ],
  },
  {
    group: 'Detection',
    items: [
      { to: '/app/signals', label: 'Signal Detection Engine', icon: 'Radar', status: 'partial' },
      { to: '/app/alerts', label: 'Early-Warning Center', icon: 'BellRing', status: 'prototype' },
      { to: '/app/xai', label: 'Explainable AI', icon: 'Lightbulb', status: 'partial' },
    ],
  },
  {
    group: 'Modelling',
    items: [
      { to: '/app/ml-lab', label: 'Machine-Learning Lab', icon: 'FlaskConical', status: 'partial' },
      { to: '/app/evaluation', label: 'Model Evaluation', icon: 'GaugeCircle', status: 'partial' },
      { to: '/app/model-cards', label: 'Model & Experiment Cards', icon: 'IdCard', status: 'prototype' },
    ],
  },
  {
    group: 'Biological & environmental',
    items: [
      { to: '/app/genomic', label: 'Genomic Surveillance', icon: 'Dna', status: 'plan' },
      { to: '/app/biosignals', label: 'Biological Signals', icon: 'Microscope', status: 'plan' },
      { to: '/app/environmental', label: 'Environmental Surveillance', icon: 'Droplets', status: 'plan' },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { to: '/app/events', label: 'Event-Based Intelligence', icon: 'Newspaper', status: 'partial' },
      { to: '/app/africa', label: 'Nigeria / Africa View', icon: 'MapPinned', status: 'prototype' },
    ],
  },
  {
    group: 'Data',
    items: [
      { to: '/app/connectors', label: 'Data Connectors', icon: 'PlugZap', status: 'partial' },
      { to: '/app/quality', label: 'Data Quality Center', icon: 'ShieldCheck', status: 'prototype' },
    ],
  },
  {
    group: 'Research',
    items: [
      { to: '/app/workspace', label: 'Researcher Workspace', icon: 'FolderKanban', status: 'partial' },
      { to: '/app/experiments', label: 'Experiment Tracking', icon: 'ListChecks', status: 'partial' },
      { to: '/app/decisions', label: 'Decision Log', icon: 'ScrollText', status: 'prototype' },
    ],
  },
  {
    group: 'System',
    items: [
      { to: '/app/architecture', label: 'System Architecture', icon: 'Network', status: 'prototype' },
      { to: '/app/health', label: 'System Health', icon: 'HeartPulse', status: 'partial' },
      { to: '/app/responsible', label: 'Security & Responsible AI', icon: 'Lock', status: 'prototype' },
      { to: '/app/settings', label: 'Settings & Notifications', icon: 'Settings', status: 'prototype' },
    ],
  },
];

export const STATUS_META = {
  prototype: { label: 'Interface prototype', color: 'var(--color-bw-primary)' },
  partial: { label: 'Partially implemented', color: 'var(--color-alert-yellow)' },
  plan: { label: 'Planned research module', color: 'var(--color-bw-dim)' },
};

export const ALL_ITEMS = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
