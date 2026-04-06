# Databricks × Anaplan FP&A Architecture — Claude Code Build Prompt

## Instructions
Copy everything below this line and paste it into Claude Code or Claude Cowork as your build prompt.

---

You are an expert systems architect and frontend engineer. Build a multi-page interactive web application called "Databricks × Anaplan FP&A Architecture" — a professional reference tool showcasing a complete Anaplan hub-and-spoke system architecture designed for Databricks' finance organization.

## TECH STACK

- React (Vite) with React Router for multi-page routing
- Tailwind CSS for styling
- Framer Motion for animations and page transitions
- Recharts for any data visualizations
- Lucide React for icons
- No backend required — all data is hardcoded in a central data file

## DESIGN SYSTEM — DATABRICKS BRANDED

Commit fully to the Databricks visual identity.

Colors:
  --db-red: #EE3D2C          (primary brand, CTAs, active states)
  --db-red-dark: #C4321D     (hover states)
  --db-navy: #0A0F1C         (page background)
  --db-navy-2: #0F1828       (card backgrounds)
  --db-navy-3: #141F33       (elevated cards)
  --db-border: #1E2E48       (default borders)
  --db-white: #F5F1EB        (primary text)
  --db-muted: #6B7D95        (secondary text)
  --db-teal: #00C6BE         (accent — integration lines)
  --db-gold: #D4A843         (accent — metrics)

Typography:
  - Headings: "Syne" (Google Fonts) — weights 700, 800
  - Body: "DM Sans" (Google Fonts) — weights 400, 500
  - Mono/labels: "DM Mono" (Google Fonts)

Visual details:
  - Subtle red grid pattern on page backgrounds: rgba(238,61,44,0.05)
  - Red left-border accent on all section headings
  - Cards: background --db-navy-2, border 1px solid --db-border, border-radius 8px
  - Active nav: red dot + red text. Integration nav item: teal dot
  - Smooth page transitions via Framer Motion (fade + slight Y translate)

## FILE STRUCTURE

src/
  data/
    models.js          <- all Anaplan model data
    financials.js      <- Databricks real financial metrics
    integrations.js    <- integration patterns, Delta Lake schemas, orchestration jobs
  components/
    Nav.jsx
    Footer.jsx
    PageHeader.jsx
    ModelCard.jsx
    ModuleTable.jsx    <- sortable, expandable rows with formulas
    ListTable.jsx      <- filterable accordion
    ArchNode.jsx
    MetricBadge.jsx
    DiscoPhase.jsx
  pages/
    Home.jsx
    Integration.jsx    <- NEW: Anaplan x Databricks integration page
    Hub.jsx
    ToplineForecast.jsx
    Headcount.jsx
    NonHeadcount.jsx
    Infrastructure.jsx
    EquityComp.jsx
    SalesOps.jsx
  App.jsx
  main.jsx
  index.css

## NAVIGATION (left to right)

Overview | Integration | Hub Model | Topline | Headcount | Non-Headcount | Infrastructure | Equity | Sales Ops

- Active route: red dot + red text
- Integration item: teal dot (signals cross-platform page)
- Fixed top nav with backdrop-blur on scroll

---

## PAGE 1: HOME (/)

Hero:
  - H1: "Databricks FP&A" / "System Architecture" (line 2 italic red)
  - Subheading: "Anaplan hub-and-spoke model for a $5.4B ARR, 11,000-person organization"
  - 4 stat cards: $5.4B ARR | >65% YoY | ~11,000 Employees | $134B Valuation

System Landscape Diagram — 4 concentric rings:

  CENTER: Anaplan Data Hub (red hexagon)
    "Master Data · Org Hierarchy · Time · Drivers"

  Ring 1 — SPOKES (red dashed animated lines from hub):
    Topline Forecast, Headcount Planning, Non-Headcount Opex,
    Infrastructure & COGS, Equity Compensation, Sales Ops & Commissions
    Each node clickable → routes to detail page

  Ring 2 — DATABRICKS PLATFORM (teal double-headed animated arrows):
    Delta Lake — "actuals in / plan out"
    Databricks SQL — "variance analytics"
    Unity Catalog — "access governance"
    Databricks Workflows — "pipeline orchestration"
    Arrows bidirectional, color #00C6BE, animated pulse both directions

  Ring 3 — EXTERNAL SOURCES (muted grey lines):
    Workday (HRIS), NetSuite (ERP), Salesforce (CRM), AWS/Azure/GCP

  Legend:
    red dashed = Anaplan internal
    teal double = Databricks integration (bidirectional)
    grey solid = external source systems

ARR Growth Chart (Recharts, animated on scroll):
  FY22 $404M -> FY23 $1.5B -> FY24 $3.0B -> FY25 $3.7B -> FY26 $5.4B

6 spoke model cards grid below diagram (click -> detail page)

---

## PAGE 2: INTEGRATION ARCHITECTURE (/integration)

### Section 1: Swim-Lane Diagram (3 lanes)

Lane 1 — Source Systems: NetSuite ERP, Workday HRIS, Salesforce CRM, Cloud Cost APIs
Lane 2 — Databricks Platform (red-tinted bg): Workflows, Delta Lake, Unity Catalog, Databricks SQL
Lane 3 — Anaplan: Data Hub, Spoke Models x6, NUX Dashboards, CFO Reports

Arrows:
  Source -> Workflows: "nightly ETL job"
  Workflows -> Delta Lake: "write to finance schema"
  Delta Lake <-> Anaplan Hub: "import action (API)" / "plan export (post-lock)" [teal, animated]
  Unity Catalog <-> Anaplan Hub: "access policy sync" [dashed]
  Databricks SQL -> CFO Reports: "BI query layer"

### Section 2: Integration Patterns (4 tabs)

Tab 1 — Actuals Pipeline (Databricks -> Anaplan):
  Nightly at 1 AM PST via Databricks Workflows
  Tables: finance.actuals.gl_actuals, headcount_actuals, cloud_costs
  API call: POST https://api.anaplan.com/2/0/workspaces/{wId}/models/{mId}/imports/{iId}/tasks
  Error handling: retry 3x, PagerDuty on failure, freeze actuals lock

Tab 2 — Plan Export (Anaplan -> Databricks):
  Trigger: post-lock or 3rd of month
  Tables written: finance.plan.anaplan_opex_export, anaplan_hc_export, anaplan_revenue_export
  Latency: ~15 min end-to-end

Tab 3 — Variance Analytics (Databricks SQL):
  SQL view:
    CREATE OR REPLACE VIEW finance.analytics.variance_bridge AS
    SELECT a.cost_center, a.period, a.gl_account,
           a.actual_amount, p.plan_amount, p.forecast_amount,
           a.actual_amount - p.plan_amount AS variance_to_plan,
           ROUND((a.actual_amount - p.plan_amount) / NULLIF(p.plan_amount,0) * 100, 1) AS variance_pct
    FROM finance.actuals.gl_actuals a
    LEFT JOIN finance.plan.anaplan_opex_export p
      ON a.cost_center = p.cost_center AND a.period = p.period AND a.gl_account = p.gl_account

Tab 4 — Governance Sync (Unity Catalog <-> Anaplan):
  Quarterly script syncs Anaplan model roles with Unity Catalog grants
  PII classification on headcount tables (column masking for non-HR)
  Comp modules restricted in both Anaplan RBAC and Unity Catalog

### Section 3: Delta Lake Table Schemas (expandable cards)

finance.actuals.gl_actuals          | Nightly | Internal
  period, cost_center, gl_account, legal_entity, actual_amount, currency, source_system, load_timestamp

finance.actuals.headcount_actuals   | Nightly | PII-Restricted
  period, employee_id (masked), position_id, department, location, job_level, base_salary (masked), employment_type, hire_date, termination_dt

finance.actuals.cloud_costs         | Nightly | Internal
  period, cloud_provider, service, region, product_line, cost_amount, usage_quantity, usage_unit

finance.plan.anaplan_opex_export    | Monthly | Confidential
  period, cost_center, gl_account, opex_category, plan_amount, forecast_amount, version, export_timestamp

finance.plan.anaplan_hc_export      | Monthly | Confidential+PII
  period, department, job_level, location, plan_hc, plan_base_salary (aggregate), plan_total_comp, version

finance.analytics.variance_bridge  | Post-load rebuild | Confidential
  (columns from variance_bridge SQL view above)

### Section 4: Orchestration Timeline

Nightly (visual horizontal bar chart, color-coded):
  10:00 PM  NetSuite GL extract           45 min  [grey]
  10:30 PM  Workday HRIS extract          20 min  [grey]
  11:00 PM  Cloud cost API pull           30 min  [grey]
  11:45 PM  Delta Lake validation         15 min  [teal]
  12:00 AM  Workflows transform + write   45 min  [teal]
  12:45 AM  Anaplan import actions        30 min  [red]
  01:30 AM  Anaplan calculation engine    20 min  [red]
  02:00 AM  variance_bridge rebuild       10 min  [teal]
  06:00 AM  BI dashboard refresh          15 min  [gold]
  07:00 AM  FP&A Slack alert              instant [gold]

Monthly calendar strip:
  Day 1: ERP close begins | Day 3: Actuals lock + forecast deadline + plan export
  Day 5: variance_bridge complete | Day 10: CFO variance deck

Pipeline Health mini-dashboard:
  Last run: [timestamp] | Avg duration: 3h 42m | SLA: 6 AM PST
  Last 7 days: all green dots | On-call: FP&A Systems Team

---

## PAGE 3: HUB MODEL (/hub)

DISCO:

D — Define: Eliminate reconciliation errors across 6+ planning models. Owner: FP&A Systems.
I — Identify: Workday, NetSuite, Manual. Dimensions: Organization, Time, Entity, Version, Scenario.

S — Modules (sortable table, click row to expand formulas):
  ORG Hierarchy      | Input | Department x Level          | Dept Code, Parent, Cost Center, Entity, Geo
  Time Settings      | System| Time                        | Current Period, FY Start, Planning Horizon
  Global Assumptions | Input | Time x Version              | FX Rates, Merit %, Benefit Rate, Payroll Tax, Bonus %
  Position Master    | Input | Position x Time             | Level, Dept, Location, Status, Filled/Open
  Scenario Config    | Input | Scenario                    | Name, Weight, Active Flag
  Version Management | Input | Version                     | Type, Lock Status, Owner, Last Updated
  Cost Center Mapping| Input | CC x Department             | CC Code, Name, Parent, Allocation Method, BU
  Entity Hierarchy   | Input | Legal Entity                | Name, Country, Currency, Consolidation Level

C — Lists (filterable accordion with "Used In" badges):
  Department List    | ~120  | Numbered | Workday | All models
  Cost Center List   | ~280  | Numbered | NetSuite| Headcount, NonHC, Equity
  Legal Entity List  | ~18   | Text     | Manual  | All models
  Job Level List     | L1-L8, Exec | Text | Manual | Headcount, Equity
  Location List      | ~35   | Text     | Workday | Headcount
  Version List       | Budget, Q1-Q4 Fcst, LY Act | Text | Manual | All models
  Scenario List      | Base, Upside, Downside | Text | Manual | Topline, Headcount
  Time Periods       | FY2024-FY2026 months | Time | System | All models
  Product Line List  | Data+AI, SQL, ML, Other | Text | Manual | Topline, Infrastructure

O — Output: COLLECT formulas publish global assumptions to all spokes. ALM: Dev->Test->Prod.

---

## PAGE 4: TOPLINE FORECAST (/topline)

Seed data: $5.4B ARR, >65% YoY, SQL >$1B, AI >$1B, NDR >140%, 500+ $1M customers, 80% GM

S — Modules:
  Revenue Assumptions  | Input | Product x Segment x Time     | New Logo ACV, Expansion %, Churn %, Contraction %
  Customer Cohort      | Calc  | Cohort x Time                | Beg Customers, New Logos, Churned, Net, Avg ACV
  ARR Build            | Calc  | Product x Segment x Time     | Beg ARR, New Biz, Expansion, Contraction, Churn, End ARR
  Net Dollar Retention | Calc  | Segment x Time               | Beg ARR, Expansion, Contraction, Churn, NDR %
  Revenue Recognition  | Calc  | Product x Time               | ARR, ACV, GAAP Rev, Deferred, Billings
  Geo Split            | Calc  | Geo x Product x Time         | Americas, EMEA, APAC ARR, % of Total
  Bookings Bridge      | Calc  | Segment x Time               | New Logos, Upsell, Renewal, Total, vs Plan
  Revenue Summary      | Output| Product x Time               | Total ARR, GAAP Rev, QoQ, YoY, vs Plan %

C — Lists:
  Product Line     | Data Intelligence Platform, SQL, AI/ML, Marketplace
  Customer Segment | Enterprise >$1M, Mid-Market $100K-$1M, SMB <$100K, Strategic
  Geography        | Americas, EMEA, APAC  [from Hub]
  Revenue Type     | New Business, Expansion, Contraction, Churn, Renewal
  Booking Type     | Direct, Channel, Marketplace

Formulas (expand on row click):
  End ARR = Beginning ARR + New Business ARR + Expansion ARR - Contraction ARR - Churn ARR
  NDR % = (Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR

---

## PAGE 5: HEADCOUNT PLANNING (/headcount)

Context: ~11,000 employees, hiring 3,000 in 2025

S — Modules:
  HC Assumptions     | Input | Level x Geo x Time           | Base Salary, Bonus %, Benefits %, Payroll Tax %, Recruiting Cost
  Position Plan      | Input | Position x Time              | Title, Level, Dept, Geo, Status, Start Month, End Month
  New Hire Schedule  | Input | Department x Time            | Approved Hires, Start Month, Backfill Flag, Req ID
  Attrition Model    | Calc  | Dept x Level x Time          | Beg HC, Voluntary, Involuntary, Total Attrition, Rate %
  HC Summary         | Calc  | Department x Time            | Beg HC, New Hires, Attrition, Transfers, End HC, Avg HC
  Comp & Benefits    | Calc  | Position x Time              | Base, Bonus, Benefits, Payroll Tax, Total Cash, Loaded Cost
  Recruiting Costs   | Calc  | Department x Time            | New Hires, Avg Cost, Total, Agency vs Internal
  HC by Function     | Output| Function x Time              | Eng, G&A, Sales, Field Eng, Total, % of Total
  HC Expense Summary | Output| Cost Center x Time           | Salaries, Bonus, Benefits, Payroll Tax, Recruiting, Total

C — Lists:
  Position List    | ~11K+         | Workday
  Job Level        | IC1-IC8, M1-M5, Dir, VP, SVP, C-Suite | Manual
  Function         | Engineering, Product, Sales, Field Eng, G&A, Marketing | Hub
  Employment Type  | Full-Time, Part-Time, Contractor | Workday
  Hire Type        | New, Backfill, Conversion | Manual
  Attrition Type   | Voluntary, Involuntary, Retirement | Manual
  Office Location  | SF HQ, NYC, Seattle, London, Amsterdam, Bangalore, +30 | Hub

Formulas:
  End HC = Beginning HC + New Hires - Attrition - Transfers Out + Transfers In
  Avg HC = (Beginning HC + End HC) / 2
  Attrition Rate % = Attrition / TIMESUM(Avg HC, YEAR)

---

## PAGE 6: NON-HEADCOUNT OPEX (/non-headcount)

S — Modules:
  Opex Assumptions     | Input | Category x Dept x Time   | Per-HC Rate, Growth %, Seasonal Index, Inflation
  Software & SaaS      | Input | Vendor x Dept x Time     | Contract Value, Start/End, Auto-Renew, Monthly Amort
  T&E Budget           | Input | Department x Time        | T&E per HC, Events, Field, Conference Budget
  Marketing Programs   | Input | Program x Time           | Name, Owner, Budget, Phasing, Expected Pipeline $
  Professional Services| Input | Vendor x Dept x Time     | Type, Monthly Spend, SOW Value, Remaining
  Facilities           | Input | Office x Time            | Lease, Utilities, Office Ops, Capacity, Cost/Seat
  Depreciation         | Calc  | Asset x Time             | Type, Cost Basis, Useful Life, Monthly Depr, Accumulated
  Opex Summary         | Calc  | Category x Dept x Time   | Actual, Budget, Forecast, Variance $, Variance %
  Opex by P&L Line     | Output| P&L Category x Time      | S&M, R&D, G&A, Total Opex, % of Revenue

C — Lists:
  Opex Category  | Software/SaaS, T&E, Mktg Programs, Prof Svcs, Facilities, D&A
  Vendor List    | Top 50 by spend | NetSuite
  P&L Category   | Sales & Marketing, R&D, G&A
  Asset Type     | Hardware, Leasehold, Intangible, ROU Asset

---

## PAGE 7: INFRASTRUCTURE & COGS (/infrastructure)

Context: ~80% gross margin; AWS/Azure/GCP is primary COGS driver

S — Modules:
  Cloud Assumptions    | Input | Provider x Product x Time  | Cost/DBU, Storage/TB, Egress/TB, Support % of Rev
  DBU Consumption Plan | Input | Product x Segment x Time   | DBU Volume, YoY Growth %, Seasonal Factor, Price/DBU
  Cloud Cost by Prov.  | Calc  | Provider x Product x Time  | Compute, Storage, Egress, Support, Total Cloud COGS
  COGS Build           | Calc  | Product x Time             | Cloud COGS, Hosting, Depreciation, Ops Labor, Total COGS
  Gross Margin         | Calc  | Product x Time             | Revenue, COGS, Gross Profit, GM %, vs Plan, vs PY
  Unit Economics       | Calc  | Product x Segment x Time  | Rev/DBU, Cost/DBU, Contribution Margin, Payback
  FinOps Tracking      | Calc  | Initiative x Time          | Name, Target Savings, Realized, Owner, Status
  COGS Summary         | Output| Time                       | Total COGS, Revenue, Gross Profit, Blended GM%, Target

C — Lists:
  Cloud Provider    | AWS, Azure, GCP
  COGS Category     | Compute, Storage, Egress, Support, Other
  Region            | us-east-1, us-west-2, eu-west-1, +6
  FinOps Initiative | All active cost reduction programs

Formulas:
  Gross Profit = Revenue - Total COGS
  Gross Margin % = Gross Profit / Revenue
  Cost per DBU = Total Cloud COGS / DBU Volume

---

## PAGE 8: EQUITY COMPENSATION (/equity)

Context: Pre-IPO; equity is primary comp tool for 11,000 employees. ASC 718 SBC recognition.

S — Modules:
  Grant Assumptions  | Input | Grant Type x Level x Time      | Grant Size, FMV at Grant, Vesting Schedule, Cliff
  RSU Grant Plan     | Input | Grant Cohort x Time            | Grant Date, Shares, FMV, Level, Dept, Vesting Start
  Vesting Schedule   | Calc  | Grant x Time                   | Vested Shares, Unvested, Cumulative %, Monthly Vest $
  SBC Expense        | Calc  | Cohort x Department x Time     | Monthly SBC, Cumulative, Unamortized Balance, Grant FMV
  New Grant Proj.    | Input | Department x Level x Time      | Projected Grants, Expected FMV, Forfeitures, Net Expense
  SBC by Function    | Output| Function x Time                | Eng SBC, G&A SBC, Sales SBC, Total, % of Revenue
  GAAP vs Non-GAAP   | Output| P&L Line x Time                | GAAP Expense, SBC Addback, Non-GAAP, by Dept + Total

C — Lists:
  Grant Type        | RSU, ISO, NSO, Performance RSU, ESPP | Carta
  Vesting Schedule  | 4yr/1yr cliff, 4yr monthly, 2yr monthly, Custom
  Grant Cohort      | Rolling monthly cohorts | Carta

Formulas:
  Monthly SBC Expense = Grant FMV / Vesting Months
  Unamortized Balance = Total Grant FMV - Cumulative SBC Expense
  SBC % of Revenue = SUM(All Depts, Monthly SBC) / Revenue

---

## PAGE 9: SALES OPS & COMMISSIONS (/sales-ops)

Context: 500+ $1M customers; sales comp is major S&M line. Must tie to topline ARR assumptions.

S — Modules:
  Comp Plan Assumptions | Input | Role x Time              | OTE, Base/Variable Split, Accelerators, Clawback Rules
  Quota Plan            | Input | Rep x Time               | Annual Quota, Monthly Phasing %, Territory, Product Overlay
  Bookings Actuals      | Input | Rep x Deal x Time        | Deal Name, Close Date, ACV, Product, Segment, Type
  Attainment Calc       | Calc  | Rep x Time               | Quota, Bookings, Attainment %, Payout Multiplier, Commission
  Commission Accrual    | Calc  | Department x Time        | Earned, Draws, Recoveries, Net Accrual, Cash Timing
  Sales Productivity    | Calc  | Segment x Time           | QC Reps, Avg Quota, Avg Attainment, Rev per Rep
  Territory Model       | Input | Territory x Time         | Name, Region, Segment, Accounts, AE, Whitespace $
  Commission Summary    | Output| Role x Time              | Total Commission $, OTE %, Comm % of Bookings, vs Budget

C — Lists:
  Sales Role       | Enterprise AE, MM AE, SDR, SE, CSM, Partner
  Sales Rep List   | ~400+ quota-carrying reps | Salesforce
  Territory        | All territories by region/segment | Sales Ops
  Comp Plan        | All active plans by role and year
  Accelerator Tier | 0-50%, 51-75%, 76-100%, 101-125%, 125%+
  Deal Type        | New Logo, Expansion, Renewal, Channel | Salesforce

Formulas:
  Attainment % = Bookings / Quota
  Payout Multiplier = IF Attainment % < 50% THEN 0
                      ELSE IF Attainment % < 100% THEN 1
                      ELSE 1.5
  Commission Earned = OTE x Variable % x Payout Multiplier x Attainment %

---

## DATA: src/data/financials.js

export const DATABRICKS_FINANCIALS = {
  currentARR: 5400,
  yoyGrowth: 65,
  employees: 11000,
  valuation: 134000,
  grossMargin: 80,
  ndr: 140,
  sqlARR: 1000,
  aiARR: 1000,
  millionDollarCustomers: 500,
  totalCustomers: 10000,
  hiringPlan2025: 3000,
  arrHistory: [
    { year: 'FY2022', arr: 404 },
    { year: 'FY2023', arr: 1500 },
    { year: 'FY2024', arr: 3000 },
    { year: 'FY2025', arr: 3700 },
    { year: 'FY2026', arr: 5400 },
  ]
};

## DATA: src/data/integrations.js

Export objects: DELTA_TABLES (6 schemas), ORCHESTRATION_JOBS (nightly + monthly),
INTEGRATION_PATTERNS (4 tab definitions), PIPELINE_HEALTH (last run, avg duration, SLA, 7-day status, oncall).

---

## BUILD INSTRUCTIONS

npm create vite@latest databricks-anaplan-architecture -- --template react
cd databricks-anaplan-architecture
npm install react-router-dom framer-motion recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Build all files per spec. Run npm run build and fix all errors. Run npm run dev to preview.

## QUALITY BAR

- Production-quality on every page — no placeholder content
- Four-ring landscape diagram with animated bidirectional teal arrows is the hero element
- Integration page is the technical flagship — treat it as such
- Data-rich tables with realistic Databricks-scale values throughout
- Mobile-responsive (tables scroll horizontally)
- 60fps animations throughout
- CFO/board-meeting presentation quality
