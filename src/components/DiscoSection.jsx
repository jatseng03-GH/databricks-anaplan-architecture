import { useState } from 'react';
import ModuleTable from './ModuleTable';
import ListTable from './ListTable';

const PHASES = [
  { key: 'D', label: 'Define', color: '#EE3D2C' },
  { key: 'I', label: 'Identify', color: '#D4A843' },
  { key: 'S', label: 'Structure', color: '#00C6BE' },
  { key: 'C', label: 'Combine', color: '#8A9DB5' },
  { key: 'O', label: 'Output', color: '#EE3D2C' },
];

function DefinePhase({ data }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {data.map((item, i) => (
        <div key={i} className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            {item.label}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--db-white)', lineHeight: 1.6 }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function IdentifyPhase({ data }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {data.map((item, i) => (
        <div key={i} className="card" style={{ padding: '20px 22px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            {item.label}
          </div>
          {Array.isArray(item.value) ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {item.value.map((v, vi) => (
                <span key={vi} className="pill pill-navy">{v}</span>
              ))}
            </div>
          ) : (
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--db-white)', lineHeight: 1.6 }}>
              {item.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StructurePhase({ modules }) {
  return (
    <div>
      <div className="section-heading" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--db-white)', margin: 0 }}>Modules</h3>
        <p style={{ color: 'var(--db-muted)', fontSize: 13, marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>Click any row to expand and view sample formulas.</p>
      </div>
      <ModuleTable modules={modules} />
    </div>
  );
}

function CombinePhase({ lists }) {
  return (
    <div>
      <div className="section-heading" style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--db-white)', margin: 0 }}>Lists</h3>
        <p style={{ color: 'var(--db-muted)', fontSize: 13, marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>Expand each list to see sample items and downstream usage.</p>
      </div>
      <ListTable lists={lists} />
    </div>
  );
}

function OutputPhase({ data }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {data.map((item, i) => (
        <div key={i} className="card card-red" style={{ padding: '20px 22px', borderLeft: '3px solid var(--db-red)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--db-red)', marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--db-white)', marginBottom: 4 }}>
                {item.title}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.6 }}>
                {item.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DiscoSection({ define, identify, modules, lists, output }) {
  const [active, setActive] = useState('D');

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, alignItems: 'center' }}>
        {PHASES.map(p => (
          <button
            key={p.key}
            className={`disco-tab ${active === p.key ? 'active' : ''}`}
            onClick={() => setActive(p.key)}
            title={p.label}
            style={active === p.key ? { background: p.color, borderColor: p.color } : {}}
          >
            {p.key}
          </button>
        ))}
        <span style={{ marginLeft: 8, fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted)', letterSpacing: '0.06em' }}>
          {PHASES.find(p => p.key === active)?.label}
        </span>
      </div>

      {/* Content — no AnimatePresence, simple conditional render */}
      <div style={{ animation: 'fadeInUp 0.2s ease forwards' }}>
        {active === 'D' && <DefinePhase data={define} />}
        {active === 'I' && <IdentifyPhase data={identify} />}
        {active === 'S' && <StructurePhase modules={modules} />}
        {active === 'C' && <CombinePhase lists={lists} />}
        {active === 'O' && <OutputPhase data={output} />}
      </div>
    </div>
  );
}
