import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, FileText, Bell, Presentation, Brain, Target, MessageSquare, Sparkles, Bot, Cpu, GitBranch, Database, Server, Search, Layers, Shield, Hexagon, Cloud } from 'lucide-react';
import { L5_LAYERS, L5_USE_CASES, L5_MATURITY, L5_METRICS, L5_FLOWS } from '../data/autonomous';

const ICON_MAP = {
  'refresh': RefreshCw, 'file-text': FileText, 'bell': Bell, 'presentation': Presentation,
  'brain': Brain, 'target': Target, 'message-square': MessageSquare, 'sparkles': Sparkles,
  'bot': Bot, 'cpu': Cpu, 'git-branch': GitBranch, 'database': Database,
  'server': Server, 'search': Search, 'layers': Layers, 'shield': Shield,
  'hexagon': Hexagon, 'cloud': Cloud,
};

const PLATFORM_COLORS = {
  databricks: '#00C6BE',
  anaplan: '#EE3D2C',
  both: '#D4A843',
};

const PLATFORM_LABELS = {
  databricks: 'Databricks',
  anaplan: 'Anaplan',
  both: 'Both Platforms',
};

// ─── Layered Architecture Diagram ────────────────────────────────────────────
function LayeredDiagram() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  return (
    <div>
      <style>{`
        @keyframes flowPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        @keyframes flowDash { to { stroke-dashoffset: -16; } }
        .flow-arrow { animation: flowDash 1.2s linear infinite; }
        .layer-card { transition: all 0.25s ease; cursor: pointer; }
        .layer-card:hover { transform: translateY(-2px); }
        .node-chip { transition: all 0.2s ease; cursor: pointer; }
        .node-chip:hover { transform: translateY(-1px); filter: brightness(1.2); }
      `}</style>

      {/* Circular feedback arrow label */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Continuous Learning Loop — outcomes feed back into the data foundation
        </span>
      </div>

      {/* Layers stack — top to bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {L5_LAYERS.map((layer, layerIdx) => {
          const isActive = activeLayer === layer.id;
          return (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: layerIdx * 0.08 }}
            >
              <div
                className="layer-card"
                onClick={() => setActiveLayer(isActive ? null : layer.id)}
                style={{
                  background: isActive ? layer.bgGrad : 'var(--db-navy-2)',
                  border: `1px solid ${isActive ? layer.borderColor : 'var(--db-border)'}`,
                  borderLeft: `3px solid ${layer.color}`,
                  borderRadius: 8,
                  padding: '18px 22px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Layer header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isActive ? 16 : 0, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Level badge */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: `${layer.color}18`,
                      border: `1px solid ${layer.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11, color: layer.color,
                      flexShrink: 0,
                    }}>
                      L{4 - layerIdx + 1 > 5 ? 5 : ''}
                      {layerIdx === 0 ? 'A' : layerIdx === 1 ? 'C' : layerIdx === 2 ? 'I' : 'F'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: layer.color, letterSpacing: '0.06em' }}>
                        {layer.label}
                      </div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', marginTop: 2 }}>
                        {layer.sublabel}
                      </div>
                    </div>
                  </div>

                  {/* Node count + expand indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)' }}>
                      {layer.nodes.length} components
                    </span>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: layer.color, fontSize: 14 }}
                    >
                      ▾
                    </motion.div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Layer description */}
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.65, marginBottom: 18, paddingRight: 20 }}>
                        {layer.description}
                      </div>

                      {/* Node grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                        {layer.nodes.map((node) => {
                          const Icon = ICON_MAP[node.icon] || Database;
                          const platColor = PLATFORM_COLORS[node.platform];
                          const isNodeActive = activeNode === node.id;

                          return (
                            <div
                              key={node.id}
                              className="node-chip"
                              onClick={(e) => { e.stopPropagation(); setActiveNode(isNodeActive ? null : node.id); }}
                              style={{
                                background: isNodeActive ? `${platColor}12` : 'var(--db-navy)',
                                border: `1px solid ${isNodeActive ? `${platColor}40` : 'var(--db-border)'}`,
                                borderRadius: 7,
                                padding: '14px 16px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: isNodeActive ? 10 : 0 }}>
                                <div style={{
                                  width: 28, height: 28, borderRadius: 6,
                                  background: `${platColor}15`,
                                  border: `1px solid ${platColor}30`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  flexShrink: 0,
                                }}>
                                  <Icon size={14} color={platColor} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 12, color: 'var(--db-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {node.name}
                                  </div>
                                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: platColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {PLATFORM_LABELS[node.platform]}
                                  </div>
                                </div>
                              </div>

                              {isNodeActive && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.15 }}
                                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', lineHeight: 1.6 }}
                                >
                                  {node.desc}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Flow arrow between layers */}
              {layerIdx < L5_LAYERS.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="2" height="20" style={{ display: 'block' }}>
                      <line x1="1" y1="0" x2="1" y2="20" stroke={L5_FLOWS[layerIdx]?.color || '#1E2E48'} strokeWidth="1.5" strokeDasharray="4 3" className="flow-arrow" />
                    </svg>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: L5_FLOWS[layerIdx]?.color || 'var(--db-muted)', letterSpacing: '0.04em' }}>
                      {L5_FLOWS[layerIdx]?.label || ''}
                    </span>
                    <svg width="2" height="20" style={{ display: 'block' }}>
                      <line x1="1" y1="0" x2="1" y2="20" stroke={L5_FLOWS[layerIdx]?.color || '#1E2E48'} strokeWidth="1.5" strokeDasharray="4 3" className="flow-arrow" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Feedback loop indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 12, alignItems: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 2 A8 8 0 1 1 2 10" fill="none" stroke="#D4A843" strokeWidth="1.5" strokeDasharray="3 2">
            <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="4s" repeatCount="indefinite" />
          </path>
          <polygon points="3,7 0,11 6,11" fill="#D4A843">
            <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="4s" repeatCount="indefinite" />
          </polygon>
        </svg>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#D4A843', letterSpacing: '0.06em' }}>
          CLOSED-LOOP: Action outcomes feed back into Data Foundation
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 18 A8 8 0 1 1 18 10" fill="none" stroke="#D4A843" strokeWidth="1.5" strokeDasharray="3 2">
            <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="-360 10 10" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>

      {/* Platform legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
        {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: PLATFORM_COLORS[key] }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Use Case Cards ──────────────────────────────────────────────────────────
function UseCaseCards() {
  const [expandedCase, setExpandedCase] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {L5_USE_CASES.map((uc) => {
        const isOpen = expandedCase === uc.id;
        return (
          <div
            key={uc.id}
            className="accordion-item"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpandedCase(isOpen ? null : uc.id)}
          >
            <div className="accordion-header" style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: 'var(--db-muted)', fontSize: 12, flexShrink: 0 }}
                >
                  ▸
                </motion.div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--db-white)' }}>
                    {uc.title}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', marginTop: 2 }}>
                    {uc.category}
                  </div>
                </div>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 20,
                fontFamily: 'DM Mono, monospace', fontSize: 10,
                background: `${uc.statusColor}18`, color: uc.statusColor,
                border: `1px solid ${uc.statusColor}35`,
                flexShrink: 0,
              }}>
                {uc.status}
              </span>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="accordion-body"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.65, marginBottom: 16 }}>
                    {uc.description}
                  </p>

                  {/* Impact callout */}
                  <div style={{ padding: '12px 16px', background: 'rgba(0,198,190,0.06)', borderRadius: 7, border: '1px solid rgba(0,198,190,0.15)', borderLeft: '3px solid var(--db-teal)', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Measured Impact</div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-white)', lineHeight: 1.5 }}>{uc.impact}</div>
                  </div>

                  {/* Platform components */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: '12px 14px', background: 'var(--db-navy)', borderRadius: 6, border: '1px solid var(--db-border)' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#00C6BE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Databricks Components</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {uc.databricksComponents.map((c, i) => (
                          <span key={i} style={{ padding: '2px 8px', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: 10, background: 'rgba(0,198,190,0.10)', color: '#00C6BE', border: '1px solid rgba(0,198,190,0.20)' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px', background: 'var(--db-navy)', borderRadius: 6, border: '1px solid var(--db-border)' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#EE3D2C', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Anaplan Components</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {uc.anaplanComponents.map((c, i) => (
                          <span key={i} style={{ padding: '2px 8px', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: 10, background: 'rgba(238,61,44,0.10)', color: '#EE3D2C', border: '1px solid rgba(238,61,44,0.20)' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Data flow pipeline */}
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>End-to-End Flow</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      {uc.flow.map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 5,
                            fontFamily: 'DM Mono, monospace', fontSize: 10,
                            background: 'var(--db-navy-3)', border: '1px solid var(--db-border)',
                            color: 'var(--db-white)', whiteSpace: 'nowrap',
                          }}>
                            {step}
                          </span>
                          {i < uc.flow.length - 1 && (
                            <span style={{ color: 'var(--db-muted)', fontSize: 10 }}>→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Maturity Roadmap ────────────────────────────────────────────────────────
function MaturityRoadmap() {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {/* Vertical connecting line */}
        <div style={{ position: 'absolute', left: 19, top: 24, bottom: 24, width: 2, background: 'var(--db-border)', zIndex: 0 }} />

        {L5_MATURITY.map((m, i) => {
          const isComplete = m.status === 'completed';
          const isCurrent = m.status === 'current';
          const isTarget = m.status === 'target';

          return (
            <div key={m.level} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 0', position: 'relative', zIndex: 1 }}>
              {/* Status dot */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: isComplete ? `${m.color}30` : isCurrent ? `${m.color}25` : `${m.color}10`,
                border: `2px solid ${isCurrent ? m.color : isTarget ? `${m.color}60` : `${m.color}40`}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isCurrent ? `0 0 12px ${m.color}40` : 'none',
              }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12, color: m.color }}>{m.level}</span>
              </div>

              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: isCurrent || isTarget ? m.color : 'var(--db-muted)' }}>
                    {m.name}
                  </span>
                  {isCurrent && (
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontFamily: 'DM Mono, monospace', fontSize: 9, background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}>
                      CURRENT STATE
                    </span>
                  )}
                  {isTarget && (
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontFamily: 'DM Mono, monospace', fontSize: 9, background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40`, animation: 'flowPulse 2s ease-in-out infinite' }}>
                      TARGET STATE
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', marginTop: 4, lineHeight: 1.5 }}>
                  {m.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Exported Full L5 Section ────────────────────────────────────────────────
export default function L5Section() {
  return (
    <div>
      {/* L5 Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
        {L5_METRICS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="card"
            style={{ padding: '16px 20px', textAlign: 'center' }}
          >
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Maturity Roadmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: 56 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>Planning Maturity Roadmap</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>L1 → L5 evolution from manual spreadsheets to autonomous, AI-driven planning</p>
        </div>
        <div className="card" style={{ padding: '24px 24px' }}>
          <MaturityRoadmap />
        </div>
      </motion.div>

      {/* Layered Architecture Diagram */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ marginBottom: 56 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>L5 Autonomous Architecture</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>Four-layer stack: Data Foundation → Intelligence Engine → Planning Co-Pilots → Autonomous Action. Click each layer to explore components.</p>
        </div>
        <div className="card" style={{ padding: '28px 24px' }}>
          <LayeredDiagram />
        </div>
      </motion.div>

      {/* AI Use Cases */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
        <div className="section-heading" style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--db-white)', margin: 0 }}>AI Use Cases</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6 }}>Five autonomous planning capabilities with measured impact — from ML-augmented forecasting to AI-generated board narratives</p>
        </div>
        <UseCaseCards />
      </motion.div>
    </div>
  );
}
