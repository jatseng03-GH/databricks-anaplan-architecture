import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Server, Percent, BadgeDollarSign, Receipt, Database, ArrowRight, CheckCircle, Circle } from 'lucide-react';
import { SPOKE_MODELS } from '../data/models';

const ICON_MAP = { TrendingUp, Users, Server, Percent, BadgeDollarSign, Receipt };

// ── Tooltip data for every node in the diagram ─────────────────────────────

const HUB_TOOLTIP = {
  name: 'Anaplan Data Hub',
  type: 'Hub Model',
  typeColor: '#EE3D2C',
  description:
    'The central model that owns all shared master data — org hierarchy, cost centers, employee lists, and planning drivers. Every spoke model pulls its foundation from here, ensuring one consistent source of truth across all planning processes.',
  details: ['8 Modules', '9 Lists', 'Master Data · Shared Drivers'],
  keyOutput: 'Single source of truth for all planning assumptions',
};

const DB_PLATFORM_TOOLTIPS = {
  'delta-lake': {
    name: 'Delta Lake — Finance Schema',
    type: 'Databricks Platform',
    typeColor: '#00C6BE',
    description:
      'The finance data lake where actuals live — GL transactions, headcount records, and cloud costs — stored in versioned, queryable Delta tables. Anaplan reads directly from here each night, eliminating manual file uploads and the errors that come with them.',
    details: ['6 Delta Tables', 'Nightly refresh', 'finance.actuals schema'],
    keyOutput: 'Automated actuals feed into all Anaplan spoke models',
  },
  'dbsql-node': {
    name: 'Databricks SQL — Variance Analytics',
    type: 'Databricks Platform',
    typeColor: '#00C6BE',
    description:
      'The analytics engine that computes plan vs. actuals variance. Finance analysts query these views directly through Looker or the CFO dashboard, getting instant drill-through into any line item without downloading data to Excel.',
    details: ['SQL warehouses', 'Variance views', 'Looker integration'],
    keyOutput: 'Self-serve variance reporting for finance business partners',
  },
  unity: {
    name: 'Unity Catalog — Access Governance',
    type: 'Databricks Platform',
    typeColor: '#00C6BE',
    description:
      'Centralized data governance that controls who sees what. Salary and compensation fields are masked by role, all data access is logged for audit, and table-level permissions align to Anaplan role-based access — meeting SOX and privacy requirements without extra tooling.',
    details: ['Role-based access', 'PII field masking', 'Full audit log'],
    keyOutput: 'Compliant, auditable access control across the finance data estate',
  },
  workflows: {
    name: 'Databricks Workflows — Pipeline Orchestration',
    type: 'Databricks Platform',
    typeColor: '#00C6BE',
    description:
      'The scheduler and orchestrator for the nightly ETL pipeline. It pulls data from Workday, NetSuite, Salesforce, and AWS automatically each night, transforms it into clean finance-ready tables, and triggers Anaplan import actions — all without human intervention.',
    details: ['10 nightly jobs', '22:00–06:00 window', 'SLA: 6 hrs'],
    keyOutput: 'Fully automated, zero-touch data pipeline for planning models',
  },
};

const SOURCE_TOOLTIPS = {
  workday: {
    name: 'Workday — HRIS',
    type: 'Source System',
    typeColor: '#8A9DB5',
    description:
      'Databricks\' HR system of record. Provides the headcount actuals that flow into the Headcount Planning model — active positions, employee status, department hierarchy, compensation bands, and hire/term dates.',
    details: ['~11,000 employees', 'Nightly export', 'Org hierarchy + compensation'],
    keyOutput: 'Headcount actuals for plan vs. actual variance',
  },
  netsuite: {
    name: 'NetSuite — ERP / General Ledger',
    type: 'Source System',
    typeColor: '#8A9DB5',
    description:
      'The general ledger and ERP. Every dollar of actual operating expense flows through NetSuite by cost center and account. This is the primary actuals source for Non-Headcount Opex, Infrastructure & COGS, and the variance bridge reports.',
    details: ['GL actuals', 'Cost center mapping', 'Daily close feed'],
    keyOutput: 'Opex actuals by cost center for all expense models',
  },
  salesforce: {
    name: 'Salesforce — CRM',
    type: 'Source System',
    typeColor: '#8A9DB5',
    description:
      'The CRM and bookings system. Provides ARR actuals, bookings by product and segment, pipeline by stage, and renewal data. Feeds the Topline Forecast model so the plan is always grounded in real deal activity.',
    details: ['ARR actuals', 'Pipeline data', 'Bookings by segment'],
    keyOutput: 'Topline actuals and pipeline signal for ARR forecasting',
  },
  'aws-cost': {
    name: 'AWS / GCP — Cloud Cost',
    type: 'Source System',
    typeColor: '#8A9DB5',
    description:
      'Cloud infrastructure cost data from AWS Cost Explorer and GCP Billing. Provides actual cloud spend broken down by product, region, and service — the primary input for the Infrastructure & COGS model and gross margin analysis.',
    details: ['DBU cost actuals', 'Region breakdown', 'AWS + GCP feeds'],
    keyOutput: 'Cloud COGS actuals for gross margin modeling',
  },
};

const OUTPUT_TOOLTIPS = {
  looker: {
    name: 'Looker — BI Dashboards',
    type: 'Output',
    typeColor: '#D4A843',
    description:
      'Business intelligence dashboards connected directly to Databricks SQL. Finance business partners and department heads use these to self-serve their variance analysis — drilling from summary P&L down to individual cost center or employee records without exporting to Excel.',
    details: ['Connected to Databricks SQL', 'Self-serve variance drill', 'Live data'],
    keyOutput: 'Finance self-service analytics for all business partners',
  },
  cfodash: {
    name: 'CFO Board Dashboard',
    type: 'Output',
    typeColor: '#D4A843',
    description:
      'The board-ready financial package automatically assembled from Anaplan outputs and Databricks SQL. Updated every Monday morning with the latest plan vs. actuals. Contains P&L summary, ARR bridge, headcount waterfall, and gross margin walk.',
    details: ['Weekly refresh', 'Board package format', 'P&L + ARR + HC'],
    keyOutput: 'Automated board-ready financial reporting package',
  },
  slack: {
    name: 'Slack Alerts — FP&A Team',
    type: 'Output',
    typeColor: '#D4A843',
    description:
      'Automated notifications sent to the FP&A Slack channel when the nightly pipeline completes, fails, or detects data anomalies (e.g., headcount count shifts > 5%, ARR variance > threshold). Keeps the team informed without anyone having to check logs.',
    details: ['Pipeline status alerts', 'Anomaly detection', 'FP&A channel'],
    keyOutput: 'Proactive data quality monitoring for the finance team',
  },
};

// ── System Landscape Diagram ───────────────────────────────────────────────
function LandscapeDiagram() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const cx = 400, cy = 310;
  const r_spoke = 155;
  const r_db = 245;

  const spokePositions = SPOKE_MODELS.map(m => {
    const rad = (m.angle - 90) * Math.PI / 180;
    return { ...m, x: cx + r_spoke * Math.cos(rad), y: cy + r_spoke * Math.sin(rad) };
  });

  const dbPlatformNodes = [
    { id: 'delta-lake', label: 'Delta Lake',       sub: 'Finance Schema',         angle: 315, color: '#00C6BE', linkLabel: 'actuals in / plan out' },
    { id: 'dbsql-node', label: 'Databricks SQL',   sub: 'Variance Analytics',     angle:  45, color: '#00C6BE', linkLabel: 'variance analytics' },
    { id: 'unity',      label: 'Unity Catalog',    sub: 'Access Governance',      angle: 135, color: '#00C6BE', linkLabel: 'access governance' },
    { id: 'workflows',  label: 'DB Workflows',     sub: 'Pipeline Orchestration', angle: 225, color: '#00C6BE', linkLabel: 'pipeline orchestration' },
  ].map(n => {
    const rad = (n.angle - 90) * Math.PI / 180;
    return { ...n, x: cx + r_db * Math.cos(rad), y: cy + r_db * Math.sin(rad) };
  });

  const externals = [
    { id: 'workday',    label: 'Workday',     sub: 'HRIS',           x: 58,  y: 150, targetDbId: 'workflows' },
    { id: 'netsuite',   label: 'NetSuite',    sub: 'ERP',            x: 58,  y: 230, targetDbId: 'workflows' },
    { id: 'salesforce', label: 'Salesforce',  sub: 'CRM',            x: 58,  y: 310, targetDbId: 'workflows' },
    { id: 'aws-cost',   label: 'AWS / GCP',   sub: 'Cloud Cost',     x: 58,  y: 390, targetDbId: 'workflows' },
    { id: 'looker',     label: 'Looker',      sub: 'BI Dashboards',  x: 714, y: 200, targetDbId: 'dbsql-node', output: true },
    { id: 'cfodash',    label: 'CFO Board',   sub: 'Dashboard',      x: 714, y: 310, targetDbId: 'dbsql-node', output: true },
    { id: 'slack',      label: 'Slack Alert', sub: 'FP&A Team',      x: 714, y: 410, targetDbId: 'workflows',  output: true },
  ];

  function shortenLine(x1, y1, x2, y2, margin1 = 40, margin2 = 40) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x1, y1, x2, y2 };
    const ux = dx / len, uy = dy / len;
    return { x1: x1 + ux * margin1, y1: y1 + uy * margin1, x2: x2 - ux * margin2, y2: y2 - uy * margin2 };
  }

  const showTooltip = (data) => { setTooltip(data); };
  const hideTooltip = () => { setTooltip(null); setHovered(null); };

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <style>{`
        @keyframes dashForward  { to { stroke-dashoffset: -24; } }
        @keyframes dashBackward { to { stroke-dashoffset:  24; } }
        .bidir-fwd  { animation: dashForward  1.2s linear infinite; }
        .bidir-bwd  { animation: dashBackward 1.2s linear infinite; }
        @keyframes dashIn { to { stroke-dashoffset: -20; } }
        .src-line   { animation: dashIn 2s linear infinite; }
        .diagram-node { cursor: pointer; }
        .diagram-node:hover rect { filter: brightness(1.3); }
      `}</style>

      <svg width="800" height="640" viewBox="0 0 800 640" style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <radialGradient id="hubGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#EE3D2C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EE3D2C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dbRingGrad" cx="50%" cy="50%" r="50%">
            <stop offset="60%"  stopColor="#00C6BE" stopOpacity="0" />
            <stop offset="100%" stopColor="#00C6BE" stopOpacity="0.06" />
          </radialGradient>
          <marker id="arrowTeal2"  markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#00C6BE" opacity="0.85" />
          </marker>
          <marker id="arrowGold2"  markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#D4A843" opacity="0.7" />
          </marker>
          <marker id="arrowGrey"   markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="#4A5568" opacity="0.8" />
          </marker>
          <marker id="arrowTealRev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
            <path d="M6,0 L6,6 L0,3 z" fill="#00C6BE" opacity="0.85" />
          </marker>
        </defs>

        {/* Background rings */}
        <circle cx={cx} cy={cy} r={r_db + 30} fill="url(#dbRingGrad)" />
        <circle cx={cx} cy={cy} r={108} fill="url(#hubGrad2)" />
        <circle cx={cx} cy={cy} r={r_db} fill="none" stroke="#00C6BE" strokeWidth={0.5} strokeDasharray="4 6" opacity={0.2} />

        {/* Spoke connection lines */}
        {spokePositions.map(s => {
          const isHov = hovered === s.id;
          return (
            <line key={`spoke-line-${s.id}`}
              x1={cx} y1={cy} x2={s.x} y2={s.y}
              stroke={isHov ? '#EE3D2C' : '#2A3A54'}
              strokeWidth={isHov ? 1.8 : 1}
              strokeDasharray="5 4"
              opacity={isHov ? 1 : 0.7}
              className={isHov ? 'bidir-fwd' : ''}
            />
          );
        })}

        {/* Hub ↔ Databricks: bidirectional teal animated lines */}
        {dbPlatformNodes.map(db => {
          const line = shortenLine(cx, cy, db.x, db.y, 68, 42);
          const mx = (cx + db.x) / 2, my = (cy + db.y) / 2;
          const dx = db.x - cx, dy = db.y - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const px = -dy / len * 10, py = dx / len * 10;
          return (
            <g key={`db-line-${db.id}`}>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#00C6BE" strokeWidth={1.8} strokeDasharray="8 8" opacity={0.6}
                className="bidir-fwd" markerEnd="url(#arrowTeal2)" />
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#00C6BE" strokeWidth={1.8} strokeDasharray="8 8" strokeDashoffset={12} opacity={0.35}
                className="bidir-bwd" markerStart="url(#arrowTealRev)" />
              <text x={mx + px} y={my + py} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#00C6BE', opacity: 0.75 }}>
                {db.linkLabel}
              </text>
            </g>
          );
        })}

        {/* External source → DB Workflows lines */}
        {externals.filter(e => !e.output).map(e => {
          const targetDb = dbPlatformNodes.find(d => d.id === e.targetDbId);
          if (!targetDb) return null;
          const line = shortenLine(e.x + 44, e.y, targetDb.x, targetDb.y, 0, 40);
          return (
            <line key={`src-${e.id}`}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke="#4A5568" strokeWidth={1} strokeDasharray="3 4" opacity={0.55}
              className="src-line" markerEnd="url(#arrowGrey)" />
          );
        })}

        {/* DB SQL → output systems lines */}
        {externals.filter(e => e.output).map(e => {
          const targetDb = dbPlatformNodes.find(d => d.id === e.targetDbId);
          if (!targetDb) return null;
          const line = shortenLine(targetDb.x, targetDb.y, e.x, e.y, 40, 0);
          return (
            <line key={`out-${e.id}`}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke="#D4A843" strokeWidth={1} strokeDasharray="3 4" opacity={0.45}
              markerEnd="url(#arrowGold2)" />
          );
        })}

        {/* Databricks platform nodes — with tooltip */}
        {dbPlatformNodes.map(db => {
          const isHov = hovered === db.id;
          return (
            <g key={db.id} className="diagram-node"
              onMouseEnter={() => { setHovered(db.id); showTooltip(DB_PLATFORM_TOOLTIPS[db.id]); }}
              onMouseLeave={hideTooltip}
              transform={`translate(${db.x - 46},${db.y - 24})`}
            >
              <rect width={92} height={48} rx={7}
                fill={isHov ? '#0F2A2A' : '#071A1A'}
                stroke={isHov ? '#00C6BE' : '#0E3A3A'}
                strokeWidth={isHov ? 1.5 : 1}
              />
              <text x={46} y={17} textAnchor="middle"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 9, fill: '#00C6BE' }}>
                {db.label}
              </text>
              <text x={46} y={30} textAnchor="middle"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#4A7A78' }}>
                {db.sub}
              </text>
            </g>
          );
        })}

        {/* Spoke nodes — clickable + tooltip */}
        {spokePositions.map(s => {
          const isHov = hovered === s.id;
          return (
            <g key={s.id} className="diagram-node"
              onMouseEnter={() => { setHovered(s.id); showTooltip({ ...s, type: 'Spoke Model', typeColor: '#EE3D2C', details: [`${s.modules} Modules`, `${s.lists} Lists`] }); }}
              onMouseLeave={hideTooltip}
              onClick={() => navigate(s.path)}
              transform={`translate(${s.x - 52},${s.y - 26})`}
            >
              <rect width={104} height={52} rx={7}
                fill={isHov ? '#1A0F0F' : '#0F1828'}
                stroke={isHov ? '#EE3D2C' : '#1E2E48'}
                strokeWidth={isHov ? 1.5 : 1}
              />
              <text x={52} y={18} textAnchor="middle"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 9, fill: isHov ? '#F5F1EB' : '#8A9DB5' }}>
                {s.name.split(' ').slice(0, 2).join(' ')}
              </text>
              <text x={52} y={29} textAnchor="middle"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 9, fill: isHov ? '#F5F1EB' : '#8A9DB5' }}>
                {s.name.split(' ').slice(2).join(' ')}
              </text>
              <text x={52} y={43} textAnchor="middle"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#6B7D95' }}>
                {s.modules}M · {s.lists}L
              </text>
            </g>
          );
        })}

        {/* Hub hexagon — with tooltip */}
        {[0, 1].map(i => (
          <polygon key={`hex-${i}`}
            points={[0,1,2,3,4,5].map(j => {
              const a = (j * 60 - 30) * Math.PI / 180;
              const radius = i === 0 ? 68 : 58;
              return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
            }).join(' ')}
            fill={i === 0 ? 'rgba(238,61,44,0.14)' : '#0F1828'}
            stroke={i === 0 ? 'rgba(238,61,44,0.55)' : 'rgba(238,61,44,0.25)'}
            strokeWidth={i === 0 ? 1.5 : 1}
          />
        ))}
        {/* Hub text + invisible hit area */}
        <g className="diagram-node"
          onMouseEnter={() => { setHovered('hub'); showTooltip(HUB_TOOLTIP); }}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <circle cx={cx} cy={cy} r={60} fill="transparent" />
          <text x={cx} y={cy - 14} textAnchor="middle"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: '#F5F1EB' }}>Anaplan</text>
          <text x={cx} y={cy} textAnchor="middle"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: '#F5F1EB' }}>Data Hub</text>
          <text x={cx} y={cy + 14} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#6B7D95' }}>Master Data · Drivers</text>
        </g>

        {/* Source system nodes — with tooltip */}
        {externals.filter(e => !e.output).map(e => (
          <g key={e.id} className="diagram-node"
            onMouseEnter={() => { setHovered(e.id); showTooltip(SOURCE_TOOLTIPS[e.id]); }}
            onMouseLeave={hideTooltip}
          >
            <rect x={e.x} y={e.y - 18} width={80} height={38} rx={5}
              fill={hovered === e.id ? '#0E1830' : '#0A1220'}
              stroke={hovered === e.id ? '#3A5A80' : '#1E2E48'}
              strokeWidth={0.8}
            />
            <text x={e.x + 40} y={e.y - 3} textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 9, fill: hovered === e.id ? '#C0D0E0' : '#8A9DB5' }}>
              {e.label}
            </text>
            <text x={e.x + 40} y={e.y + 11} textAnchor="middle"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#4A5568' }}>
              {e.sub}
            </text>
          </g>
        ))}

        {/* Output nodes — with tooltip */}
        {externals.filter(e => e.output).map(e => (
          <g key={e.id} className="diagram-node"
            onMouseEnter={() => { setHovered(e.id); showTooltip(OUTPUT_TOOLTIPS[e.id]); }}
            onMouseLeave={hideTooltip}
          >
            <rect x={e.x} y={e.y - 18} width={80} height={38} rx={5}
              fill={hovered === e.id ? '#15120A' : '#0A1220'}
              stroke={hovered === e.id ? '#5A4A10' : '#2A3010'}
              strokeWidth={0.8}
            />
            <text x={e.x + 40} y={e.y - 3} textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 9, fill: hovered === e.id ? '#E8C870' : '#D4A843' }}>
              {e.label}
            </text>
            <text x={e.x + 40} y={e.y + 11} textAnchor="middle"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 7.5, fill: '#6B5A20' }}>
              {e.sub}
            </text>
          </g>
        ))}

        {/* Column labels */}
        <text x={98}  y={72} textAnchor="middle" style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#4A5568', letterSpacing: '0.12em' }}>SOURCE SYSTEMS</text>
        <text x={cx}  y={72} textAnchor="middle" style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#4A5568', letterSpacing: '0.12em' }}>ANAPLAN LAYER</text>
        <text x={754} y={72} textAnchor="middle" style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#4A5568', letterSpacing: '0.12em' }}>OUTPUTS</text>

        {/* Legend */}
        <g transform="translate(210, 592)">
          <rect width={380} height={34} rx={6} fill="#0A1220" stroke="#1E2E48" strokeWidth={0.8} />
          <line x1={12} y1={17} x2={38} y2={17} stroke="#EE3D2C" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.8} />
          <text x={44} y={21} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#6B7D95' }}>Anaplan internal</text>
          <line x1={138} y1={17} x2={164} y2={17} stroke="#00C6BE" strokeWidth={1.8} strokeDasharray="5 4" opacity={0.8} />
          <text x={170} y={21} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#6B7D95' }}>Databricks integration</text>
          <line x1={295} y1={17} x2={318} y2={17} stroke="#4A5568" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
          <text x={323} y={21} style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#6B7D95' }}>Source systems</text>
        </g>
      </svg>

      {/* Unified tooltip — shown for any hovered node */}
      {tooltip && (
        <div style={{
          position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(10,15,28,0.97)',
          border: `1px solid ${tooltip.typeColor || '#EE3D2C'}`,
          borderRadius: 10, padding: '14px 20px', pointerEvents: 'none',
          minWidth: 260, maxWidth: 340,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${tooltip.typeColor}22`,
        }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: tooltip.typeColor, letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
            {tooltip.type}
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--db-white)', marginBottom: 8 }}>
            {tooltip.name}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', lineHeight: 1.6, marginBottom: 10 }}>
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
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted-2)', borderTop: '1px solid var(--db-border)', paddingTop: 8 }}>
              → {tooltip.keyOutput}
            </div>
          )}
          {tooltip.path && (
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: tooltip.typeColor, marginTop: 6 }}>
              Click to open full model →
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Spoke card ─────────────────────────────────────────────────────────────
function SpokeCard({ model, delay }) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[model.icon] || Database;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="card card-red"
      style={{ padding: '22px 24px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
      onClick={() => navigate(model.path)}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--db-red)', opacity: 0.5 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(238,61,44,0.12)', border: '1px solid rgba(238,61,44,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} color="var(--db-red)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--db-white)', marginBottom: 6 }}>{model.name}</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.5, marginBottom: 12 }}>{model.description}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="pill pill-teal">{model.modules} Modules</span>
            <span className="pill pill-gold">{model.lists} Lists</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-red)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              View <ArrowRight size={11} />
            </span>
          </div>
          <div style={{ marginTop: 8, fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted-2)', borderTop: '1px solid var(--db-border)', paddingTop: 8 }}>
            Output: {model.keyOutput}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Maturity level bar ─────────────────────────────────────────────────────
function MaturityBar({ level, max = 5, color }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          height: 6, flex: 1, borderRadius: 3,
          background: i < level ? color : 'var(--db-border)',
          transition: 'background 0.3s ease',
        }} />
      ))}
    </div>
  );
}

// ── Main Home ──────────────────────────────────────────────────────────────
export default function Home() {
  const MATURITY_DIMENSIONS = [
    {
      label: 'Data Automation',
      score: 4,
      color: '#00C6BE',
      description: 'Nightly automated ETL from 4 source systems via Databricks Workflows. Zero manual file uploads. SLA-monitored with Slack alerting.',
    },
    {
      label: 'Model Architecture',
      score: 5,
      color: '#EE3D2C',
      description: 'Full hub-and-spoke implementation with a dedicated Data Hub and 6 purpose-built spoke models. Clean separation of master data, drivers, and calculations.',
    },
    {
      label: 'Planning Coverage',
      score: 5,
      color: '#EE3D2C',
      description: 'End-to-end planning coverage: ARR, headcount, opex, cloud COGS, equity compensation, and sales operations all managed in connected models.',
    },
    {
      label: 'Governance & Access',
      score: 4,
      color: '#00C6BE',
      description: 'Unity Catalog enforces role-based access and PII masking. Anaplan model roles mirror data permissions. SOX-ready audit logging throughout.',
    },
    {
      label: 'Variance & Analytics',
      score: 4,
      color: '#00C6BE',
      description: 'Automated plan vs. actuals variance computed in Databricks SQL and surfaced via Looker and the CFO dashboard. Finance teams self-serve drill-through.',
    },
    {
      label: 'Scenario Capability',
      score: 3,
      color: '#D4A843',
      description: 'Three-scenario framework (Base / Upside / Downside) built into the hub. Scenario versioning and ALM-controlled model promotion in place.',
    },
  ];

  const ARCHITECTURE_PILLARS = [
    {
      icon: '🏛',
      title: 'Hub-and-Spoke Model',
      body: 'A central Data Hub owns all master data and shared assumptions. Six specialized spoke models connect to it for planning — preventing duplication and ensuring every department plans off the same numbers.',
    },
    {
      icon: '⚡',
      title: 'Automated Actuals Feed',
      body: 'Workday, NetSuite, Salesforce, and cloud cost data flow into Delta Lake every night via Databricks Workflows. Anaplan pulls actuals automatically — no analyst time spent on manual uploads.',
    },
    {
      icon: '🔍',
      title: 'Driver-Based Planning',
      body: 'Every major cost category is built on business drivers, not static line items. Headcount drives compensation costs. DBU consumption drives cloud COGS. ARR drivers cascade from bookings through renewal and expansion.',
    },
    {
      icon: '🛡',
      title: 'Governed Data Layer',
      body: 'Unity Catalog provides centralized access control and PII masking across the entire finance data estate. All data access is audited, and permissions are enforced consistently from Delta Lake through to Anaplan.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: 72 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 14px', background: 'rgba(238,61,44,0.1)', border: '1px solid rgba(238,61,44,0.2)', borderRadius: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--db-red)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-red)', letterSpacing: '0.08em' }}>ANAPLAN HUB-AND-SPOKE ARCHITECTURE</span>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)', color: 'var(--db-white)', lineHeight: 1.0, marginBottom: 0 }}>
            Databricks FP&A
          </h1>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.0, marginBottom: 24 }}>
            <em style={{ color: 'var(--db-red)', fontStyle: 'italic' }}>System Architecture</em>
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, color: 'var(--db-muted)', lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
            A reference architecture for a complete, production-grade connected planning system built on{' '}
            <strong style={{ color: 'var(--db-white)' }}>Anaplan</strong> — integrated with the{' '}
            <strong style={{ color: '#00C6BE' }}>Databricks Data Intelligence Platform</strong> for automated data flows, governed actuals, and real-time variance analytics.
          </p>
        </motion.div>
      </div>

      {/* ── Architecture Summary ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 64 }}>
        <div className="section-heading" style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--db-white)', margin: 0 }}>What This Architecture Represents</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--db-muted)', marginTop: 6 }}>
            The four foundational pillars of this design
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {ARCHITECTURE_PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="card"
              style={{ padding: '22px 24px' }}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--db-white)', marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', lineHeight: 1.65 }}>{p.body}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Maturity Assessment ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="card" style={{ padding: '32px 32px', marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-teal)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Architecture Assessment</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--db-white)', margin: 0 }}>Planning Maturity Model</h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--db-muted)', marginTop: 6, maxWidth: 480 }}>
              This architecture represents a <strong style={{ color: 'var(--db-white)' }}>Level 4 — Advanced Connected Planning</strong> implementation. It exceeds typical Anaplan deployments by layering in a fully automated data engineering stack.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 42, color: 'var(--db-teal)', lineHeight: 1 }}>4.2</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', marginTop: 4 }}>out of 5.0</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--db-teal)', marginTop: 6, fontWeight: 500 }}>Advanced</div>
          </div>
        </div>

        {/* Level scale */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--db-border)' }}>
          {[
            { n: 1, label: 'Spreadsheet', color: '#3A4A5A' },
            { n: 2, label: 'Single Model', color: '#4A5A6A' },
            { n: 3, label: 'Multi-Model', color: '#D4A843' },
            { n: 4, label: 'Connected', color: '#00C6BE', active: true },
            { n: 5, label: 'Autonomous', color: '#6B7D95' },
          ].map((lvl, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 8px', textAlign: 'center',
              background: lvl.active ? `${lvl.color}22` : 'transparent',
              borderRight: i < 4 ? '1px solid var(--db-border)' : 'none',
              borderBottom: lvl.active ? `2px solid ${lvl.color}` : '2px solid transparent',
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 11, color: lvl.active ? lvl.color : 'var(--db-muted)' }}>L{lvl.n}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: lvl.active ? lvl.color : '#3A4A5A', marginTop: 2 }}>{lvl.label}</div>
            </div>
          ))}
        </div>

        {/* Dimension bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {MATURITY_DIMENSIONS.map((d, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 13, color: 'var(--db-white)' }}>{d.label}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: d.color }}>{d.score}/5</span>
              </div>
              <MaturityBar level={d.score} color={d.color} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--db-muted)', lineHeight: 1.55, marginTop: 7, marginBottom: 0 }}>
                {d.description}
              </p>
            </div>
          ))}
        </div>

        {/* What makes this L4 not L5 */}
        <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--db-navy-2)', borderRadius: 8, border: '1px solid var(--db-border)' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-gold)', letterSpacing: '0.08em', marginBottom: 10 }}>
            WHAT WOULD REACH LEVEL 5 — AUTONOMOUS PLANNING
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              'ML-driven demand forecasting integrated into Topline model',
              'Automated what-if scenario generation from macroeconomic signals',
              'Continuous planning with rolling 18-month horizon updates',
              'Natural language querying of plan vs. actuals via AI assistant',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 220, flex: 1 }}>
                <Circle size={12} color="var(--db-gold)" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--db-muted)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── System Landscape ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 64 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-heading" style={{ display: 'inline-block', textAlign: 'left' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--db-white)', margin: 0 }}>System Landscape Diagram</h2>
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--db-muted)', marginTop: 8 }}>
            Hover any node for a plain-language description. Click a spoke to open its full model. Teal ring = Databricks Platform integration layer.
          </p>
        </div>
        <div className="card" style={{ padding: '32px 16px 48px', position: 'relative' }}>
          <LandscapeDiagram />
        </div>
      </motion.div>

      {/* ── Integration Architecture ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 64 }}>
        <div className="section-heading" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--db-white)', margin: 0 }}>Integration Architecture</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              title: 'Source Systems', color: 'var(--db-muted)',
              items: [
                { label: 'Workday', sub: 'Org, Positions, Compensation' },
                { label: 'NetSuite', sub: 'Cost Centers, Entities, GL Actuals' },
                { label: 'Salesforce', sub: 'Bookings, Pipeline, Customer Data' },
                { label: 'AWS / GCP', sub: 'Cloud COGS by Product & Region' },
                { label: 'Carta', sub: 'Cap Table, Grant Data, Vesting' },
              ]
            },
            {
              title: 'Databricks Platform', color: 'var(--db-teal)',
              items: [
                { label: 'Databricks Workflows', sub: 'ETL orchestration & scheduling' },
                { label: 'Delta Lake', sub: 'Finance schema (actuals + plan)' },
                { label: 'Unity Catalog', sub: 'Access governance & PII masking' },
                { label: 'Databricks SQL', sub: 'Variance analytics & BI queries' },
              ]
            },
            {
              title: 'Anaplan + Outputs', color: 'var(--db-red)',
              items: [
                { label: 'Data Hub Model', sub: 'Master Data, Org Hierarchy, Drivers' },
                { label: 'Topline → Sales Ops (×6)', sub: 'Spoke planning models' },
                { label: 'Looker', sub: 'Business intelligence dashboards' },
                { label: 'CFO Board Dashboard', sub: 'Board-ready financial package' },
                { label: 'Scenario Models', sub: 'Base / Upside / Downside' },
              ]
            }
          ].map((col, ci) => (
            <div key={ci} className="card" style={{ padding: 20 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: col.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, borderBottom: `1px solid ${col.color}22`, paddingBottom: 10 }}>
                {col.title}
              </div>
              {col.items.map((item, ii) => (
                <div key={ii} style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10, paddingBottom: 10, borderBottom: ii < col.items.length - 1 ? '1px solid var(--db-border)' : 'none' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 13, color: 'var(--db-white)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)' }}>{item.sub}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Spoke Model Cards ── */}
      <div>
        <div className="section-heading" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--db-white)', margin: 0 }}>Spoke Models</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--db-muted)', marginTop: 6 }}>Six specialized planning models connected to the central hub.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {SPOKE_MODELS.map((m, i) => (
            <SpokeCard key={m.id} model={m} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
