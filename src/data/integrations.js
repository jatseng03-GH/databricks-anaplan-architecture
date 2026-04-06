// ─── INTEGRATION PATTERNS ───────────────────────────────────────────────────
export const INTEGRATION_PATTERNS = [
  {
    id: 'actuals-in',
    label: 'Actuals Pipeline',
    sublabel: 'Databricks → Anaplan',
    direction: 'INTO Anaplan',
    directionColor: '#00C6BE',
    frequency: 'Nightly (1 AM PST)',
    orchestrator: 'Databricks Workflows job',
    steps: [
      { n: 1, text: 'Workflow triggers after Delta Lake finance schema write completes (post-transform validation gate)' },
      { n: 2, text: 'Anaplan REST API called: POST /imports/{modelId}/{importId}/tasks — bearer token auth via Vault secret' },
      { n: 3, text: 'Data mapping: Delta table columns → Anaplan module line items (column mapping table below)' },
      { n: 4, text: 'Anaplan import executes; calculation engine fires automatically on completion' },
      { n: 5, text: 'Success webhook → Slack alert to #fp-and-a-systems channel: "Actuals loaded ✓"' },
    ],
    tables: [
      { delta: 'finance.actuals.gl_actuals', anaplan: 'GL Actuals module', hub: 'Data Hub' },
      { delta: 'finance.actuals.headcount_actuals', anaplan: 'HC Summary module', hub: 'Headcount Planning' },
      { delta: 'finance.actuals.cloud_costs', anaplan: 'Infrastructure module', hub: 'Infrastructure & COGS' },
    ],
    columnMapping: [
      { delta: 'period (STRING, YYYY-MM)', anaplan: 'Time period (Month list)', notes: 'Format transform: 2024-01 → Jan 24' },
      { delta: 'cost_center (STRING)', anaplan: 'Cost Center list item', notes: 'Must match Hub CC list exactly' },
      { delta: 'gl_account (STRING)', anaplan: 'GL Account line item', notes: '6-digit code lookup' },
      { delta: 'actual_amount (DECIMAL)', anaplan: 'Actuals line item (USD)', notes: 'FX conversion applied in Hub' },
      { delta: 'legal_entity (STRING)', anaplan: 'Entity list item', notes: 'Must match Hub entity list' },
    ],
    errorHandling: 'Retry 3× with exponential backoff (2m, 4m, 8m). On terminal failure → PagerDuty alert + Anaplan actuals lock frozen until manual review.',
    apiSample: `POST https://api.anaplan.com/2/0/workspaces/{wId}/models/{mId}/imports/{iId}/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "localeName": "en_US"
}

// Poll task status:
GET https://api.anaplan.com/2/0/workspaces/{wId}/models/{mId}/imports/{iId}/tasks/{taskId}`,
  },
  {
    id: 'plan-out',
    label: 'Plan Export',
    sublabel: 'Anaplan → Databricks',
    direction: 'OUT of Anaplan',
    directionColor: '#EE3D2C',
    trigger: 'Manual action after forecast lock OR automated on 3rd of month at 11:59 PM PST',
    latency: '~15 minutes end-to-end after lock',
    steps: [
      { n: 1, text: 'Anaplan export action runs → generates flat file (UTF-8 CSV, pipe-delimited) via Saved Export definition' },
      { n: 2, text: 'Anaplan CloudWorks (or custom API polling) pushes flat file to Databricks external location (ADLS Gen2 / S3 landing zone)' },
      { n: 3, text: 'Databricks Autoloader picks up file → MERGE INTO finance.plan.anaplan_opex_export (upsert on period + cost_center + version)' },
      { n: 4, text: 'dbt model rebuilds finance.analytics.variance_bridge table joining actuals + plan' },
      { n: 5, text: 'Databricks SQL dashboard auto-refreshes; Looker PDT rebuild triggered via API' },
    ],
    tables: [
      { anaplan: 'Opex Summary module', delta: 'finance.plan.anaplan_opex_export', notes: 'All versions (Budget, Fcst)' },
      { anaplan: 'HC Expense Summary module', delta: 'finance.plan.anaplan_hc_export', notes: 'Aggregate only, no PII' },
      { anaplan: 'Revenue Summary module', delta: 'finance.plan.anaplan_revenue_export', notes: 'ARR, GAAP Rev' },
    ],
    apiSample: `# Step 1 — trigger Anaplan export action
POST https://api.anaplan.com/2/0/workspaces/{wId}/models/{mId}/exports/{eId}/tasks
Authorization: Bearer {token}

# Step 2 — download result file
GET https://api.anaplan.com/2/0/workspaces/{wId}/models/{mId}/exports/{eId}/tasks/{taskId}/chunks/0

# Step 3 — Databricks: merge into Delta table
MERGE INTO finance.plan.anaplan_opex_export AS target
USING landing.anaplan_export_staging AS source
ON target.period = source.period
  AND target.cost_center = source.cost_center
  AND target.version = source.version
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;`,
  },
  {
    id: 'variance',
    label: 'Variance Analytics',
    sublabel: 'Databricks SQL',
    direction: 'Internal to Databricks',
    directionColor: '#D4A843',
    purpose: 'Join actuals + plan data for CFO variance dashboards and ad-hoc FP&A analysis',
    consumers: ['Looker Finance dashboards (embedded in Anaplan NUX)', 'Databricks SQL ad-hoc queries (FP&A analysts)', 'CFO weekly variance PDF report (auto-generated)', 'Board package preparation (quarterly)'],
    governance: 'Unity Catalog row-level filters apply — BU finance leads see only their own cost centers. Compensation data masked by column policy for non-HR viewers.',
    sql: `CREATE OR REPLACE VIEW finance.analytics.variance_bridge AS
SELECT
  a.cost_center,
  a.period,
  a.gl_account,
  a.legal_entity,
  a.actual_amount,
  p.plan_amount,
  p.forecast_amount,
  a.actual_amount - p.plan_amount          AS variance_to_plan,
  a.actual_amount - p.forecast_amount      AS variance_to_fcst,
  ROUND(
    (a.actual_amount - p.plan_amount)
    / NULLIF(p.plan_amount, 0) * 100, 1
  )                                        AS variance_pct,
  ROUND(
    (a.actual_amount - p.forecast_amount)
    / NULLIF(p.forecast_amount, 0) * 100, 1
  )                                        AS fcst_variance_pct,
  a.source_system,
  p.version,
  current_timestamp()                      AS refreshed_at
FROM finance.actuals.gl_actuals a
LEFT JOIN finance.plan.anaplan_opex_export p
  ON  a.cost_center  = p.cost_center
  AND a.period       = p.period
  AND a.gl_account   = p.gl_account
  AND a.legal_entity = p.legal_entity
-- Unity Catalog row-level filter applied automatically
-- based on caller's group membership`,
  },
  {
    id: 'governance',
    label: 'Governance & Access',
    sublabel: 'Unity Catalog ↔ Anaplan',
    direction: 'Bidirectional (policy-driven)',
    directionColor: '#8A9DB5',
    purpose: 'Keep Anaplan RBAC and Unity Catalog access policies in sync — same person who can see headcount data in Anaplan can query it in Databricks SQL, and vice versa',
    anaplanSide: [
      'Model roles map 1:1 to Databricks account-level groups (e.g., Anaplan role "HC_Restricted" → group "fp_hc_restricted")',
      'Selective access on Hub lists mirrors row-level filters (e.g., VP Sales sees only Sales cost centers)',
      'Compensation modules (salary, equity) tagged "Restricted" → Unity Catalog PII classification + column masking for non-HR',
      'NUX dashboard visibility controlled by same group membership',
    ],
    databricksSide: [
      'Unity Catalog table grants mirror Anaplan model role assignments',
      'finance.actuals.headcount_actuals → PII tagged; base_salary column masked (returns *** for non-HR)',
      'finance.plan.anaplan_hc_export → aggregate only (no per-person data), marked Confidential',
      'Row-level security on variance_bridge: BU filter based on user email domain + group',
    ],
    implementation: 'Quarterly sync via Python script that reads Anaplan REST API user-role assignments and reconciles with Unity Catalog GRANT statements. Discrepancies flagged in IT/Security JIRA queue for same-day resolution. Access certification covers both platforms simultaneously (SOX scope).',
    syncScript: `# Quarterly access reconciliation (simplified)
import requests
from databricks.sdk import WorkspaceClient

# 1. Pull Anaplan user → role assignments
anaplan_roles = get_anaplan_user_roles(model_id=MODEL_ID)

# 2. Pull Unity Catalog group memberships
w = WorkspaceClient()
uc_members = {g.display_name: get_group_members(g.id)
              for g in w.groups.list()}

# 3. Reconcile and flag discrepancies
for user, anaplan_role in anaplan_roles.items():
    expected_uc_group = ROLE_TO_GROUP_MAP[anaplan_role]
    if user not in uc_members.get(expected_uc_group, []):
        flag_discrepancy(user, anaplan_role, expected_uc_group)`,
  },
];

// ─── DELTA LAKE TABLE SCHEMAS ────────────────────────────────────────────────
export const DELTA_TABLES = [
  {
    name: 'finance.actuals.gl_actuals',
    direction: 'Source → Anaplan',
    refresh: 'Nightly (~12:00 AM PST)',
    classification: 'Internal',
    classColor: '#00C6BE',
    description: 'General ledger actuals from NetSuite ERP. Primary source for monthly P&L actuals loaded into Anaplan hub-and-spoke models.',
    columns: [
      { name: 'period', type: 'STRING', notes: 'YYYY-MM format, e.g. "2024-01"' },
      { name: 'cost_center', type: 'STRING', notes: 'Matches Anaplan CC list exactly (CC-1001 format)' },
      { name: 'gl_account', type: 'STRING', notes: '6-digit account code (NetSuite chart of accounts)' },
      { name: 'legal_entity', type: 'STRING', notes: 'Matches Hub entity list (e.g. "Databricks Inc.")' },
      { name: 'actual_amount', type: 'DECIMAL(18,2)', notes: 'Functional currency (USD). FX applied in NetSuite.' },
      { name: 'local_amount', type: 'DECIMAL(18,2)', notes: 'Original currency amount before FX conversion' },
      { name: 'currency', type: 'STRING', notes: 'ISO 4217 (USD, GBP, EUR, etc.)' },
      { name: 'source_system', type: 'STRING', notes: 'Always "NetSuite" for this table' },
      { name: 'load_timestamp', type: 'TIMESTAMP', notes: 'UTC timestamp of Delta Lake write' },
    ],
    partitioned: 'period, legal_entity',
    zorder: 'cost_center, gl_account',
  },
  {
    name: 'finance.actuals.headcount_actuals',
    direction: 'Source → Anaplan',
    refresh: 'Nightly (~10:30 PM PST)',
    classification: 'PII — Restricted',
    classColor: '#EE3D2C',
    description: 'Employee position actuals from Workday HRIS. Salary columns masked for non-HR viewers via Unity Catalog column masking policy.',
    columns: [
      { name: 'period', type: 'STRING', notes: 'YYYY-MM format' },
      { name: 'employee_id', type: 'STRING', notes: '⚠ Masked → "EMP-***" for non-HR group' },
      { name: 'position_id', type: 'STRING', notes: 'Matches Anaplan Position list (POS-XXXXXX)' },
      { name: 'department', type: 'STRING', notes: 'Dept code matching Hub department list' },
      { name: 'location', type: 'STRING', notes: 'Office location matching Hub location list' },
      { name: 'job_level', type: 'STRING', notes: 'IC1-IC8, M1-M5, Dir, VP, SVP, C-Suite' },
      { name: 'base_salary', type: 'DECIMAL(18,2)', notes: '⚠ Masked → NULL for non-HR group' },
      { name: 'employment_type', type: 'STRING', notes: 'Full-Time, Part-Time, Contractor' },
      { name: 'hire_date', type: 'DATE', notes: 'ISO 8601 date' },
      { name: 'termination_dt', type: 'DATE', notes: 'NULL if still active' },
      { name: 'load_timestamp', type: 'TIMESTAMP', notes: 'UTC timestamp of Workday sync' },
    ],
    partitioned: 'period',
    zorder: 'department, job_level',
  },
  {
    name: 'finance.actuals.cloud_costs',
    direction: 'Source → Anaplan',
    refresh: 'Nightly (~11:00 PM PST via API pull)',
    classification: 'Internal',
    classColor: '#00C6BE',
    description: 'Cloud infrastructure costs from AWS Cost Explorer, Azure Cost Management, and GCP Billing. Primary COGS driver for Databricks gross margin analysis.',
    columns: [
      { name: 'period', type: 'STRING', notes: 'YYYY-MM format' },
      { name: 'cloud_provider', type: 'STRING', notes: 'AWS | Azure | GCP' },
      { name: 'service', type: 'STRING', notes: 'EC2, S3, RDS, Blob Storage, BigQuery, etc.' },
      { name: 'region', type: 'STRING', notes: 'us-east-1, eu-west-1, etc.' },
      { name: 'product_line', type: 'STRING', notes: 'Mapped from cost allocation tags' },
      { name: 'cost_amount', type: 'DECIMAL(18,4)', notes: 'USD, net of EDP discount' },
      { name: 'usage_quantity', type: 'DECIMAL(18,4)', notes: 'Raw usage units' },
      { name: 'usage_unit', type: 'STRING', notes: 'DBU, GB, GB-Month, Hrs, etc.' },
      { name: 'cost_category', type: 'STRING', notes: 'Compute | Storage | Egress | Support | Other' },
      { name: 'load_timestamp', type: 'TIMESTAMP', notes: 'UTC timestamp' },
    ],
    partitioned: 'period, cloud_provider',
    zorder: 'product_line, service',
  },
  {
    name: 'finance.plan.anaplan_opex_export',
    direction: 'Anaplan → Databricks',
    refresh: 'Monthly (post-lock, ~Day 3) + on-demand',
    classification: 'Confidential',
    classColor: '#D4A843',
    description: 'Anaplan non-headcount opex plan and forecast export. Merged into Delta table on each export cycle. Joined with actuals to build variance_bridge view.',
    columns: [
      { name: 'period', type: 'STRING', notes: 'YYYY-MM format' },
      { name: 'cost_center', type: 'STRING', notes: 'Anaplan CC list value' },
      { name: 'gl_account', type: 'STRING', notes: 'Account code mapping from Anaplan' },
      { name: 'opex_category', type: 'STRING', notes: 'Software/SaaS, T&E, Mktg Programs, etc.' },
      { name: 'plan_amount', type: 'DECIMAL(18,2)', notes: 'Budget version USD amount' },
      { name: 'forecast_amount', type: 'DECIMAL(18,2)', notes: 'Latest forecast version USD amount' },
      { name: 'version', type: 'STRING', notes: 'Budget | Q1Fcst | Q2Fcst | Q3Fcst | Q4Fcst' },
      { name: 'export_timestamp', type: 'TIMESTAMP', notes: 'When Anaplan export ran' },
    ],
    partitioned: 'period, version',
    zorder: 'cost_center',
  },
  {
    name: 'finance.plan.anaplan_hc_export',
    direction: 'Anaplan → Databricks',
    refresh: 'Monthly (post-lock)',
    classification: 'Confidential + PII',
    classColor: '#EE3D2C',
    description: 'Headcount plan export — aggregate by department/level only. No per-person data exported. Used for FTE and people cost variance analysis.',
    columns: [
      { name: 'period', type: 'STRING', notes: 'YYYY-MM format' },
      { name: 'department', type: 'STRING', notes: 'Dept code from Hub department list' },
      { name: 'job_level', type: 'STRING', notes: 'IC1-IC8, M1-M5, Dir, VP, SVP, C-Suite' },
      { name: 'location', type: 'STRING', notes: 'Office location' },
      { name: 'plan_hc', type: 'INTEGER', notes: 'End-of-period headcount (plan)' },
      { name: 'avg_hc', type: 'DECIMAL(8,1)', notes: 'Average headcount for period' },
      { name: 'plan_base_salary', type: 'DECIMAL(18,2)', notes: 'Aggregate only — no per-person data' },
      { name: 'plan_total_comp', type: 'DECIMAL(18,2)', notes: 'Fully-loaded cost (aggregate)' },
      { name: 'version', type: 'STRING', notes: 'Budget | Q1Fcst | etc.' },
    ],
    partitioned: 'period, version',
    zorder: 'department, job_level',
  },
  {
    name: 'finance.analytics.variance_bridge',
    direction: 'Internal (Databricks SQL view)',
    refresh: 'Rebuilt after each actuals OR plan load event',
    classification: 'Confidential',
    classColor: '#D4A843',
    description: 'Core variance analytics view joining gl_actuals to anaplan_opex_export. Row-level security applied by Unity Catalog based on caller group membership.',
    columns: [
      { name: 'cost_center', type: 'STRING', notes: 'Row-level filtered by BU group' },
      { name: 'period', type: 'STRING', notes: 'YYYY-MM' },
      { name: 'gl_account', type: 'STRING', notes: '6-digit account code' },
      { name: 'legal_entity', type: 'STRING', notes: 'Entity name from Hub' },
      { name: 'actual_amount', type: 'DECIMAL(18,2)', notes: 'From gl_actuals' },
      { name: 'plan_amount', type: 'DECIMAL(18,2)', notes: 'From anaplan_opex_export (Budget version)' },
      { name: 'forecast_amount', type: 'DECIMAL(18,2)', notes: 'From anaplan_opex_export (latest Fcst)' },
      { name: 'variance_to_plan', type: 'DECIMAL(18,2)', notes: 'actual - plan (negative = favorable)' },
      { name: 'variance_to_fcst', type: 'DECIMAL(18,2)', notes: 'actual - forecast' },
      { name: 'variance_pct', type: 'DECIMAL(8,1)', notes: 'variance_to_plan / plan × 100' },
      { name: 'fcst_variance_pct', type: 'DECIMAL(8,1)', notes: 'variance_to_fcst / forecast × 100' },
      { name: 'refreshed_at', type: 'TIMESTAMP', notes: 'View materialization timestamp' },
    ],
    consumers: ['Looker Finance dashboards', 'Databricks SQL ad-hoc', 'CFO weekly variance report', 'Board package preparation'],
  },
];

// ─── ORCHESTRATION JOBS ──────────────────────────────────────────────────────
export const ORCHESTRATION_JOBS = [
  { name: 'NetSuite GL extract', start: 22.0, duration: 0.75, system: 'source', color: '#6B7D95' },
  { name: 'Workday HRIS extract', start: 22.5, duration: 0.33, system: 'source', color: '#6B7D95' },
  { name: 'AWS/Azure/GCP cost pull', start: 23.0, duration: 0.5, system: 'source', color: '#6B7D95' },
  { name: 'Delta Lake validation + schema check', start: 23.75, duration: 0.25, system: 'validation', color: '#D4A843' },
  { name: 'Workflows: transform + write finance schema', start: 0.0, duration: 0.75, system: 'databricks', color: '#00C6BE' },
  { name: 'Anaplan API: trigger import actions', start: 0.75, duration: 0.5, system: 'anaplan', color: '#EE3D2C' },
  { name: 'Anaplan calculation engine runs', start: 1.5, duration: 0.5, system: 'anaplan', color: '#EE3D2C' },
  { name: 'variance_bridge view rebuild', start: 2.0, duration: 0.25, system: 'databricks', color: '#00C6BE' },
  { name: 'Looker / Databricks SQL refresh', start: 6.0, duration: 0.33, system: 'databricks', color: '#00C6BE' },
  { name: 'FP&A Slack alert: "Actuals loaded ✓"', start: 7.0, duration: 0.08, system: 'validation', color: '#D4A843' },
];

export const MONTHLY_JOBS = [
  { day: 1, label: 'ERP month-end close begins', system: 'source' },
  { day: 3, label: 'Anaplan actuals lock (imports frozen)', system: 'anaplan' },
  { day: 3, label: 'Anaplan forecast submission deadline', system: 'anaplan' },
  { day: 3, label: 'Post-lock plan export to Delta Lake runs', system: 'databricks' },
  { day: 5, label: 'variance_bridge fully populated for monthly close', system: 'databricks' },
  { day: 10, label: 'CFO monthly variance deck auto-generated', system: 'validation' },
];

export const PIPELINE_HEALTH = {
  lastSuccess: 'Today, 2:14 AM PST',
  avgDuration: '3h 42m',
  slaTarget: '6:00 AM PST',
  last7Days: [true, true, true, true, true, true, true],
  onCall: 'FP&A Systems team (#fp-and-a-systems)',
  tableCount: 6,
  dailyRows: '~2.4M rows/night',
};
