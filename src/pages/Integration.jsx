import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ChevronDown, ChevronRight, CheckCircle, Circle, Layers, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { INTEGRATION_PATTERNS, DELTA_TABLES, ORCHESTRATION_JOBS, MONTHLY_JOBS, PIPELINE_HEALTH } from '../data/integrations';
import L5Section from '../components/L5Diagram';

// ─── Swim-lane Data Flow Diagram ─────────────────────────────────────────────
function SwimLaneDiagram() {
  const LANE_W = 220;
  const LANE_GAP = 30;
  const TOTAL_W = LANE_W * 3 + LANE_GAP * 2 + 40;
  const TOTAL_H = 480;

  const lanes = [
    { id: 'source',    label: 'SOURCE SYSTEMS',      x: 20,                         bg: 'rgba(10,15,28,0.8)',   border: '#1E2E48',  textColor: '#6B7D95' },
    { id: 'databricks',label: 'DATABRICKS PLATFORM', x: 20 + LANE_W + LANE_GAP,    bg: 'rgba(0,10,10,0.85)',   border: '#0E3A3A',  textColor: '#00C6BE' },
    { id: 'anaplan',   label: 'ANAPLAN',              x: 20 + (LANE_W + LANE_GAP)*2, bg: 'rgba(10,15,28,0.8)',  border: '#1E2E48',  textColor: '#EE3D2C' },
  ];

  const NODE_H = 38, NODE_R = 6, NODE_W = LANE_W - 24;

  const srcNodes  = ['NetSuite ERP', 'Workday HRIS', 'Salesforce CRM', 'AWS / Azure / GCP Cost'].map((n, i) => ({ label: n, y: 72 + i * 80 }));
  const dbNodes   = ['DB Workflows', 'Delta Lake', 'Unity Catalog', 'Databricks SQL'].map((n, i) => ({ label: n, y: 72 + i * 80 }));
  const apNodes   = ['Data Hub Model', 'Spoke Models (×6)', 'NUX Dashboards', 'CFO / FP&A Reports'].map((n, i) => ({ label: n, y: 72 + i * 80 }));

  // Helper: node center
  const nc = (lane, idx) => ({
    x: lanes[lane].x + 12 + NODE_W / 2,
    y: (lane === 0 ? srcNodes : lane === 1 ? dbNodes : apNodes)[idx].y + NODE_H / 2,
  });

  // Arrows: [fromLane, fromIdx, toLane, toIdx, label, color, dashed, bidir]
  const arrows = [
    [0, 0, 1, 0, 'nightly ETL',   '#4A5568', true,  false],
    [0, 1, 1, 0, 'nightly ETL',   '#4A5568', true,  false],
    [0, 2, 1, 0, 'nightly ETL',   '#4A5568', true,  false],
    [0, 3, 1, 0, 'nightly API',   '#4A5568', true,  false],
    [1, 0, 1, 1, 'write finance schema', '#00C6BE', false, false],
    [1, 1, 2, 0, 'CloudWorks import',   '#00C6BE', false, true ],
    [1, 1, 1, 3, 'Delta table read',    '#00C6BE', true,  false],
    [1, 2, 1, 1, 'table governance',    '#8A9DB5', true,  false],
    [1, 3, 2, 3, 'BI query layer',      '#D4A843', false, false],
  ];

  function arrowPath(fromL, fromI, toL, toI) {
    const a = nc(fromL, fromI), b = nc(toL, toI);
    const cx = (a.x + b.x) / 2;
    if (fromL === toL) {
      // same lane — vertical arrow
      const lx = lanes[fromL].x + 12 + NODE_W;
      return `M${a.x},${a.y + NODE_H/2} C${lx+20},${a.y + NODE_H/2} ${lx+20},${b.y - NODE_H/2} ${b.x},${b.y - NODE_H/2}`;
    }
    return `M${a.x + NODE_W/2},${a.y} C${cx},${a.y} ${cx},${b.y} ${b.x - NODE_W/2},${b.y}`;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <style>{`
        @keyframes swimFlow { to { stroke-dashoffset: -20; } }
        .swim-anim { animation: swimFlow 1.5s linear infinite; }
        @keyframes swimFlowBwd { to { stroke-dashoffset: 20; } }
        .swim-bwd { animation: swimFlowBwd 1.5s linear infinite; }
      `}</style>
      <svg width={TOTAL_W} height={TOTAL_H} viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
        style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <marker id="arrowC" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#00C6BE" />
          </marker>
          <marker id="arrowG" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#4A5568" />
          </marker>
          <marker id="arrowGold" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#D4A843" />
          </marker>
          <marker id="arrowMuted" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#8A9DB5" />
          </marker>
          <marker id="arrowMutedRev" markerWidth="7" markerHeight="7" refX="1" refY="3.5" orient="auto">
            <path d="M7,0 L7,7 L0,3.5 z" fill="#8A9DB5" />
          </marker>
          <marker id="arrowCRev" markerWidth="7" markerHeight="7" refX="1" refY="3.5" orient="auto">
            <path d="M7,0 L7,7 L0,3.5 z" fill="#00C6BE" />
          </marker>
          {/* Databricks lane grid pattern */}
          <pattern id="dbGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(238,61,44,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* Lane backgrounds */}
        {lanes.map((l) => (
          <g key={l.id}>
            <rect x={l.x} y={4} width={LANE_W} height={TOTAL_H - 8} rx={8}
              fill={l.bg} stroke={l.border} strokeWidth={1} />
            {l.id === 'databricks' && (
              <rect x={l.x} y={4} width={LANE_W} height={TOTAL_H - 8} rx={8} fill="url(#dbGrid)" />
            )}
            <text x={l.x + LANE_W / 2} y={30} textAnchor="middle"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: l.textColor, letterSpacing: '0.1em' }}>
              {l.label}
            </text>
          </g>
        ))}

        {/* Source nodes */}
        {srcNodes.map((n, i) => (
          <g key={i}>
            <rect x={lanes[0].x + 12} y={n.y} width={NODE_W} height={NODE_H} rx={NODE_R}
              fill="#0A1220" stroke="#243550" strokeWidth={1} />
            <text x={lanes[0].x + 12 + NODE_W / 2} y={n.y + NODE_H / 2 + 4} textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 11, fill: '#8A9DB5' }}>{n.label}</text>
          </g>
        ))}

        {/* Databricks platform nodes */}
        {dbNodes.map((n, i) => (
          <g key={i}>
            <rect x={lanes[1].x + 12} y={n.y} width={NODE_W} height={NODE_H} rx={NODE_R}
              fill="#071A1A" stroke="#0E3A3A" strokeWidth={1.2} />
            <text x={lanes[1].x + 12 + NODE_W / 2} y={n.y + NODE_H / 2 + 4} textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 11, fill: '#00C6BE' }}>{n.label}</text>
          </g>
        ))}

        {/* Anaplan nodes */}
        {apNodes.map((n, i) => (
          <g key={i}>
            <rect x={lanes[2].x + 12} y={n.y} width={NODE_W} height={NODE_H} rx={NODE_R}
              fill="#0A1220" stroke="#2A1A1A" strokeWidth={1} />
            <text x={lanes[2].x + 12 + NODE_W / 2} y={n.y + NODE_H / 2 + 4} textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 11, fill: '#EE3D2C' }}>{n.label}</text>
          </g>
        ))}

        {/* Arrows */}
        {arrows.map(([fl, fi, tl, ti, label, color, dashed, bidir], idx) => {
          const markerMap = { '#00C6BE': 'arrowC', '#4A5568': 'arrowG', '#D4A843': 'arrowGold', '#8A9DB5': 'arrowMuted' };
          const revMap    = { '#00C6BE': 'arrowCRev', '#8A9DB5': 'arrowMutedRev' };
          const markEnd = `url(#${markerMap[color] || 'arrowC'})`;
          const markStart = bidir ? `url(#${revMap[color] || 'arrowCRev'})` : 'none';
          const d = arrowPath(fl, fi, tl, ti);
          const isSameLane = fl === tl;
          const mx = isSameLane
            ? lanes[fl].x + LANE_W - 10
            : (nc(fl,fi).x + nc(tl,ti).x) / 2;
          const my = (nc(fl,fi).y + nc(tl,ti).y) / 2;

          return (
            <g key={idx}>
              <path d={d} fill="none" stroke={color} strokeWidth={color === '#00C6BE' ? 1.8 : 1.2}
                strokeDasharray={dashed ? '5 4' : (color === '#00C6BE' ? '0' : '0')}
                markerEnd={markEnd} markerStart={markStart}
                className={color === '#00C6BE' && !dashed ? 'swim-anim' : ''}
                opacity={0.8} />
              {label && !isSameLane && (
                <text x={mx} y={my - 5} textAnchor="middle"
                  style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: color, opacity: 0.9 }}>
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Integration Pattern Tabs ──────────────────────────────────────────────
function IntegrationTabs() {
  const [active, setActive] = useState(0);
  const p = INTEGRATION_PATTERNS[active];

  const dirColors = { 'INTO Anaplan': '#00C6BE', 'OUT of Anaplan': '#EE3D2C', 'Internal to Databricks': '#D4A843', 'Bidirectional (policy-driven)': '#8A9DB5' };

  return (
    <div>
      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {INTEGRATION_PATTERNS.map((pat, i) => (
          <button key={pat.id}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: i === active ? 'rgba(238,61,44,0.15)' : 'var(--db-navy-2)',
              color: i === active ? 'var(--db-red)' : 'var(--db-muted)',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
              borderBottom: i === active ? '2px solid var(--db-red)' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}>
            {pat.label}
          </button>
        ))}
      </div>

      <div style={{ animation: 'fadeInUp 0.2s ease forwards' }}>
        {/* Direction badge + frequency */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ padding: '4px 12px', borderRadius: 20, fontFamily: 'DM Mono, monospace', fontSize: 11,
            background: `${dirColors[p.direction]}18`, color: dirColors[p.direction],
            border: `1px solid ${dirColors[p.direction]}40` }}>
            {p.direction}
          </span>
          {p.frequency && <span className="pill pill-muted">{p.frequency}</span>}
          {p.trigger && <span className="pill pill-muted">{p.trigger}</span>}
          {p.latency && <span className="pill pill-gold">{p.latency}</span>}
          {p.orchestrator && <span className="pill pill-navy">{p.orchestrator}</span>}
        </div>

        {/* Steps */}
        {p.steps && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pipeline Steps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.steps.map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--db-navy)', borderRadius: 6, border: '1px solid var(--db-border)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(238,61,44,0.15)', border: '1px solid rgba(238,61,44,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11, color: 'var(--db-red)' }}>
                    {s.n}
                  </div>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted-2)', lineHeight: 1.6 }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tables consumed/written */}
        {p.tables && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {p.direction === 'OUT of Anaplan' ? 'Tables Written (Anaplan → Delta Lake)' : 'Tables Consumed'}
            </div>
            <div style={{ overflowX: 'auto', borderRadius: 7, border: '1px solid var(--db-border)' }}>
              <table className="db-table" style={{ minWidth: 500 }}>
                <thead>
                  <tr>
                    <th>{p.direction === 'OUT of Anaplan' ? 'Anaplan Module' : 'Delta Table'}</th>
                    <th>{p.direction === 'OUT of Anaplan' ? 'Delta Table' : 'Anaplan Module'}</th>
                    <th>{p.direction === 'OUT of Anaplan' ? 'Notes' : 'Model'}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.tables.map((t, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-teal)' }}>
                        {p.direction === 'OUT of Anaplan' ? t.anaplan : t.delta}
                      </td>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-gold)' }}>
                        {p.direction === 'OUT of Anaplan' ? t.delta : t.anaplan}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--db-muted)' }}>
                        {p.direction === 'OUT of Anaplan' ? t.notes : t.hub}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Column mapping (pattern 0) */}
        {p.columnMapping && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Column Mapping — Delta → Anaplan</div>
            <div style={{ overflowX: 'auto', borderRadius: 7, border: '1px solid var(--db-border)' }}>
              <table className="db-table" style={{ minWidth: 500 }}>
                <thead>
                  <tr><th>Delta Column</th><th>Anaplan Target</th><th>Transform Notes</th></tr>
                </thead>
                <tbody>
                  {p.columnMapping.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-teal)' }}>{c.delta}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-red)' }}>{c.anaplan}</td>
                      <td style={{ fontSize: 12, color: 'var(--db-muted)' }}>{c.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error handling */}
        {p.errorHandling && (
          <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(238,61,44,0.06)', borderRadius: 7, border: '1px solid rgba(238,61,44,0.2)', borderLeft: '3px solid var(--db-red)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Error Handling</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.6 }}>{p.errorHandling}</div>
          </div>
        )}

        {/* Consumers (pattern 2) */}
        {p.consumers && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Consumers</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.consumers.map((c, i) => <span key={i} className="pill pill-navy">{c}</span>)}
            </div>
          </div>
        )}

        {/* Governance note */}
        {p.governance && (
          <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(0,198,190,0.05)', borderRadius: 7, border: '1px solid rgba(0,198,190,0.15)', borderLeft: '3px solid var(--db-teal)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Unity Catalog Governance</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.6 }}>{p.governance}</div>
          </div>
        )}

        {/* Anaplan side / Databricks side (pattern 3) */}
        {p.anaplanSide && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Anaplan Side</div>
              {p.anaplanSide.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--db-red)', marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Databricks Side</div>
              {p.databricksSide.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--db-teal)', marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementation note (pattern 3) */}
        {p.implementation && (
          <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(138,157,181,0.07)', borderRadius: 7, border: '1px solid rgba(138,157,181,0.2)', borderLeft: '3px solid var(--db-muted-2)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Implementation</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.6 }}>{p.implementation}</div>
          </div>
        )}

        {/* Purpose (patterns 2,3) */}
        {p.purpose && (
          <div style={{ marginBottom: 24, padding: '12px 16px', background: 'var(--db-navy-3)', borderRadius: 7, border: '1px solid var(--db-border)' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Purpose</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.6 }}>{p.purpose}</div>
          </div>
        )}

        {/* Code blocks */}
        {(p.apiSample || p.sql || p.syncScript) && (
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              {p.sql ? 'SQL View Definition' : p.syncScript ? 'Reconciliation Script (Python)' : 'API Reference'}
            </div>
            <pre className="formula-block" style={{ fontSize: 11, overflowX: 'auto', lineHeight: 1.7 }}>
              {p.apiSample || p.sql || p.syncScript}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Delta Table Schemas ───────────────────────────────────────────────────
function DeltaTableSchemas() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {DELTA_TABLES.map((t, i) => (
        <div key={t.name} className="accordion-item">
          <div className="accordion-header" onClick={() => setOpen(open === i ? null : i)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              {open === i
                ? <ChevronDown size={14} color="var(--db-teal)" style={{ flexShrink: 0 }} />
                : <ChevronRight size={14} color="var(--db-muted)" style={{ flexShrink: 0 }} />}
              <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500, fontSize: 12, color: 'var(--db-teal)' }}>{t.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)' }}>{t.direction}</span>
              <span style={{ padding: '2px 8px', borderRadius: 20, fontFamily: 'DM Mono, monospace', fontSize: 10,
                background: `${t.classColor}18`, color: t.classColor, border: `1px solid ${t.classColor}35` }}>
                {t.classification}
              </span>
            </div>
          </div>
          {open === i && (
            <div className="accordion-body">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.6, marginBottom: 16 }}>{t.description}</p>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Refresh</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-white)' }}>{t.refresh}</div>
                </div>
                {t.partitioned && (
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Partitioned By</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-white)' }}>{t.partitioned}</div>
                  </div>
                )}
                {t.zorder && (
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Z-Order</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-white)' }}>{t.zorder}</div>
                  </div>
                )}
                {t.consumers && (
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Consumers</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {t.consumers.map((c, ci) => <span key={ci} className="pill pill-navy">{c}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Columns table */}
              <div style={{ overflowX: 'auto', borderRadius: 6, border: '1px solid var(--db-border)' }}>
                <table className="db-table" style={{ minWidth: 480 }}>
                  <thead>
                    <tr><th>Column</th><th>Type</th><th>Notes</th></tr>
                  </thead>
                  <tbody>
                    {t.columns.map((col, ci) => (
                      <tr key={ci}>
                        <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: col.notes?.includes('⚠') ? 'var(--db-red)' : 'var(--db-teal)' }}>
                          {col.name}
                        </td>
                        <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted-2)' }}>{col.type}</td>
                        <td style={{ fontSize: 12, color: 'var(--db-muted)' }}>{col.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Orchestration Timeline ─────────────────────────────────────────────────
function OrchestrationTimeline() {
  const SYSTEM_COLORS = { source: '#6B7D95', databricks: '#00C6BE', anaplan: '#EE3D2C', validation: '#D4A843' };
  const SYSTEM_LABELS = { source: 'Source System', databricks: 'Databricks', anaplan: 'Anaplan', validation: 'Validation / Alert' };

  // Timeline goes 10 PM → 8 AM (covers overnight)
  // Hours 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8
  const START_HOUR = 22, END_HOUR = 8; // next day
  const TOTAL_HOURS = 10; // 22->8 = 10 hrs
  const BAR_AREA_W = 560;

  function hourToX(h) {
    let adjusted = h < START_HOUR ? h + 24 : h;
    return ((adjusted - START_HOUR) / TOTAL_HOURS) * BAR_AREA_W;
  }

  const hourLabels = [22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8];

  const ph = PIPELINE_HEALTH;

  return (
    <div>
      {/* Pipeline Health Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Last Successful Run', value: ph.lastSuccess, color: 'var(--db-teal)' },
          { label: 'Avg Nightly Duration', value: ph.avgDuration, color: 'var(--db-white)' },
          { label: 'SLA Target', value: ph.slaTarget, color: 'var(--db-gold)' },
          { label: 'Daily Rows Processed', value: ph.dailyRows, color: 'var(--db-white)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Last 7 days status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted)' }}>Last 7 nights:</span>
        {ph.last7Days.map((ok, i) => (
          ok
            ? <CheckCircle key={i} size={16} color="var(--db-teal)" />
            : <Circle key={i} size={16} color="var(--db-red)" />
        ))}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-teal)', marginLeft: 4 }}>All runs within SLA ✓</span>
      </div>

      {/* Nightly timeline */}
      <div style={{ overflowX: 'auto', marginBottom: 36 }}>
        <div style={{ minWidth: 680 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Nightly Job Schedule (10 PM – 8 AM PST)</div>

          {/* Hour ruler */}
          <div style={{ display: 'flex', marginLeft: 160, marginBottom: 6 }}>
            {hourLabels.map((h, i) => (
              <div key={i} style={{ width: BAR_AREA_W / TOTAL_HOURS, textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)' }}>
                {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
              </div>
            ))}
          </div>

          {/* Grid lines + bars */}
          <div style={{ position: 'relative', marginLeft: 160 }}>
            {/* Grid */}
            {hourLabels.map((h, i) => (
              <div key={i} style={{ position: 'absolute', left: (i / TOTAL_HOURS) * BAR_AREA_W, top: 0, bottom: 0, width: 1, background: 'var(--db-border)', zIndex: 0 }} />
            ))}

            {/* Job bars */}
            {ORCHESTRATION_JOBS.map((job, i) => {
              const x = hourToX(job.start);
              const w = Math.max((job.duration / TOTAL_HOURS) * BAR_AREA_W, 8);
              const y = i * 38 + 4;
              return (
                <div key={i} style={{ position: 'relative', height: 38, marginBottom: 0 }}>
                  <div style={{ position: 'absolute', left: -160, top: 8, width: 155, fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right', paddingRight: 8 }}>
                    {job.name}
                  </div>
                  <div style={{ position: 'absolute', left: x, top: 6, width: w, height: 26, borderRadius: 5, background: job.color, opacity: 0.85, display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                    {w > 50 && (
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8.5, color: '#000', fontWeight: 600, opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {(job.duration * 60).toFixed(0)}m
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16, marginLeft: 160, flexWrap: 'wrap' }}>
            {Object.entries(SYSTEM_LABELS).map(([sys, label]) => (
              <div key={sys} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 10, borderRadius: 3, background: SYSTEM_COLORS[sys] }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly calendar strip */}
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Monthly Close Calendar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MONTHLY_JOBS.map((job, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--db-navy)', borderRadius: 6, border: '1px solid var(--db-border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 7, background: `${SYSTEM_COLORS[job.system]}18`, border: `1px solid ${SYSTEM_COLORS[job.system]}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: SYSTEM_COLORS[job.system], lineHeight: 1 }}>DAY</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: SYSTEM_COLORS[job.system], lineHeight: 1 }}>{job.day}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-white)' }}>{job.label}</span>
              </div>
              <span className={`pill pill-${job.system === 'anaplan' ? 'red' : job.system === 'databricks' ? 'teal' : job.system === 'validation' ? 'gold' : 'muted'}`}>
                {SYSTEM_LABELS[job.system]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(0,198,190,0.05)', borderRadius: 6, border: '1px solid rgba(0,198,190,0.15)', fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted)' }}>
          On-call: <span style={{ color: 'var(--db-white)' }}>{ph.onCall}</span>
        </div>
      </div>
    </div>
  );
}

// ─── L4 Content (existing integration architecture) ─────────────────────────
function L4Content() {
  return (
    <>
      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Integration Patterns', value: '4', color: 'var(--db-teal)' },
          { label: 'Delta Tables', value: '6', color: 'var(--db-gold)' },
          { label: 'Nightly Jobs', value: '10', color: 'var(--db-red)' },
          { label: 'SLA Target', value: '6 AM', color: 'var(--db-gold)' },
          { label: 'Rows / Night', value: '~2.4M', color: 'var(--db-teal)' },
          { label: 'Avg Duration', value: '3h 42m', color: 'var(--db-muted-2)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section 1: Swim-lane */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: 56 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>Data Flow Architecture</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>End-to-end swim-lane diagram: source systems → Databricks Platform → Anaplan → outputs</p>
        </div>
        <div className="card" style={{ padding: '28px 16px' }}>
          <SwimLaneDiagram />
        </div>
      </motion.div>

      {/* Section 2: Integration Patterns */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: 56 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>Integration Patterns</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>Four distinct data movement patterns with full technical specifications</p>
        </div>
        <div className="card" style={{ padding: '28px 24px' }}>
          <IntegrationTabs />
        </div>
      </motion.div>

      {/* Section 3: Delta Table Schemas */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: 56 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>Delta Lake Table Schemas</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>Six tables in the <code style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--db-teal)' }}>finance</code> schema — click to expand column definitions</p>
        </div>
        <DeltaTableSchemas />
      </motion.div>

      {/* Section 4: Orchestration Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>Orchestration Timeline</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>Nightly job schedule and monthly close calendar with pipeline health metrics</p>
        </div>
        <div className="card" style={{ padding: '28px 24px' }}>
          <OrchestrationTimeline />
        </div>
      </motion.div>
    </>
  );
}

// ─── Architecture Level Tabs ────────────────────────────────────────────────
const ARCH_TABS = [
  {
    id: 'l4',
    label: 'L4 Integrated',
    sublabel: 'Current State',
    color: '#00C6BE',
    icon: Layers,
    description: 'Bidirectional Delta Lake ↔ Anaplan with CloudWorks, Unity Catalog governance, and full observability',
  },
  {
    id: 'l5',
    label: 'L5 Autonomous',
    sublabel: 'Target State',
    color: '#D4A843',
    icon: Sparkles,
    description: 'ML-augmented forecasting, AI agents, self-healing pipelines, and predictive planning',
  },
];

// ─── Main Integration Page ─────────────────────────────────────────────────
export default function Integration() {
  const [activeTab, setActiveTab] = useState('l4');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Integration Architecture"
        title="Anaplan × Databricks"
        titleAccent="Architecture"
        subtitle={activeTab === 'l4'
          ? 'Bidirectional data architecture connecting the Anaplan planning layer to the Databricks Data Intelligence Platform. Actuals flow in nightly; locked plans flow out monthly for variance analytics.'
          : 'Autonomous FP&A architecture powered by the full Databricks AI stack and Anaplan native AI. ML-augmented forecasting, intelligent agents, and self-driving planning workflows.'
        }
        badge={activeTab === 'l4' ? 'Platform Integration' : 'Autonomous Planning'}
        icon={activeTab === 'l4' ? GitBranch : Sparkles}
      />

      {/* L4 / L5 Tab Switcher */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 36,
        padding: 4, background: 'var(--db-navy-2)', borderRadius: 10,
        border: '1px solid var(--db-border)',
      }}>
        {ARCH_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 20px', borderRadius: 8,
                border: isActive ? `1px solid ${tab.color}40` : '1px solid transparent',
                background: isActive ? `${tab.color}12` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <TabIcon size={16} color={isActive ? tab.color : 'var(--db-muted)'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
                  color: isActive ? tab.color : 'var(--db-muted)',
                  letterSpacing: '0.04em',
                }}>
                  {tab.label}
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: 11,
                  color: isActive ? 'var(--db-muted)' : 'var(--db-muted)',
                  marginTop: 1, opacity: isActive ? 1 : 0.6,
                }}>
                  {tab.sublabel}
                </div>
              </div>
              {isActive && (
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: tab.color,
                  boxShadow: `0 0 8px ${tab.color}60`,
                  marginLeft: 4,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'l4' ? (
          <motion.div
            key="l4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <L4Content />
          </motion.div>
        ) : (
          <motion.div
            key="l5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <L5Section />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
