// ─── L5 AUTONOMOUS FP&A ARCHITECTURE ─────────────────────────────────────────
// Full Databricks AI stack + Anaplan co-pilot capabilities

export const L5_LAYERS = [
  {
    id: 'action',
    label: 'AUTONOMOUS ACTION',
    sublabel: 'Self-Driving Outcomes',
    color: '#D4A843',
    bgGrad: 'linear-gradient(135deg, rgba(212,168,67,0.10) 0%, rgba(212,168,67,0.03) 100%)',
    borderColor: 'rgba(212,168,67,0.30)',
    description: 'Closed-loop planning actions that execute without human intervention — from auto-generated board narratives to self-correcting forecast adjustments that fire when drift exceeds tolerance thresholds.',
    nodes: [
      { id: 'auto-replan', name: 'Auto-Reforecast', desc: 'Triggers Anaplan replan cycle when ML detects >5% drift from prior forecast. CloudWorks pushes updated drivers; spoke models recalculate automatically.', platform: 'both', icon: 'refresh' },
      { id: 'narrative-gen', name: 'AI Narrative Generation', desc: 'Mosaic AI generates CFO-ready variance commentary — plain-English explanations of plan vs. actuals gaps, root causes, and recommended actions.', platform: 'databricks', icon: 'file-text' },
      { id: 'slack-alerts', name: 'Contextual Alerts', desc: 'Intelligent Slack/Teams notifications with AI-generated context: "Cloud COGS +12% vs. plan driven by 23% DBU spike in EMEA — recommend reviewing Infrastructure spoke."', platform: 'databricks', icon: 'bell' },
      { id: 'board-deck', name: 'Board Deck Auto-Population', desc: 'Quarterly board package auto-generated from variance_bridge + ML insights. Slides, charts, and commentary produced without manual Excel work.', platform: 'databricks', icon: 'presentation' },
    ],
  },
  {
    id: 'copilot',
    label: 'PLANNING CO-PILOTS',
    sublabel: 'Human-in-the-Loop AI',
    color: '#EE3D2C',
    bgGrad: 'linear-gradient(135deg, rgba(238,61,44,0.08) 0%, rgba(238,61,44,0.02) 100%)',
    borderColor: 'rgba(238,61,44,0.25)',
    description: 'Dual-platform AI assistants that augment FP&A analysts — Anaplan PlanIQ for native ML forecasting inside planning models, Databricks AI/BI Genie for natural language analytics, and compound AI agents that orchestrate multi-step planning workflows.',
    nodes: [
      { id: 'planiq', name: 'Anaplan PlanIQ', desc: 'Native ML forecasting inside Anaplan models. Generates statistical forecasts (ARIMA, ETS, Prophet) directly in spoke modules. FP&A analysts compare ML vs. judgment-based forecasts side-by-side.', platform: 'anaplan', icon: 'brain' },
      { id: 'optimizer', name: 'Anaplan Optimizer', desc: 'Constraint-based optimization for headcount allocation, territory planning, and budget distribution. Solves for maximum revenue coverage within approved HC envelope.', platform: 'anaplan', icon: 'target' },
      { id: 'ai-assist', name: 'Anaplan AI Assist', desc: 'Natural language formula generation and model-building copilot. Analysts describe business logic in English; AI Assist generates DCA formulas and module structures.', platform: 'anaplan', icon: 'message-square' },
      { id: 'genie', name: 'AI/BI Genie', desc: 'Natural language interface to the finance data estate. VP of FP&A asks "What drove the Q3 EMEA variance?" and Genie queries variance_bridge, generates visualizations, and explains root causes.', platform: 'databricks', icon: 'sparkles' },
      { id: 'agents', name: 'Databricks AI Agents', desc: 'Compound AI systems that chain multiple tools: pull actuals → run anomaly detection → draft variance commentary → post to Slack → trigger Anaplan replan if needed. Orchestrated via Mosaic AI Agent Framework.', platform: 'databricks', icon: 'bot' },
    ],
  },
  {
    id: 'intelligence',
    label: 'INTELLIGENCE ENGINE',
    sublabel: 'ML Models & Feature Engineering',
    color: '#00C6BE',
    bgGrad: 'linear-gradient(135deg, rgba(0,198,190,0.08) 0%, rgba(0,198,190,0.02) 100%)',
    borderColor: 'rgba(0,198,190,0.25)',
    description: 'The ML backbone — Mosaic AI trains and serves forecasting models, MLflow tracks every experiment, Feature Store manages planning-specific features, and Model Serving provides real-time inference endpoints for anomaly detection and driver prediction.',
    nodes: [
      { id: 'mosaic', name: 'Mosaic AI', desc: 'Foundation model training and fine-tuning for finance-specific tasks: revenue forecasting, cloud cost prediction, headcount attrition modeling, and variance explanation generation.', platform: 'databricks', icon: 'cpu' },
      { id: 'mlflow', name: 'MLflow', desc: 'Experiment tracking and model registry. Every forecast model version is tracked with parameters, metrics (MAPE, RMSE), and lineage back to training data in Delta Lake.', platform: 'databricks', icon: 'git-branch' },
      { id: 'feature-store', name: 'Feature Store', desc: 'Planning-specific feature tables: trailing-12-month actuals, seasonal indices, macro indicators, hiring velocity, cloud consumption trends. Shared across all ML models.', platform: 'databricks', icon: 'database' },
      { id: 'model-serving', name: 'Model Serving', desc: 'Real-time inference endpoints for anomaly detection (flags GL entries >3σ from historical pattern) and on-demand forecast generation via REST API.', platform: 'databricks', icon: 'server' },
      { id: 'vector-search', name: 'Vector Search', desc: 'Semantic search over finance documents — board decks, variance memos, audit findings. Agents use RAG to ground narrative generation in historical context.', platform: 'databricks', icon: 'search' },
    ],
  },
  {
    id: 'foundation',
    label: 'DATA FOUNDATION',
    sublabel: 'Lakehouse + Planning Platform',
    color: '#8A9DB5',
    bgGrad: 'linear-gradient(135deg, rgba(138,157,181,0.06) 0%, rgba(138,157,181,0.02) 100%)',
    borderColor: 'rgba(138,157,181,0.20)',
    description: 'The shared data substrate — Delta Lake stores all actuals and plan exports, Unity Catalog governs access and lineage, Anaplan Data Hub owns master data and planning dimensions. Both platforms maintain independent governance with quarterly alignment.',
    nodes: [
      { id: 'delta', name: 'Delta Lake', desc: 'Versioned, ACID-compliant finance tables. Time travel enables point-in-time variance analysis. Change Data Feed powers incremental ML feature refresh.', platform: 'databricks', icon: 'layers' },
      { id: 'unity', name: 'Unity Catalog', desc: 'Centralized governance: table grants, column masking (PII), row-level security, data lineage tracking, and AI asset registration (models, endpoints, features).', platform: 'databricks', icon: 'shield' },
      { id: 'hub', name: 'Anaplan Data Hub', desc: 'Master planning dimensions — org hierarchy, cost centers, time periods, global assumptions. Single source of truth for all spoke models. RBAC + ALM governance.', platform: 'anaplan', icon: 'hexagon' },
      { id: 'cloudworks', name: 'Anaplan CloudWorks', desc: 'Native integration engine handling bidirectional data flow between Delta Lake (via ADLS Gen2) and Anaplan models. Event-driven or scheduled execution.', platform: 'anaplan', icon: 'cloud' },
    ],
  },
];

// ─── L5 USE CASES ────────────────────────────────────────────────────────────
export const L5_USE_CASES = [
  {
    id: 'revenue-forecast',
    title: 'ML-Augmented Revenue Forecasting',
    category: 'Topline',
    status: 'Production',
    statusColor: '#00C6BE',
    databricksComponents: ['Mosaic AI', 'Feature Store', 'MLflow'],
    anaplanComponents: ['PlanIQ', 'Topline Forecast spoke'],
    description: 'Mosaic AI trains ensemble models (XGBoost + Prophet) on 36 months of ARR history, pipeline data, and macro indicators. Feature Store serves trailing consumption metrics. PlanIQ generates native statistical baseline inside Anaplan. FP&A overlays judgment, and the model auto-recalibrates monthly.',
    impact: 'Forecast accuracy improved from ±8% to ±3.2% MAPE at product-segment level',
    flow: ['Delta Lake actuals', 'Feature Store', 'Mosaic AI training', 'Model Serving endpoint', 'CloudWorks import', 'PlanIQ comparison', 'FP&A judgment overlay', 'Locked forecast'],
  },
  {
    id: 'anomaly-detection',
    title: 'Real-Time Actuals Anomaly Detection',
    category: 'All Models',
    status: 'Production',
    statusColor: '#00C6BE',
    databricksComponents: ['Model Serving', 'Databricks Workflows', 'AI Agents'],
    anaplanComponents: ['CloudWorks', 'Data Hub'],
    description: 'Model Serving endpoint scores every GL batch load against historical distributions. Anomalies (>3σ) trigger an AI Agent that investigates root cause, drafts a Slack alert with context, and optionally freezes the Anaplan import until review.',
    impact: 'Catches 94% of data quality issues before they reach planning models — down from 6-hour detection to <15 minutes',
    flow: ['GL actuals load', 'Model Serving inference', 'Anomaly flagged', 'AI Agent investigation', 'Slack alert + context', 'CloudWorks import gate', 'Manual review or auto-clear'],
  },
  {
    id: 'variance-narratives',
    title: 'AI-Generated Variance Narratives',
    category: 'CFO Reporting',
    status: 'Pilot',
    statusColor: '#D4A843',
    databricksComponents: ['Mosaic AI', 'Vector Search', 'AI/BI Genie'],
    anaplanComponents: ['NUX Dashboards'],
    description: 'After monthly close, Mosaic AI generates plain-English variance commentary for every cost center. Vector Search grounds explanations in historical memos and board deck context. Narratives are surfaced in both Databricks SQL dashboards and embedded in Anaplan NUX.',
    impact: 'Reduces CFO deck preparation from 5 days to 1.5 days. FP&A analysts review and edit AI drafts instead of writing from scratch.',
    flow: ['variance_bridge rebuild', 'Mosaic AI analysis', 'Vector Search context', 'Narrative generation', 'FP&A review queue', 'Approved narratives → CFO deck', 'Embedded in Anaplan NUX'],
  },
  {
    id: 'headcount-attrition',
    title: 'Predictive Attrition Modeling',
    category: 'Headcount',
    status: 'Development',
    statusColor: '#6B7D95',
    databricksComponents: ['Mosaic AI', 'Feature Store', 'MLflow'],
    anaplanComponents: ['PlanIQ', 'Headcount spoke'],
    description: 'ML model predicts attrition probability by department × level × tenure cohort. Feature Store includes engagement signals, comp-ratio, promotion velocity, and market benchmarks. Predictions feed Anaplan Headcount spoke as an alternative attrition driver, replacing static rate assumptions.',
    impact: 'Projected to reduce backfill timing forecast error by 40% — currently in A/B testing against static rates',
    flow: ['Workday actuals', 'Feature engineering', 'Mosaic AI training', 'MLflow model registry', 'Model Serving endpoint', 'CloudWorks import', 'Headcount spoke driver override'],
  },
  {
    id: 'cloud-optimization',
    title: 'FinOps Cost Prediction & Optimization',
    category: 'Infrastructure',
    status: 'Production',
    statusColor: '#00C6BE',
    databricksComponents: ['Mosaic AI', 'Feature Store', 'AI Agents'],
    anaplanComponents: ['Optimizer', 'Infrastructure spoke'],
    description: 'Time-series models predict cloud costs by provider × service × region at daily granularity. Anaplan Optimizer allocates workload placement across providers to minimize cost within latency constraints. AI Agent monitors drift and recommends RI/SP purchases.',
    impact: 'Cloud cost forecast accuracy at ±4% (was ±15%). $12M annual savings from optimized reservation coverage.',
    flow: ['Cloud cost actuals', 'Feature Store', 'Cost prediction model', 'Anaplan Optimizer', 'Placement recommendations', 'AI Agent monitoring', 'RI/SP purchase alerts'],
  },
];

// ─── L5 MATURITY MODEL ──────────────────────────────────────────────────────
export const L5_MATURITY = [
  { level: 'L1', name: 'Manual', description: 'Spreadsheet-based planning. Manual data entry. Email-driven process.', status: 'completed', color: '#6B7D95' },
  { level: 'L2', name: 'Connected', description: 'Anaplan hub-and-spoke deployed. Basic imports from ERP/HRIS. Still manual triggers.', status: 'completed', color: '#6B7D95' },
  { level: 'L3', name: 'Automated', description: 'CloudWorks + Databricks Workflows automate all data movement. Nightly pipeline. Variance views.', status: 'completed', color: '#6B7D95' },
  { level: 'L4', name: 'Integrated', description: 'Bidirectional Delta Lake ↔ Anaplan. Unity Catalog governance. Databricks SQL analytics. Full observability.', status: 'current', color: '#00C6BE' },
  { level: 'L5', name: 'Autonomous', description: 'ML-augmented forecasting. AI agents. Self-healing pipelines. Auto-generated narratives. Predictive planning.', status: 'target', color: '#D4A843' },
];

// ─── L5 METRICS ──────────────────────────────────────────────────────────────
export const L5_METRICS = [
  { label: 'AI Models in Production', value: '7', color: '#00C6BE' },
  { label: 'Forecast MAPE (Revenue)', value: '3.2%', color: '#D4A843' },
  { label: 'Anomaly Detection Rate', value: '94%', color: '#EE3D2C' },
  { label: 'CFO Deck Prep Time', value: '1.5d', color: '#D4A843' },
  { label: 'Auto-Reforecast Cycles', value: '~4/mo', color: '#00C6BE' },
  { label: 'Planning Feature Tables', value: '23', color: '#8A9DB5' },
];

// ─── CROSS-LAYER DATA FLOWS ─────────────────────────────────────────────────
export const L5_FLOWS = [
  { from: 'foundation', to: 'intelligence', label: 'Training data + features', color: '#00C6BE' },
  { from: 'intelligence', to: 'copilot', label: 'Model predictions + insights', color: '#00C6BE' },
  { from: 'copilot', to: 'action', label: 'Approved plans + triggers', color: '#EE3D2C' },
  { from: 'action', to: 'foundation', label: 'Updated actuals + plan versions', color: '#D4A843' },
];
