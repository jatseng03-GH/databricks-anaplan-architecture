import { useState } from 'react';

/*─────────────────────────────────────────────────────────────────────────────
  L5 Autonomous System Landscape — SVG Diagram
  Same visual language as the L4 LandscapeDiagram: positioned SVG nodes,
  animated dashed connections, and hover-to-inspect tooltips.
  Four horizontal bands: Foundation → Intelligence → Co-Pilots → Actions.
  Spokes abstracted to a single label. Hub remains the visual anchor.
─────────────────────────────────────────────────────────────────────────────*/

// ── Node definitions with absolute (x, y) positions ──────────────────────

// Foundation layer (bottom)
const FOUNDATION = [
  { id: 'delta',      label: 'Delta Lake',      sub: 'Finance Schema',   x: 115, y: 465, w: 88, h: 36, color: '#00C6BE' },
  { id: 'unity',      label: 'Unity Catalog',   sub: 'Governance',       x: 115, y: 415, w: 88, h: 36, color: '#00C6BE' },
  { id: 'workflows',  label: 'DB Workflows',    sub: 'Orchestration',    x: 115, y: 515, w: 88, h: 36, color: '#00C6BE' },
  { id: 'cloudworks', label: 'CloudWorks',       sub: 'Integration',     x: 530, y: 465, w: 76, h: 36, color: '#00C6BE' },
  { id: 'spokes',     label: 'Spoke Models ×6', sub: 'Planning Models',  x: 640, y: 465, w: 98, h: 36, color: '#EE3D2C' },
];

// Intelligence layer (middle-low)
const INTELLIGENCE = [
  { id: 'mosaic',   label: 'Mosaic AI',      sub: 'Model Training',     x: 100, y: 310, w: 84, h: 34, color: '#00C6BE' },
  { id: 'mlflow',   label: 'MLflow',          sub: 'Model Registry',    x: 230, y: 310, w: 80, h: 34, color: '#00C6BE' },
  { id: 'features', label: 'Feature Store',   sub: '23 Tables',         x: 360, y: 310, w: 86, h: 34, color: '#00C6BE' },
  { id: 'serving',  label: 'Model Serving',   sub: 'Inference API',     x: 500, y: 310, w: 90, h: 34, color: '#00C6BE' },
  { id: 'vector',   label: 'Vector Search',   sub: 'RAG Context',       x: 640, y: 310, w: 88, h: 34, color: '#00C6BE' },
];

// Co-Pilots layer (middle-high)
const COPILOTS = [
  { id: 'planiq',    label: 'PlanIQ',      sub: 'ML Forecasting',      x: 105, y: 190, w: 76, h: 34, color: '#EE3D2C' },
  { id: 'optimizer', label: 'Optimizer',    sub: 'Constraint Solver',   x: 225, y: 190, w: 82, h: 34, color: '#EE3D2C' },
  { id: 'ai-assist', label: 'AI Assist',    sub: 'NL → Formula',       x: 350, y: 190, w: 78, h: 34, color: '#EE3D2C' },
  { id: 'genie',     label: 'AI/BI Genie',  sub: 'Natural Language',   x: 510, y: 190, w: 86, h: 34, color: '#00C6BE' },
  { id: 'agents',    label: 'AI Agents',    sub: 'Compound AI',        x: 645, y: 190, w: 82, h: 34, color: '#00C6BE' },
];

// Autonomous Actions (top)
const ACTIONS = [
  { id: 'reforecast', label: 'Auto-Reforecast', sub: 'Drift-Triggered',   x: 110, y: 75, w: 100, h: 34, color: '#D4A843' },
  { id: 'narratives', label: 'AI Narratives',    sub: 'Variance Cmmtry',  x: 275, y: 75, w: 94, h: 34, color: '#D4A843' },
  { id: 'board',      label: 'Board Deck',       sub: 'Auto-Generated',   x: 430, y: 75, w: 88, h: 34, color: '#D4A843' },
  { id: 'alerts',     label: 'Smart Alerts',     sub: 'Context-Aware',    x: 580, y: 75, w: 88, h: 34, color: '#D4A843' },
];

// Hub hexagon center
const HUB = { x: 380, y: 465, r: 52 };

// ── Tooltip data ─────────────────────────────────────────────────────────
const TOOLTIPS = {
  delta:      { name: 'Delta Lake — Finance Schema', type: 'Data Foundation', typeColor: '#00C6BE', description: '6 versioned, ACID-compliant finance tables with time travel and Change Data Feed. GL actuals, headcount, cloud costs, plan exports. Partitioned by period; Z-ordered for query performance.', details: ['6 Delta Tables', 'Nightly refresh', 'Time travel'], keyOutput: 'Automated actuals feed + ML training data source' },
  unity:      { name: 'Unity Catalog', type: 'Data Foundation', typeColor: '#00C6BE', description: 'Centralized governance: table-level grants, PII column masking (salary data), row-level security by cost center, data lineage, and AI asset registration for models and endpoints.', details: ['Column masking', 'Row-level security', 'AI asset registry'], keyOutput: 'SOX-ready access control across data + AI assets' },
  workflows:  { name: 'Databricks Workflows', type: 'Data Foundation', typeColor: '#00C6BE', description: 'Nightly ETL pipeline: pulls from Workday, NetSuite, Salesforce, cloud cost APIs. Transforms into finance-ready Delta tables. Triggers CloudWorks import and anomaly detection.', details: ['10 nightly jobs', '22:00–06:00 window', 'SLA: 6 AM'], keyOutput: 'Zero-touch data pipeline from source to planning models' },
  cloudworks: { name: 'Anaplan CloudWorks', type: 'Data Foundation', typeColor: '#00C6BE', description: 'Native bidirectional integration: reads actuals from ADLS Gen2 landing zone, triggers Anaplan imports. Exports locked plans back to Delta Lake. Now also carries ML-generated driver overrides from Model Serving.', details: ['ADLS connector', 'Event-driven', 'ML driver import'], keyOutput: 'Bidirectional data bridge — now carrying AI-generated inputs' },
  spokes:     { name: 'Spoke Models ×6', type: 'Anaplan Planning', typeColor: '#EE3D2C', description: 'Topline Forecast, Headcount Planning, Non-HC Opex, Infrastructure & COGS, Equity Compensation, Sales Ops & Commissions. Each connected to the Data Hub. Now augmented with PlanIQ and Optimizer.', details: ['6 models', 'Hub-connected', 'AI-augmented'], keyOutput: 'Full planning coverage with ML-enhanced forecasting' },
  hub:        { name: 'Anaplan Data Hub', type: 'Hub Model', typeColor: '#EE3D2C', description: 'Central model owning all shared master data — org hierarchy, cost centers, time periods, global assumptions. Single source of truth for all 6 spoke models. AI co-pilots (PlanIQ, Optimizer, AI Assist) operate natively here.', details: ['8 Modules', '9 Lists', 'PlanIQ · Optimizer'], keyOutput: 'AI-augmented single source of truth for all planning' },
  mosaic:     { name: 'Mosaic AI', type: 'Intelligence Engine', typeColor: '#00C6BE', description: 'Foundation model training and fine-tuning for finance-specific tasks: revenue forecasting (3.2% MAPE with XGBoost + Prophet ensemble), cloud cost prediction, headcount attrition modeling, and variance explanation generation.', details: ['Ensemble models', 'Fine-tuned LLMs', '3.2% MAPE'], keyOutput: 'Production ML models for all planning domains' },
  mlflow:     { name: 'MLflow', type: 'Intelligence Engine', typeColor: '#00C6BE', description: 'Experiment tracking and model registry. Every forecast model version tracked with MAPE, RMSE, and full lineage back to Delta Lake training data. Model promotion via CI/CD pipeline.', details: ['Model registry', 'Experiment tracking', 'CI/CD promotion'], keyOutput: 'Versioned, reproducible forecast model lifecycle' },
  features:   { name: 'Feature Store', type: 'Intelligence Engine', typeColor: '#00C6BE', description: '23 planning-specific feature tables: trailing-12-month actuals, seasonal indices, macro indicators, hiring velocity, cloud consumption trends, FX rates. Shared across all ML models with point-in-time correctness.', details: ['23 feature tables', 'Point-in-time lookups', 'Shared features'], keyOutput: 'Consistent, reusable features powering all AI models' },
  serving:    { name: 'Model Serving', type: 'Intelligence Engine', typeColor: '#00C6BE', description: 'Real-time inference endpoints: anomaly detection scores every GL batch load (>3σ → flag, 94% catch rate, <15 min). On-demand forecast generation via REST API. Feeds ML drivers to CloudWorks.', details: ['Real-time inference', '94% anomaly catch', 'REST API'], keyOutput: 'Real-time intelligence powering autonomous actions' },
  vector:     { name: 'Vector Search', type: 'Intelligence Engine', typeColor: '#00C6BE', description: 'Semantic search over finance documents — board decks, variance memos, audit findings, historical commentary. Agents use RAG to ground AI-generated narratives in organizational context.', details: ['Document embeddings', 'RAG pipeline', 'Semantic search'], keyOutput: 'Context-grounded narrative generation' },
  planiq:     { name: 'Anaplan PlanIQ', type: 'Planning Co-Pilot', typeColor: '#EE3D2C', description: 'Native ML forecasting inside Anaplan spoke models. Generates statistical baselines (ARIMA, ETS, Prophet) directly in Anaplan. FP&A compares ML vs. judgment-based forecasts side-by-side and overlays business context.', details: ['Native Anaplan ML', 'Statistical baseline', 'Side-by-side view'], keyOutput: 'ML-augmented forecasts in every spoke model' },
  optimizer:  { name: 'Anaplan Optimizer', type: 'Planning Co-Pilot', typeColor: '#EE3D2C', description: 'Constraint-based linear programming: optimal headcount allocation across departments, territory assignment for max revenue coverage, budget distribution within approved envelopes.', details: ['Linear programming', 'Multi-constraint', 'Scenario-aware'], keyOutput: 'Optimal resource allocation across planning scenarios' },
  'ai-assist':{ name: 'Anaplan AI Assist', type: 'Planning Co-Pilot', typeColor: '#EE3D2C', description: 'Natural language → DCA formula generation. Analysts describe business logic in English; AI Assist generates formulas, suggests module structures, and recommends best practices.', details: ['NL → formula', 'Model copilot', 'Best practices'], keyOutput: 'Faster Anaplan model building and iteration' },
  genie:      { name: 'AI/BI Genie', type: 'Planning Co-Pilot', typeColor: '#00C6BE', description: '"What drove the Q3 EMEA variance?" — Genie queries variance_bridge and Delta Lake, auto-generates visualizations, and explains root causes in natural language. Self-serve for VP of FP&A.', details: ['Natural language SQL', 'Auto-visualization', 'Self-serve'], keyOutput: 'Self-serve analytics for non-technical finance leaders' },
  agents:     { name: 'Databricks AI Agents', type: 'Planning Co-Pilot', typeColor: '#00C6BE', description: 'Compound AI systems chaining multiple tools: pull actuals → run anomaly detection → draft variance commentary → post to Slack → trigger Anaplan replan if needed. Built on Mosaic AI Agent Framework.', details: ['Multi-step chains', 'Tool orchestration', 'Agent Framework'], keyOutput: 'End-to-end autonomous planning workflows' },
  reforecast: { name: 'Auto-Reforecast', type: 'Autonomous Action', typeColor: '#D4A843', description: 'When Model Serving detects >5% drift from prior forecast, it triggers a full replan cycle: updated ML drivers pushed via CloudWorks → Anaplan spoke models recalculate → FP&A notified with context. ~4 cycles/month.', details: ['Drift threshold: 5%', '~4 cycles/month', 'Fully automated'], keyOutput: 'Self-correcting forecasts without manual intervention' },
  narratives: { name: 'AI Variance Narratives', type: 'Autonomous Action', typeColor: '#D4A843', description: 'After monthly close, Mosaic AI + Vector Search generate plain-English variance commentary for every cost center. RAG-grounded in prior board decks. FP&A reviews AI drafts instead of writing from scratch.', details: ['Per-CC narratives', 'RAG-grounded', 'CFO-ready'], keyOutput: 'CFO deck prep reduced from 5 days to 1.5 days' },
  board:      { name: 'Board Deck Auto-Generation', type: 'Autonomous Action', typeColor: '#D4A843', description: 'Quarterly board package auto-assembled: P&L variance walk, ARR bridge, headcount waterfall, gross margin analysis. Charts, commentary, and slides produced end-to-end. FP&A reviews only.', details: ['Quarterly cadence', 'Auto charts', 'Review-only workflow'], keyOutput: 'Zero-touch board package generation' },
  alerts:     { name: 'Contextual Smart Alerts', type: 'Autonomous Action', typeColor: '#D4A843', description: '"Cloud COGS +12% vs. plan driven by 23% DBU spike in EMEA — recommend reviewing Infrastructure spoke." AI-enriched Slack/Teams notifications with root cause analysis and suggested next action.', details: ['Root cause included', 'Action suggestions', 'Slack + Teams'], keyOutput: 'Proactive, actionable insights pushed to stakeholders' },
};

// ── Connection definitions [fromId, toId, color, dashed] ─────────────────
const CONNECTIONS = [
  // Foundation → Intelligence
  ['delta', 'features', '#00C6BE', true],
  ['delta', 'mosaic', '#00C6BE', true],
  ['delta', 'serving', '#00C6BE', true],

  // Intelligence → Co-Pilots
  ['serving', 'agents', '#00C6BE', true],
  ['serving', 'genie', '#00C6BE', true],
  ['mosaic', 'planiq', '#00C6BE', true],
  ['vector', 'agents', '#00C6BE', true],
  ['features', 'mosaic', '#00C6BE', true],

  // Co-Pilots → Actions
  ['agents', 'reforecast', '#D4A843', true],
  ['agents', 'alerts', '#D4A843', true],
  ['genie', 'narratives', '#D4A843', true],
  ['agents', 'board', '#D4A843', true],

  // Hub ↔ CloudWorks ↔ Delta Lake (bidirectional pipeline, solid)
  ['delta', 'cloudworks', '#00C6BE', false],

  // PlanIQ/Optimizer → Hub (Anaplan internal)
  ['planiq', 'hub', '#EE3D2C', true],
  ['optimizer', 'hub', '#EE3D2C', true],
  ['ai-assist', 'hub', '#EE3D2C', true],

  // Hub → Spokes
  ['hub', 'spokes', '#EE3D2C', true],
];

// ── Helpers ──────────────────────────────────────────────────────────────
function getNodeCenter(id) {
  const all = [...FOUNDATION, ...INTELLIGENCE, ...COPILOTS, ...ACTIONS];
  const n = all.find(n => n.id === id);
  if (n) return { x: n.x, y: n.y };
  if (id === 'hub') return { x: HUB.x, y: HUB.y };
  return { x: 400, y: 300 };
}

// ── Component ────────────────────────────────────────────────────────────
export default function L5LandscapeDiagram() {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const show = (id) => { setHovered(id); setTooltip(TOOLTIPS[id] || null); };
  const hide = () => { setHovered(null); setTooltip(null); };

  function renderNode(n) {
    const isHov = hovered === n.id;
    const isAnaplan = n.color === '#EE3D2C';
    return (
      <g key={n.id} className="diagram-node"
        onMouseEnter={() => show(n.id)}
        onMouseLeave={hide}
        transform={`translate(${n.x - n.w / 2},${n.y - n.h / 2})`}
      >
        <rect width={n.w} height={n.h} rx={6}
          fill={isHov ? (isAnaplan ? '#1A0F0F' : '#0F2A2A') : (isAnaplan ? '#0F0808' : '#071A1A')}
          stroke={isHov ? n.color : `${n.color}50`}
          strokeWidth={isHov ? 1.5 : 0.8}
        />
        <text x={n.w / 2} y={n.h / 2 - 4} textAnchor="middle"
          style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 8.5, fill: n.color }}>
          {n.label}
        </text>
        <text x={n.w / 2} y={n.h / 2 + 8} textAnchor="middle"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: `${n.color}80` }}>
          {n.sub}
        </text>
      </g>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <style>{`
        @keyframes l5Flow { to { stroke-dashoffset: -20; } }
        .l5-anim { animation: l5Flow 1.8s linear infinite; }
        .diagram-node { cursor: pointer; }
        .diagram-node:hover rect { filter: brightness(1.3); }
      `}</style>

      <svg width="800" height="600" viewBox="0 0 800 600" style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <radialGradient id="hubGradL5" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EE3D2C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#EE3D2C" stopOpacity="0" />
          </radialGradient>
          <marker id="a5teal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#00C6BE" opacity="0.7" />
          </marker>
          <marker id="a5red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#EE3D2C" opacity="0.7" />
          </marker>
          <marker id="a5gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#D4A843" opacity="0.7" />
          </marker>
          <marker id="a5tealR" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
            <path d="M6,0 L6,6 L0,3 z" fill="#00C6BE" opacity="0.5" />
          </marker>
        </defs>

        {/* ═══ BAND BACKGROUNDS ═══ */}

        {/* Actions band */}
        <rect x={40} y={46} width={720} height={56} rx={8}
          fill="rgba(212,168,67,0.04)" stroke="rgba(212,168,67,0.12)" strokeWidth={0.6} />
        <text x={60} y={42} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#D4A843', letterSpacing: '0.12em', opacity: 0.7 }}>
          AUTONOMOUS ACTIONS
        </text>

        {/* Co-Pilots band */}
        <rect x={40} y={164} width={720} height={52} rx={8}
          fill="rgba(238,61,44,0.03)" stroke="rgba(238,61,44,0.10)" strokeWidth={0.6} />
        <text x={60} y={160} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#EE3D2C', letterSpacing: '0.12em', opacity: 0.6 }}>
          PLANNING CO-PILOTS
        </text>
        {/* Anaplan / Databricks split label */}
        <text x={200} y={160} style={{ fontFamily: 'DM Mono, monospace', fontSize: 6, fill: '#6B3A30', letterSpacing: '0.06em' }}>
          Anaplan Native
        </text>
        <text x={560} y={160} style={{ fontFamily: 'DM Mono, monospace', fontSize: 6, fill: '#4A7A78', letterSpacing: '0.06em' }}>
          Databricks AI
        </text>

        {/* Intelligence band */}
        <rect x={40} y={284} width={720} height={52} rx={8}
          fill="rgba(0,198,190,0.03)" stroke="rgba(0,198,190,0.10)" strokeWidth={0.6} />
        <text x={60} y={280} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#00C6BE', letterSpacing: '0.12em', opacity: 0.6 }}>
          INTELLIGENCE ENGINE
        </text>

        {/* Foundation band */}
        <rect x={40} y={396} width={720} height={164} rx={8}
          fill="rgba(138,157,181,0.03)" stroke="rgba(138,157,181,0.10)" strokeWidth={0.6} />
        <text x={60} y={392} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#8A9DB5', letterSpacing: '0.12em', opacity: 0.6 }}>
          DATA FOUNDATION
        </text>

        {/* ═══ CONNECTION LINES ═══ */}
        {CONNECTIONS.map(([fromId, toId, color, dashed], i) => {
          const from = getNodeCenter(fromId);
          const to = getNodeCenter(toId);

          // Determine connection direction (go toward center between nodes)
          const dx = to.x - from.x, dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / len, uy = dy / len;

          // Shorten to avoid overlapping nodes
          const margin = fromId === 'hub' || toId === 'hub' ? 36 : 22;
          const sx = from.x + ux * margin;
          const sy = from.y + uy * margin;
          const ex = to.x - ux * margin;
          const ey = to.y - uy * margin;

          const markerMap = { '#00C6BE': 'a5teal', '#EE3D2C': 'a5red', '#D4A843': 'a5gold' };
          const markerId = markerMap[color] || 'a5teal';

          // Use a curved path for cross-layer connections
          const midY = (sy + ey) / 2;
          const path = `M${sx},${sy} C${sx},${midY} ${ex},${midY} ${ex},${ey}`;

          const isHighlighted = hovered === fromId || hovered === toId;

          return (
            <path key={i} d={path}
              fill="none" stroke={color}
              strokeWidth={isHighlighted ? 1.6 : 1}
              strokeDasharray={dashed ? '5 5' : '0'}
              opacity={isHighlighted ? 0.7 : 0.25}
              markerEnd={`url(#${markerId})`}
              className={dashed ? 'l5-anim' : ''}
              style={{ transition: 'opacity 0.2s ease' }}
            />
          );
        })}

        {/* ═══ Hub → CloudWorks reverse arrow (plan export) ═══ */}
        {(() => {
          const f = getNodeCenter('cloudworks'), t = getNodeCenter('hub');
          const dx = t.x - f.x, dy = t.y - f.y, len = Math.sqrt(dx*dx + dy*dy);
          const ux = dx/len, uy = dy/len;
          return (
            <line x1={f.x - ux * 22} y1={f.y - uy * 18} x2={t.x + ux * 36} y2={t.y + uy * 18}
              stroke="#00C6BE" strokeWidth={1.2} strokeDasharray="5 5" strokeDashoffset={10}
              opacity={hovered === 'cloudworks' || hovered === 'hub' ? 0.5 : 0.15}
              className="l5-anim" markerEnd="url(#a5teal)" markerStart="url(#a5tealR)"
              style={{ transition: 'opacity 0.2s ease' }} />
          );
        })()}

        {/* ═══ NODES ═══ */}

        {/* Foundation nodes */}
        {FOUNDATION.map(renderNode)}

        {/* Intelligence nodes */}
        {INTELLIGENCE.map(renderNode)}

        {/* Co-Pilot nodes */}
        {COPILOTS.map(renderNode)}

        {/* Action nodes */}
        {ACTIONS.map(renderNode)}

        {/* ═══ HUB HEXAGON ═══ */}
        <circle cx={HUB.x} cy={HUB.y} r={80} fill="url(#hubGradL5)" />
        {[0, 1].map(i => (
          <polygon key={`hex-${i}`}
            points={[0,1,2,3,4,5].map(j => {
              const a = (j * 60 - 30) * Math.PI / 180;
              const r = i === 0 ? HUB.r + 8 : HUB.r;
              return `${HUB.x + r * Math.cos(a)},${HUB.y + r * Math.sin(a)}`;
            }).join(' ')}
            fill={i === 0 ? 'rgba(238,61,44,0.10)' : '#0F1828'}
            stroke={i === 0 ? 'rgba(238,61,44,0.40)' : 'rgba(238,61,44,0.20)'}
            strokeWidth={i === 0 ? 1.2 : 0.8}
          />
        ))}
        <g className="diagram-node"
          onMouseEnter={() => show('hub')}
          onMouseLeave={hide}
        >
          <circle cx={HUB.x} cy={HUB.y} r={HUB.r} fill="transparent" />
          <text x={HUB.x} y={HUB.y - 14} textAnchor="middle"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: '#F5F1EB' }}>
            Anaplan
          </text>
          <text x={HUB.x} y={HUB.y} textAnchor="middle"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: '#F5F1EB' }}>
            Data Hub
          </text>
          <text x={HUB.x} y={HUB.y + 14} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: '#6B7D95' }}>
            Master Data · AI Co-Pilots
          </text>
          <rect x={HUB.x - 30} y={HUB.y + 22} width={60} height={12} rx={3}
            fill="rgba(238,61,44,0.10)" stroke="rgba(238,61,44,0.25)" strokeWidth={0.5} />
          <text x={HUB.x} y={HUB.y + 30} textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 5, fill: '#EE3D2C', opacity: 0.6, letterSpacing: '0.04em' }}>
            RBAC · ALM · PlanIQ
          </text>
        </g>

        {/* ═══ BAND FLOW LABELS (between bands) ═══ */}
        <text x={400} y={130} textAnchor="middle"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#D4A843', opacity: 0.5, letterSpacing: '0.06em' }}>
          ▲ approved plans + triggers
        </text>
        <text x={400} y={250} textAnchor="middle"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#00C6BE', opacity: 0.5, letterSpacing: '0.06em' }}>
          ▲ model predictions + insights
        </text>
        <text x={400} y={370} textAnchor="middle"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#8A9DB5', opacity: 0.5, letterSpacing: '0.06em' }}>
          ▲ training data + features
        </text>

        {/* ═══ LEGEND ═══ */}
        <g transform="translate(175, 572)">
          <rect width={450} height={22} rx={4} fill="#0A1220" stroke="#1E2E48" strokeWidth={0.6} />
          <circle cx={16} cy={11} r={4} fill="#00C6BE" opacity={0.7} />
          <text x={26} y={15} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Databricks</text>
          <circle cx={96} cy={11} r={4} fill="#EE3D2C" opacity={0.7} />
          <text x={106} y={15} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Anaplan</text>
          <circle cx={156} cy={11} r={4} fill="#D4A843" opacity={0.7} />
          <text x={166} y={15} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Autonomous</text>
          <line x1={236} y1={11} x2={254} y2={11} stroke="#00C6BE" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.6} />
          <text x={260} y={15} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>AI/ML flow</text>
          <line x1={310} y1={11} x2={328} y2={11} stroke="#00C6BE" strokeWidth={1.2} opacity={0.6} />
          <text x={334} y={15} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Data pipeline</text>
          <line x1={400} y1={11} x2={418} y2={11} stroke="#EE3D2C" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
          <text x={424} y={15} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Hub link</text>
        </g>
      </svg>

      {/* ═══ TOOLTIP ═══ */}
      {tooltip && (
        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(10,15,28,0.97)',
          border: `1px solid ${tooltip.typeColor || '#00C6BE'}`,
          borderRadius: 10, padding: '14px 20px', pointerEvents: 'none',
          minWidth: 260, maxWidth: 360,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${tooltip.typeColor}22`,
          zIndex: 10,
        }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: tooltip.typeColor, letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
            {tooltip.type}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: '#F5F1EB', marginBottom: 8 }}>
            {tooltip.name}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#6B7D95', lineHeight: 1.6, marginBottom: 10 }}>
            {tooltip.description}
          </div>
          {tooltip.details && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {tooltip.details.map((d, i) => (
                <span key={i} style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 10,
                  color: tooltip.typeColor, background: `${tooltip.typeColor}18`,
                  border: `1px solid ${tooltip.typeColor}33`,
                  borderRadius: 4, padding: '2px 7px',
                }}>{d}</span>
              ))}
            </div>
          )}
          {tooltip.keyOutput && (
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#8A9DB5', borderTop: '1px solid #1E2E48', paddingTop: 8 }}>
              → {tooltip.keyOutput}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
