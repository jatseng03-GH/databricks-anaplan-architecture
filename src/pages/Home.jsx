import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Server, Percent, BadgeDollarSign, Receipt, Database, ArrowRight, CheckCircle, Circle, Layers, Sparkles } from 'lucide-react';
import { SPOKE_MODELS } from '../data/models';
import L5LandscapeDiagram from '../components/L5Landscape';

const ICON_MAP = { TrendingUp, Users, Server, Percent, BadgeDollarSign, Receipt };

// ── Tooltip data for every node in the diagram ─────────────────────────────

const HUB_TOOLTIP = {
  name: 'Anaplan Data Hub',
  type: 'Hub Model',
  typeColor: '#EE3D2C',
  description:
    'The central model that owns all shared master data — org hierarchy, cost centers, employee lists, and planning drivers. Every spoke model pulls its foundation from here. Governed by Anaplan\'s native RBAC (model roles, selective access on lists), ALM for Dev/Test/Prod promotion, and its own audit log — independent of Unity Catalog.',
  details: ['8 Modules', '9 Lists', 'RBAC · ALM · Audit'],
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
      'Governs the Databricks side only — controls who can query which Delta Lake tables, masks PII columns (e.g. salary data), applies row-level filters by cost center, and tags data classifications. Not connected to Anaplan; access policies are aligned through a quarterly IT governance review.',
    details: ['Table-level grants', 'PII column masking', 'Row-level filters', 'Audit log'],
    keyOutput: 'Compliant, auditable access control for the Databricks finance data estate',
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
      'Notifications sent to the #fp-and-a-systems Slack channel via a webhook task at the end of each Databricks Workflow run. A Python notebook calls the Slack Incoming Webhooks API with pipeline status, anomaly flags, and load confirmation. Not a native Databricks integration — it\'s a custom script bridge.',
    details: ['Webhook via Python task', 'Incoming Webhooks API', '#fp-and-a-systems'],
    keyOutput: 'Proactive pipeline status alerts for the finance team',
  },
  nux: {
    name: 'Anaplan NUX Dashboards',
    type: 'Anaplan Output',
    typeColor: '#EE3D2C',
    description:
      'Native Anaplan planning dashboards built in New UX. Used by FP&A business partners for scenario modeling, driver-based forecasting, and plan submission. Controlled by Anaplan\'s own role-based access and page visibility settings.',
    details: ['Planning views', 'Scenario modeling', 'Role-based visibility'],
    keyOutput: 'Interactive planning interface for finance business partners',
  },
};

// ── System Landscape Diagram ───────────────────────────────────────────────
function LandscapeDiagram() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const cx = 400, cy = 290;
  const r_spoke = 145;

  const spokePositions = SPOKE_MODELS.map(m => {
    const rad = (m.angle - 90) * Math.PI / 180;
    return { ...m, x: cx + r_spoke * Math.cos(rad), y: cy + r_spoke * Math.sin(rad) };
  });

  // DB platform: positioned explicitly for clean pipeline flow
  const dbNodes = [
    { id: 'workflows',  label: 'DB Workflows',   sub: 'Orchestration', x: 148, y: 290 },
    { id: 'delta-lake', label: 'Delta Lake',      sub: 'Finance Schema', x: 148, y: 178 },
    { id: 'unity',      label: 'Unity Catalog',   sub: 'Governance',    x: 148, y: 118 },
    { id: 'dbsql-node', label: 'Databricks SQL',  sub: 'Analytics',     x: 610, y: 178 },
  ];

  // Source systems as a grouped container
  const sources = [
    { id: 'workday', label: 'Workday HRIS' },
    { id: 'netsuite', label: 'NetSuite ERP' },
    { id: 'salesforce', label: 'Salesforce CRM' },
    { id: 'aws-cost', label: 'AWS / GCP Cost' },
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

  // Find node helpers
  const wf = dbNodes.find(d => d.id === 'workflows');
  const dl = dbNodes.find(d => d.id === 'delta-lake');
  const uc = dbNodes.find(d => d.id === 'unity');
  const sql = dbNodes.find(d => d.id === 'dbsql-node');

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <style>{`
        @keyframes flowPulse { to { stroke-dashoffset: -20; } }
        .flow-anim { animation: flowPulse 1.8s linear infinite; }
        @keyframes flowReverse { to { stroke-dashoffset: 20; } }
        .flow-rev { animation: flowReverse 1.8s linear infinite; }
        .diagram-node { cursor: pointer; }
        .diagram-node:hover rect, .diagram-node:hover polygon { filter: brightness(1.25); }
      `}</style>

      <svg width="800" height="600" viewBox="0 0 800 600" style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <radialGradient id="hubGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EE3D2C" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#EE3D2C" stopOpacity="0" />
          </radialGradient>
          <marker id="arrowTeal2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#00C6BE" opacity="0.8" />
          </marker>
          <marker id="arrowTealRev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
            <path d="M6,0 L6,6 L0,3 z" fill="#00C6BE" opacity="0.8" />
          </marker>
          <marker id="arrowGrey" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="#4A5568" opacity="0.7" />
          </marker>
          <marker id="arrowGold2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#D4A843" opacity="0.7" />
          </marker>
          <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#EE3D2C" opacity="0.7" />
          </marker>
          <marker id="arrowMuted" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="#8A9DB5" opacity="0.5" />
          </marker>
        </defs>

        {/* ─── Hub glow ─── */}
        <circle cx={cx} cy={cy} r={100} fill="url(#hubGrad2)" />

        {/* ─── Spoke connection lines (subtle, lowest visual layer) ─── */}
        {spokePositions.map(s => {
          const isHov = hovered === s.id;
          return (
            <line key={`spoke-line-${s.id}`}
              x1={cx} y1={cy} x2={s.x} y2={s.y}
              stroke={isHov ? '#EE3D2C' : '#1E2E48'}
              strokeWidth={isHov ? 1.5 : 0.8}
              strokeDasharray="4 5"
              opacity={isHov ? 0.9 : 0.4}
            />
          );
        })}

        {/* ─── DATA PIPELINE: Source → Workflows → Delta Lake ↔ Hub ─── */}

        {/* Source container → DB Workflows (single arrow) */}
        <line x1={70} y1={290} x2={wf.x - 46} y2={wf.y}
          stroke="#4A5568" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.5}
          markerEnd="url(#arrowGrey)" className="flow-anim" />

        {/* DB Workflows → Delta Lake */}
        <line x1={wf.x} y1={wf.y - 22} x2={dl.x} y2={dl.y + 20}
          stroke="#00C6BE" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.55}
          markerEnd="url(#arrowTeal2)" className="flow-anim" />

        {/* Unity Catalog → Delta Lake (governance, subtle) */}
        <line x1={uc.x + 20} y1={uc.y + 16} x2={dl.x + 20} y2={dl.y - 16}
          stroke="#8A9DB5" strokeWidth={0.8} strokeDasharray="3 4" opacity={0.35}
          markerEnd="url(#arrowMuted)" />

        {/* Delta Lake → CloudWorks (landing zone handoff) */}
        {(() => {
          const cwx = 262, cwy = 222;
          const l1 = shortenLine(dl.x + 42, dl.y + 8, cwx - 28, cwy, 0, 0);
          const l2 = shortenLine(cwx + 28, cwy, cx - 56, cy - 28, 0, 0);
          return (
            <g>
              {/* DL → CloudWorks */}
              <line x1={l1.x1} y1={l1.y1} x2={l1.x2} y2={l1.y2}
                stroke="#00C6BE" strokeWidth={1.5} strokeDasharray="6 5" opacity={0.5}
                className="flow-anim" markerEnd="url(#arrowTeal2)" />
              {/* CloudWorks → Hub (forward) */}
              <line x1={l2.x1} y1={l2.y1} x2={l2.x2} y2={l2.y2}
                stroke="#00C6BE" strokeWidth={1.5} strokeDasharray="6 5" opacity={0.5}
                className="flow-anim" markerEnd="url(#arrowTeal2)" />
              {/* Hub → CloudWorks (reverse, for plan export) */}
              <line x1={l2.x1} y1={l2.y1} x2={l2.x2} y2={l2.y2}
                stroke="#00C6BE" strokeWidth={1.5} strokeDasharray="6 5" strokeDashoffset={10} opacity={0.2}
                className="flow-rev" markerStart="url(#arrowTealRev)" />
              {/* CloudWorks → DL (reverse, for plan export) */}
              <line x1={l1.x1} y1={l1.y1} x2={l1.x2} y2={l1.y2}
                stroke="#00C6BE" strokeWidth={1.5} strokeDasharray="6 5" strokeDashoffset={10} opacity={0.2}
                className="flow-rev" markerStart="url(#arrowTealRev)" />
              {/* CloudWorks node */}
              <g className="diagram-node"
                onMouseEnter={() => { setHovered('cloudworks'); showTooltip({
                  name: 'Anaplan CloudWorks',
                  type: 'Integration Layer',
                  typeColor: '#00C6BE',
                  description: 'Anaplan\'s native integration platform. Reads actuals from the ADLS/S3 landing zone and triggers Anaplan imports automatically. For plan exports, pushes flat files back to the landing zone for Autoloader pickup. Handles retry logic, scheduling, and monitoring natively — no custom API code required.',
                  details: ['ADLS / S3 connector', 'Scheduled + event-driven', 'Native retry & monitoring'],
                  keyOutput: 'Zero-code bidirectional data bridge between Delta Lake and Anaplan',
                }); }}
                onMouseLeave={hideTooltip}
              >
                <rect x={cwx - 28} y={cwy - 14} width={56} height={28} rx={14}
                  fill={hovered === 'cloudworks' ? '#0F2A2A' : '#071A1A'}
                  stroke={hovered === 'cloudworks' ? '#00C6BE' : '#0E3A3A'}
                  strokeWidth={hovered === 'cloudworks' ? 1.5 : 0.8} />
                <text x={cwx} y={cwy + 1} textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: '#00C6BE', letterSpacing: '0.03em' }}>
                  CloudWorks
                </text>
              </g>
            </g>
          );
        })()}

        {/* Delta Lake → Databricks SQL */}
        <line x1={dl.x + 46} y1={dl.y} x2={sql.x - 46} y2={sql.y}
          stroke="#00C6BE" strokeWidth={1.2} strokeDasharray="5 5" opacity={0.4}
          markerEnd="url(#arrowTeal2)" className="flow-anim" />

        {/* ─── OUTPUTS ─── */}

        {/* Databricks SQL → Analytics Outputs */}
        <line x1={sql.x + 46} y1={sql.y} x2={710} y2={178}
          stroke="#D4A843" strokeWidth={1} strokeDasharray="4 4" opacity={0.4}
          markerEnd="url(#arrowGold2)" />

        {/* Hub → NUX Dashboards */}
        <line x1={cx + 55} y1={cy + 20} x2={710} y2={340}
          stroke="#EE3D2C" strokeWidth={1} strokeDasharray="4 4" opacity={0.35}
          markerEnd="url(#arrowRed)" />

        {/* Workflows → Slack (webhook, very subtle) */}
        <line x1={wf.x} y1={wf.y + 22} x2={wf.x} y2={wf.y + 48}
          stroke="#4A5568" strokeWidth={0.8} strokeDasharray="2 3" opacity={0.3}
          markerEnd="url(#arrowGrey)" />

        {/* ─── NODES: Source Systems (grouped container) ─── */}
        <g className="diagram-node">
          <rect x={12} y={208} width={58} height={164} rx={6}
            fill="#0A1220" stroke="#1E2E48" strokeWidth={0.8} />
          <text x={41} y={226} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568', letterSpacing: '0.08em' }}>
            SOURCES
          </text>
          {sources.map((s, i) => (
            <g key={s.id}
              onMouseEnter={() => { setHovered(s.id); showTooltip(SOURCE_TOOLTIPS[s.id]); }}
              onMouseLeave={hideTooltip}
            >
              <rect x={18} y={236 + i * 32} width={46} height={24} rx={4}
                fill={hovered === s.id ? '#0E1830' : '#070E1A'}
                stroke={hovered === s.id ? '#3A5A80' : '#162030'}
                strokeWidth={0.6} />
              <text x={41} y={251 + i * 32} textAnchor="middle"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 7, fill: hovered === s.id ? '#C0D0E0' : '#6B7D95' }}>
                {s.label.split(' ')[0]}
              </text>
            </g>
          ))}
        </g>

        {/* ─── NODES: Databricks Platform ─── */}
        {dbNodes.map(db => {
          const isHov = hovered === db.id;
          return (
            <g key={db.id} className="diagram-node"
              onMouseEnter={() => { setHovered(db.id); showTooltip(DB_PLATFORM_TOOLTIPS[db.id]); }}
              onMouseLeave={hideTooltip}
              transform={`translate(${db.x - 42},${db.y - 18})`}
            >
              <rect width={84} height={36} rx={6}
                fill={isHov ? '#0F2A2A' : '#071A1A'}
                stroke={isHov ? '#00C6BE' : '#0E3A3A'}
                strokeWidth={isHov ? 1.5 : 0.8}
              />
              <text x={42} y={14} textAnchor="middle"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 8.5, fill: '#00C6BE' }}>
                {db.label}
              </text>
              <text x={42} y={26} textAnchor="middle"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A7A78' }}>
                {db.sub}
              </text>
            </g>
          );
        })}

        {/* Slack webhook label under Workflows */}
        <g className="diagram-node"
          onMouseEnter={() => { setHovered('slack'); showTooltip(OUTPUT_TOOLTIPS['slack']); }}
          onMouseLeave={hideTooltip}
        >
          <rect x={wf.x - 30} y={wf.y + 50} width={60} height={20} rx={4}
            fill={hovered === 'slack' ? '#0E1830' : '#070E1A'}
            stroke={hovered === 'slack' ? '#3A5A80' : '#162030'} strokeWidth={0.6} />
          <text x={wf.x} y={wf.y + 63} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: '#4A5568' }}>
            Slack webhook
          </text>
        </g>

        {/* ─── NODES: Spoke models (inner ring) ─── */}
        {spokePositions.map(s => {
          const isHov = hovered === s.id;
          return (
            <g key={s.id} className="diagram-node"
              onMouseEnter={() => { setHovered(s.id); showTooltip({ ...s, type: 'Spoke Model', typeColor: '#EE3D2C', details: [`${s.modules} Modules`, `${s.lists} Lists`] }); }}
              onMouseLeave={hideTooltip}
              onClick={() => navigate(s.path)}
              transform={`translate(${s.x - 48},${s.y - 22})`}
            >
              <rect width={96} height={44} rx={6}
                fill={isHov ? '#1A0F0F' : '#0F1828'}
                stroke={isHov ? '#EE3D2C' : '#1E2E48'}
                strokeWidth={isHov ? 1.2 : 0.8}
              />
              <text x={48} y={15} textAnchor="middle"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 8.5, fill: isHov ? '#F5F1EB' : '#8A9DB5' }}>
                {s.name.split(' ').slice(0, 2).join(' ')}
              </text>
              <text x={48} y={26} textAnchor="middle"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 8.5, fill: isHov ? '#F5F1EB' : '#8A9DB5' }}>
                {s.name.split(' ').slice(2).join(' ')}
              </text>
              <text x={48} y={38} textAnchor="middle"
                style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#6B7D95' }}>
                {s.modules}M · {s.lists}L
              </text>
            </g>
          );
        })}

        {/* ─── Hub hexagon ─── */}
        {[0, 1].map(i => (
          <polygon key={`hex-${i}`}
            points={[0,1,2,3,4,5].map(j => {
              const a = (j * 60 - 30) * Math.PI / 180;
              const radius = i === 0 ? 62 : 52;
              return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
            }).join(' ')}
            fill={i === 0 ? 'rgba(238,61,44,0.12)' : '#0F1828'}
            stroke={i === 0 ? 'rgba(238,61,44,0.45)' : 'rgba(238,61,44,0.2)'}
            strokeWidth={i === 0 ? 1.2 : 0.8}
          />
        ))}
        <g className="diagram-node"
          onMouseEnter={() => { setHovered('hub'); showTooltip(HUB_TOOLTIP); }}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        >
          <circle cx={cx} cy={cy} r={54} fill="transparent" />
          <text x={cx} y={cy - 12} textAnchor="middle"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: '#F5F1EB' }}>Anaplan</text>
          <text x={cx} y={cy + 2} textAnchor="middle"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 10, fill: '#F5F1EB' }}>Data Hub</text>
          <text x={cx} y={cy + 16} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#6B7D95' }}>Master Data · Drivers</text>
          <rect x={cx - 32} y={cy + 22} width={64} height={13} rx={3}
            fill="rgba(238,61,44,0.1)" stroke="rgba(238,61,44,0.25)" strokeWidth={0.5} />
          <text x={cx} y={cy + 30} textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 5.5, fill: '#EE3D2C', opacity: 0.6, letterSpacing: '0.04em' }}>
            RBAC · ALM · Audit
          </text>
        </g>

        {/* ─── NODES: Output containers ─── */}

        {/* Analytics outputs (from DB SQL) */}
        <g>
          <rect x={710} y={140} width={78} height={78} rx={6}
            fill="#0A1220" stroke="#2A3010" strokeWidth={0.8} />
          <text x={749} y={157} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: '#D4A843', letterSpacing: '0.06em' }}>
            ANALYTICS
          </text>
          {[{ id: 'looker', label: 'Looker' }, { id: 'cfodash', label: 'CFO Board' }].map((o, i) => (
            <g key={o.id}
              onMouseEnter={() => { setHovered(o.id); showTooltip(OUTPUT_TOOLTIPS[o.id]); }}
              onMouseLeave={hideTooltip}
            >
              <rect x={716} y={164 + i * 26} width={66} height={20} rx={4}
                fill={hovered === o.id ? '#15120A' : '#070E1A'}
                stroke={hovered === o.id ? '#5A4A10' : '#1A2010'}
                strokeWidth={0.6} />
              <text x={749} y={177 + i * 26} textAnchor="middle"
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, fill: hovered === o.id ? '#E8C870' : '#D4A843' }}>
                {o.label}
              </text>
            </g>
          ))}
        </g>

        {/* Anaplan outputs (from Hub) */}
        <g>
          <rect x={710} y={310} width={78} height={56} rx={6}
            fill="#0A1220" stroke="#2A1A1A" strokeWidth={0.8} />
          <text x={749} y={327} textAnchor="middle"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: '#EE3D2C', letterSpacing: '0.06em' }}>
            PLANNING
          </text>
          <g
            onMouseEnter={() => { setHovered('nux'); showTooltip(OUTPUT_TOOLTIPS['nux']); }}
            onMouseLeave={hideTooltip}
          >
            <rect x={716} y={334} width={66} height={24} rx={4}
              fill={hovered === 'nux' ? '#1A0F0F' : '#070E1A'}
              stroke={hovered === 'nux' ? '#EE3D2C' : '#1A1010'}
              strokeWidth={0.6} />
            <text x={749} y={344} textAnchor="middle"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 7.5, fill: hovered === 'nux' ? '#F5F1EB' : '#EE3D2C' }}>
              NUX Dashboards
            </text>
            <text x={749} y={354} textAnchor="middle"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 6, fill: '#6B3A30' }}>
              Planning Views
            </text>
          </g>
        </g>

        {/* ─── Column labels ─── */}
        <text x={41} y={196} textAnchor="middle"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568', letterSpacing: '0.08em' }}>
        </text>
        <text x={cx} y={56} textAnchor="middle"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, fill: '#3A4A60', letterSpacing: '0.12em' }}>
          ANAPLAN HUB-AND-SPOKE
        </text>

        {/* ─── Legend (compact) ─── */}
        <g transform="translate(220, 556)">
          <rect width={360} height={28} rx={5} fill="#0A1220" stroke="#1E2E48" strokeWidth={0.6} />
          <line x1={12} y1={14} x2={30} y2={14} stroke="#4A5568" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
          <text x={36} y={18} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Source</text>
          <line x1={72} y1={14} x2={90} y2={14} stroke="#00C6BE" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.7} />
          <text x={96} y={18} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Databricks</text>
          <line x1={152} y1={14} x2={170} y2={14} stroke="#EE3D2C" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
          <text x={176} y={18} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Anaplan</text>
          <line x1={218} y1={14} x2={236} y2={14} stroke="#D4A843" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
          <text x={242} y={18} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Analytics</text>
          <line x1={286} y1={14} x2={304} y2={14} stroke="#8A9DB5" strokeWidth={0.8} strokeDasharray="3 4" opacity={0.5} />
          <text x={310} y={18} style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, fill: '#4A5568' }}>Governance</text>
        </g>
      </svg>

      {/* Unified tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute', bottom: 42, left: '50%', transform: 'translateX(-50%)',
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

// ── System Landscape Tabbed (L4 / L5) ────────────────────────────────────
function LandscapeTabbed() {
  const [landscapeTab, setLandscapeTab] = useState('l4');

  const TABS = [
    { id: 'l4', label: 'L4 Integrated', sublabel: 'Current State', color: '#00C6BE', icon: Layers },
    { id: 'l5', label: 'L5 Autonomous', sublabel: 'Target State', color: '#D4A843', icon: Sparkles },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 64 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="section-heading" style={{ display: 'inline-block', textAlign: 'left' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--db-white)', margin: 0 }}>System Landscape Diagram</h2>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'var(--db-muted)', marginTop: 8 }}>
          {landscapeTab === 'l4'
            ? 'Hover any node for a plain-language description. Click a spoke to open its full model. Teal ring = Databricks Platform integration layer.'
            : 'L5 autonomous layer adds the Databricks Intelligence Engine, Anaplan AI co-pilots, and self-driving action outputs. Hover any node for details.'
          }
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 16, maxWidth: 480, margin: '0 auto 16px',
        padding: 3, background: 'var(--db-navy-2)', borderRadius: 8,
        border: '1px solid var(--db-border)',
      }}>
        {TABS.map((tab) => {
          const isActive = landscapeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setLandscapeTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 6,
                border: isActive ? `1px solid ${tab.color}40` : '1px solid transparent',
                background: isActive ? `${tab.color}12` : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <TabIcon size={14} color={isActive ? tab.color : 'var(--db-muted)'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12,
                  color: isActive ? tab.color : 'var(--db-muted)',
                  letterSpacing: '0.04em',
                }}>
                  {tab.label}
                </div>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: 'var(--db-muted)', opacity: isActive ? 0.8 : 0.5,
                }}>
                  {tab.sublabel}
                </div>
              </div>
              {isActive && (
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: tab.color,
                  boxShadow: `0 0 6px ${tab.color}60`,
                }} />
              )}
            </button>
          );
        })}
      </div>

      <div className="card" style={{ padding: '32px 16px 48px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {landscapeTab === 'l4' ? (
            <motion.div
              key="l4-landscape"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <LandscapeDiagram />
            </motion.div>
          ) : (
            <motion.div
              key="l5-landscape"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <L5LandscapeDiagram />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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

      {/* ── System Landscape (Tabbed: L4 / L5) ── */}
      <LandscapeTabbed />

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
