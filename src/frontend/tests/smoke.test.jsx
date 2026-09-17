/* BIOWATCH-AI — render smoke test.
   Mounts every route in every prototype mode and fails on any React error
   or on the appearance of prohibited language in the rendered output. */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ModeProvider } from '../src/lib/mode';
import Shell from '../src/components/Shell';

import Landing from '../src/pages/Landing';
import Access from '../src/pages/Access';
import CommandCenter from '../src/pages/CommandCenter';
import SurveillanceMap from '../src/pages/SurveillanceMap';
import DiseaseIntelligence from '../src/pages/DiseaseIntelligence';
import SignalEngine from '../src/pages/SignalEngine';
import AlertCenter from '../src/pages/AlertCenter';
import XAI from '../src/pages/XAI';
import MLLab from '../src/pages/MLLab';
import ModelEvaluation from '../src/pages/ModelEvaluation';
import ModelCards from '../src/pages/ModelCards';
import Genomic from '../src/pages/Genomic';
import BioSignals from '../src/pages/BioSignals';
import Environmental from '../src/pages/Environmental';
import Events from '../src/pages/Events';
import Africa from '../src/pages/Africa';
import Connectors from '../src/pages/Connectors';
import DataQuality from '../src/pages/DataQuality';
import Workspace from '../src/pages/Workspace';
import Experiments from '../src/pages/Experiments';
import Decisions from '../src/pages/Decisions';
import Architecture from '../src/pages/Architecture';
import Health from '../src/pages/Health';
import Responsible from '../src/pages/Responsible';
import Settings from '../src/pages/Settings';

const PAGES = {
  Landing, Access, CommandCenter, SurveillanceMap, DiseaseIntelligence, SignalEngine,
  AlertCenter, XAI, MLLab, ModelEvaluation, ModelCards, Genomic, BioSignals,
  Environmental, Events, Africa, Connectors, DataQuality, Workspace, Experiments,
  Decisions, Architecture, Health, Responsible, Settings,
};

/* Prohibited phrases: the interface must never assert these. */
const PROHIBITED = [
  'outbreak confirmed', 'confirmed outbreak', 'epidemic detected',
  'guaranteed prediction', 'validated accuracy',
];

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  global.fetch = vi.fn(() => Promise.reject(new Error('no backend in test')));
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }),
  });
});
afterEach(cleanup);

function mount(Page, mode) {
  try { localStorage.setItem('bw.mode', mode); } catch { /* ignore */ }
  return render(
    <ModeProvider>
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<Shell />}>
            <Route index element={<Page />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ModeProvider>,
  );
}

describe('BIOWATCH-AI page render smoke test', () => {
  for (const mode of ['DEMONSTRATION', 'RESEARCH', 'LIVE']) {
    for (const [name, Page] of Object.entries(PAGES)) {
      if ((name === 'Landing' || name === 'Access') && mode !== 'DEMONSTRATION') continue;
      it(`${name} renders in ${mode} mode`, () => {
        const errors = [];
        const spy = vi.spyOn(console, 'error').mockImplementation((...a) => errors.push(a.join(' ')));
        let container;
        if (name === 'Landing' || name === 'Access') {
          ({ container } = render(<ModeProvider><MemoryRouter><Page /></MemoryRouter></ModeProvider>));
        } else {
          ({ container } = mount(Page, mode));
        }
        spy.mockRestore();
        expect(container.textContent.length).toBeGreaterThan(50);
        const real = errors.filter((e) => !/not wrapped in act|ReactDOMTestUtils/i.test(e));
        expect(real, `React errors in ${name}:\n${real.join('\n')}`).toHaveLength(0);
        const text = container.textContent.toLowerCase();
        for (const p of PROHIBITED) {
          const idx = text.indexOf(p);
          // allowed only inside an explicit prohibition list ("Prohibited" section)
          if (idx !== -1) {
            const ctx = text.slice(Math.max(0, idx - 400), idx);
            expect(/prohibit|never|not permitted|cannot|blocked|does not/.test(ctx),
              `Prohibited phrase "${p}" asserted in ${name}`).toBe(true);
          }
        }
      });
    }
  }
});
