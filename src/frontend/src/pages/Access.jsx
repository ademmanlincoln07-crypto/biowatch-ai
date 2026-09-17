/* ============================================================
   BIOWATCH-AI — RESEARCHER ACCESS CONCEPT (login design)
   No real authentication is implemented. This page documents the
   intended access-control model and lets a reviewer enter the
   prototype under a chosen role for interface demonstration.
   ============================================================ */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { LogoLockup } from '../components/Brand';
import { Panel, EvidenceTag, Callout, Field, Input, Btn, Pill, KV } from '../components/ui';
import { useMode } from '../lib/mode';

const ROLES = [
  {
    id: 'viewer', name: 'Public viewer', icon: 'Eye',
    can: ['View demonstration dashboards', 'Read methodology and limitations', 'Read model cards'],
    cannot: ['Upload data', 'Run experiments', 'Configure connectors', 'Adjudicate signals'],
  },
  {
    id: 'researcher', name: 'Researcher', icon: 'FlaskConical',
    can: ['Upload datasets to a private workspace', 'Define and run experiments', 'Compare models against baselines', 'Export figures and reports'],
    cannot: ['Adjudicate signals for release', 'Change global thresholds', 'Manage users'],
  },
  {
    id: 'analyst', name: 'Surveillance analyst', icon: 'Radar',
    can: ['Triage and adjudicate candidate signals', 'Record review rationale in the audit log', 'Request investigation'],
    cannot: ['Modify model code', 'Delete audit entries', 'Issue external public-health alerts'],
  },
  {
    id: 'admin', name: 'Administrator', icon: 'ShieldCheck',
    can: ['Manage roles and API keys', 'Configure connectors', 'Review the full audit log'],
    cannot: ['Delete historical decisions', 'Override the human-review requirement', 'Disable provenance labelling'],
  },
];

export default function Access() {
  const [role, setRole] = useState('researcher');
  const [name, setName] = useState('');
  const { setSession } = useMode();
  const nav = useNavigate();

  const enter = () => {
    const r = ROLES.find((x) => x.id === role);
    setSession({ name: name.trim() || 'Demo researcher', role: r.name, roleId: r.id, at: new Date().toISOString() });
    nav('/app');
  };

  return (
    <div className="bw-grid-bg min-h-screen bg-bw-base">
      <header className="border-b border-bw-line bg-bw-void px-5 py-3">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between">
          <Link to="/"><LogoLockup size={28} /></Link>
          <Link to="/app" className="text-[11px] text-bw-muted hover:text-bw-text">Continue as guest →</Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-5 py-10 lg:grid-cols-[400px_1fr]">
        <div>
          <Panel title="Researcher access" evidence="PLAN"
            subtitle="Interface concept — no credential is transmitted, stored server-side or verified.">
            <Callout tone="warn" title="Prototype authentication" icon={<Icons.TriangleAlert size={12} />}>
              This screen does not authenticate anyone. It records a role locally in your browser so that
              role-based interface behaviour can be demonstrated. In a real deployment this would be
              institutional SSO (e.g. SAML/OIDC) with MFA, not a form.
            </Callout>

            <div className="mt-3 space-y-3">
              <Field label="Display name" hint="Stored only in this browser's local storage.">
                <Input value={name} onChange={setName} placeholder="e.g. A. Researcher" />
              </Field>
              <Field label="Institutional identifier" hint="Disabled — institutional SSO is not configured in this prototype.">
                <div className="flex items-center gap-2 rounded-sm border border-dashed border-bw-line bg-bw-panel2/40 px-2 py-1.5 text-[11px] text-bw-dim">
                  <Icons.Lock size={12} /> SSO CONNECTOR NOT CONFIGURED
                </div>
              </Field>
              <Field label="Select demonstration role">
                <div className="grid grid-cols-2 gap-1.5">
                  {ROLES.map((r) => {
                    const C = Icons[r.icon];
                    const active = role === r.id;
                    return (
                      <button key={r.id} type="button" onClick={() => setRole(r.id)}
                        className={`flex items-center gap-2 rounded-sm border px-2 py-2 text-left text-[11.5px] transition-colors ${
                          active ? 'border-bw-primary bg-bw-primary/10 text-bw-text' : 'border-bw-line bg-bw-panel2 text-bw-muted hover:border-bw-line2'
                        }`}>
                        <C size={14} className={active ? 'text-bw-primary-bright' : 'text-bw-dim'} />
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Btn variant="primary" size="md" className="w-full" onClick={enter}>
                <Icons.LogIn size={14} /> Enter prototype as {ROLES.find((r) => r.id === role).name}
              </Btn>
              <p className="text-[10px] leading-snug text-bw-dim">
                By entering you acknowledge that all content is a research prototype, that alert states are
                interface states rather than public-health decisions, and that no figure shown constitutes
                validated performance.
              </p>
            </div>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Role-based access model" evidence="PLAN"
            subtitle="Capability matrix the production system would enforce server-side.">
            <div className="grid gap-3 sm:grid-cols-2">
              {ROLES.map((r) => {
                const C = Icons[r.icon];
                return (
                  <div key={r.id} className={`rounded-md border p-3 ${role === r.id ? 'border-bw-primary/60 bg-bw-primary/5' : 'border-bw-line bg-bw-panel2/40'}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <C size={15} className="text-bw-primary-bright" />
                      <span className="text-[12.5px] font-medium text-bw-text">{r.name}</span>
                    </div>
                    <div className="bw-label mb-1">Permitted</div>
                    <ul className="mb-2 space-y-1">
                      {r.can.map((c) => (
                        <li key={c} className="flex gap-1.5 text-[11px] text-bw-muted">
                          <Icons.Check size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-green)]" />{c}
                        </li>
                      ))}
                    </ul>
                    <div className="bw-label mb-1">Denied</div>
                    <ul className="space-y-1">
                      {r.cannot.map((c) => (
                        <li key={c} className="flex gap-1.5 text-[11px] text-bw-dim">
                          <Icons.X size={12} className="mt-[2px] shrink-0 text-[var(--color-alert-red)]" />{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Session & audit design" evidence="PLAN">
            <KV cols={2} items={[
              { k: 'Identity provider', v: 'Institutional OIDC / SAML (not configured)' },
              { k: 'Second factor', v: 'Required for analyst and administrator roles' },
              { k: 'Session lifetime', v: '8 h idle timeout; re-auth for connector changes' },
              { k: 'Audit scope', v: 'Login, signal adjudication, connector edits, experiment runs, exports' },
              { k: 'Audit mutability', v: 'Append-only; entries are superseded, never deleted' },
              { k: 'Data residency', v: 'Deployment-dependent; documented per installation' },
              { k: 'Personal data', v: 'Design target: aggregate surveillance data only; no patient-level records' },
              { k: 'Key handling', v: 'API credentials stored server-side only; never exposed to the browser' },
            ]} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill color="var(--color-bw-dim)">NO REAL AUTHENTICATION IN THIS BUILD</Pill>
              <EvidenceTag t="PLAN" size="xs" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
