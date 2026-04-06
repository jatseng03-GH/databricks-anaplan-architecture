// ─── SPOKE MODEL SUMMARIES (for Home page cards & diagram) ─────────────────
export const SPOKE_MODELS = [
  {
    id: 'topline',
    path: '/topline',
    name: 'Topline Forecast',
    icon: 'TrendingUp',
    description: 'Driver-based ARR forecasting by product line, segment, and geography with NDR modeling.',
    modules: 8,
    lists: 6,
    keyOutput: '$5.4B ARR forecast',
    color: '#EE3D2C',
    angle: 270, // top
  },
  {
    id: 'headcount',
    path: '/headcount',
    name: 'Headcount Planning',
    icon: 'Users',
    description: 'Position-level headcount and fully-loaded compensation by department and level.',
    modules: 9,
    lists: 7,
    keyOutput: '~11K employee cost model',
    color: '#EE3D2C',
    angle: 330, // top-right
  },
  {
    id: 'non-headcount',
    path: '/non-headcount',
    name: 'Non-Headcount Opex',
    icon: 'Receipt',
    description: 'Driver-based non-people expense planning: SaaS, T&E, marketing, facilities, and D&A.',
    modules: 9,
    lists: 6,
    keyOutput: 'Opex by P&L category',
    color: '#EE3D2C',
    angle: 30, // right
  },
  {
    id: 'infrastructure',
    path: '/infrastructure',
    name: 'Infrastructure & COGS',
    icon: 'Server',
    description: 'Cloud cost modeling (AWS/Azure/GCP) tied to DBU consumption with gross margin analysis.',
    modules: 8,
    lists: 6,
    keyOutput: '~80% gross margin model',
    color: '#EE3D2C',
    angle: 90, // bottom-right
  },
  {
    id: 'equity',
    path: '/equity',
    name: 'Equity Compensation',
    icon: 'Percent',
    description: 'ASC 718 RSU/option expense by grant cohort, vesting schedule, and department.',
    modules: 7,
    lists: 5,
    keyOutput: 'GAAP vs Non-GAAP SBC bridge',
    color: '#EE3D2C',
    angle: 150, // bottom-left
  },
  {
    id: 'sales-ops',
    path: '/sales-ops',
    name: 'Sales Ops & Commissions',
    icon: 'BadgeDollarSign',
    description: 'Commission calculation, quota attainment modeling, and sales productivity analytics.',
    modules: 8,
    lists: 7,
    keyOutput: 'Commission accrual & OTE %',
    color: '#EE3D2C',
    angle: 210, // left
  },
];

// ─── HUB MODEL ──────────────────────────────────────────────────────────────
export const HUB_MODULES = [
  {
    name: 'ORG Hierarchy',
    type: 'Input',
    dimensions: 'Department × Level',
    lineItems: 'Dept Code, Parent Dept, Cost Center, Entity, Geo',
    formulas: [
      'Parent Dept = LOOKUP(Dept Code, ORG Hierarchy.Parent)',
      'Entity = LOOKUP(Cost Center, Cost Center Mapping.Entity)',
      'Geo Region = IF CONTAINS(Location, "US") THEN "Americas" ELSE IF CONTAINS(Location, "EU") THEN "EMEA" ELSE "APAC"',
    ],
  },
  {
    name: 'Time Settings',
    type: 'System',
    dimensions: 'Time',
    lineItems: 'Current Period, Fiscal Year Start, Planning Horizon',
    formulas: [
      'Current Period = CURRENTPERIODSTART()',
      'Planning Horizon = OFFSET(Current Period, 24, MONTH)',
      'Fiscal Year Start = IF MONTH(Current Period) >= 2 THEN DATE(YEAR(Current Period), 2, 1) ELSE DATE(YEAR(Current Period)-1, 2, 1)',
    ],
  },
  {
    name: 'Global Assumptions',
    type: 'Input',
    dimensions: 'Time × Version',
    lineItems: 'FX Rates, Merit %, Benefit Rate, Payroll Tax Rate, Bonus %',
    formulas: [
      'Loaded Cost Multiplier = 1 + Benefit Rate + Payroll Tax Rate',
      'Inflation Adjusted Rate = Base Rate × (1 + CPI Assumption)',
      'Effective Bonus % = IF Version = "Budget" THEN Target Bonus % ELSE Actual Bonus %',
    ],
  },
  {
    name: 'Position Master',
    type: 'Input',
    dimensions: 'Position × Time',
    lineItems: 'Job Level, Department, Location, Status, Filled/Open',
    formulas: [
      'Active Count = COUNTIF(Position.Status = "Active")',
      'Open Requisitions = COUNTIF(Position.Status = "Open" AND Position.Approved = TRUE)',
      'Filled Rate % = Active Count / (Active Count + Open Requisitions)',
    ],
  },
  {
    name: 'Scenario Config',
    type: 'Input',
    dimensions: 'Scenario',
    lineItems: 'Scenario Name, Weight, Active Flag',
    formulas: [
      'Weighted Outcome = SUM(Scenario.Weight × Scenario.Value) / SUM(Scenario.Weight)',
      'Active Scenarios = FILTER(Scenario, Active Flag = TRUE)',
    ],
  },
  {
    name: 'Version Management',
    type: 'Input',
    dimensions: 'Version',
    lineItems: 'Version Type, Lock Status, Owner, Last Updated',
    formulas: [
      'Is Locked = IF Lock Status = "Locked" THEN TRUE ELSE FALSE',
      'Days Since Update = DAYS(TODAY(), Last Updated)',
    ],
  },
  {
    name: 'Cost Center Mapping',
    type: 'Input',
    dimensions: 'Cost Center × Department',
    lineItems: 'CC Code, Name, Parent CC, Allocation Method, BU',
    formulas: [
      'BU Rollup = LOOKUP(Cost Center, Cost Center Mapping.BU)',
      'Allocated Amount = IF Allocation Method = "Headcount" THEN Total Cost × (Dept HC / Total HC) ELSE Total Cost × Allocation %',
    ],
  },
  {
    name: 'Entity Hierarchy',
    type: 'Input',
    dimensions: 'Legal Entity',
    lineItems: 'Entity Name, Country, Currency, Consolidation Level',
    formulas: [
      'Functional Currency Amount = Local Amount × FX Rate[Currency, Time]',
      'Consolidated Amount = SUMIF(Entity, Consolidation Level = "Operating", Functional Currency Amount)',
    ],
  },
];

export const HUB_LISTS = [
  {
    name: 'Department List',
    items: '~120',
    type: 'Numbered',
    source: 'Workday',
    usedIn: ['All models'],
    sampleItems: ['10100 – Engineering – Core Platform', '10200 – Engineering – Data Intelligence', '20100 – Product – AI/ML', '30100 – Sales – Enterprise Americas', '30200 – Sales – Enterprise EMEA', '40100 – Marketing – Demand Gen', '50100 – G&A – Finance', '50200 – G&A – Legal', '60100 – Field Engineering – Solutions', '60200 – Field Engineering – Professional Services'],
  },
  {
    name: 'Cost Center List',
    items: '~280',
    type: 'Numbered',
    source: 'NetSuite',
    usedIn: ['Headcount', 'Non-Headcount', 'Equity'],
    sampleItems: ['CC-1001 – Core Engineering', 'CC-1002 – Platform Reliability', 'CC-2001 – Product Management', 'CC-3001 – Enterprise Sales – US West', 'CC-3002 – Enterprise Sales – US East', 'CC-4001 – Corporate Marketing', 'CC-5001 – Finance', 'CC-5002 – Legal', 'CC-5003 – HR', 'CC-6001 – Solutions Engineering'],
  },
  {
    name: 'Legal Entity List',
    items: '~18',
    type: 'Text',
    source: 'Manual',
    usedIn: ['All models'],
    sampleItems: ['Databricks Inc. (US – Parent)', 'Databricks UK Ltd.', 'Databricks Germany GmbH', 'Databricks Netherlands B.V.', 'Databricks India Pvt. Ltd.', 'Databricks Singapore Pte. Ltd.', 'Databricks Canada Inc.', 'Databricks Australia Pty. Ltd.', 'Databricks Japan K.K.', 'Databricks Israel Ltd.'],
  },
  {
    name: 'Job Level List',
    items: 'L1–L8, Exec',
    type: 'Text',
    source: 'Manual',
    usedIn: ['Headcount', 'Equity'],
    sampleItems: ['IC1 – Associate', 'IC2 – Software Engineer II', 'IC3 – Senior Engineer', 'IC4 – Staff Engineer', 'IC5 – Senior Staff Engineer', 'IC6 – Principal Engineer', 'IC7 – Distinguished Engineer', 'IC8 – Fellow', 'M1 – Manager', 'M2 – Senior Manager', 'Dir – Director', 'VP – Vice President', 'SVP – Senior VP', 'C – C-Suite / Exec'],
  },
  {
    name: 'Location List',
    items: '~35 offices',
    type: 'Text',
    source: 'Workday',
    usedIn: ['Headcount'],
    sampleItems: ['San Francisco, CA (HQ)', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'London, UK', 'Amsterdam, NL', 'Berlin, DE', 'Bangalore, IN', 'Singapore', 'Tokyo, JP', 'Sydney, AU', 'Toronto, CA', 'Tel Aviv, IL', 'Dublin, IE', 'Paris, FR'],
  },
  {
    name: 'Version List',
    items: 'Budget, Q1–Q4 Fcst, LY Act',
    type: 'Text',
    source: 'Manual',
    usedIn: ['All models'],
    sampleItems: ['FY2026 Budget', 'FY2026 Q1 Forecast', 'FY2026 Q2 Forecast', 'FY2026 Q3 Forecast', 'FY2026 Q4 Forecast', 'FY2025 Actuals', 'FY2025 Budget', 'FY2025 Q4 Forecast', 'FY2027 Long Range Plan'],
  },
  {
    name: 'Scenario List',
    items: 'Base, Upside, Downside',
    type: 'Text',
    source: 'Manual',
    usedIn: ['Topline', 'Headcount'],
    sampleItems: ['Base Case (60% weight)', 'Upside Case (20% weight)', 'Downside Case (20% weight)', 'Management Case', 'Board Case'],
  },
  {
    name: 'Time Periods',
    items: 'Month (FY2024–FY2026)',
    type: 'Time',
    source: 'System',
    usedIn: ['All models'],
    sampleItems: ['Feb 2024 (FY2025 M01)', 'Mar 2024 (FY2025 M02)', '... 36 monthly periods ...', 'Jan 2026 (FY2026 M12)', 'FY2025 H1', 'FY2025 Q1', 'FY2026 Full Year'],
  },
  {
    name: 'Product Line List',
    items: 'Data+AI, SQL, ML, Other',
    type: 'Text',
    source: 'Manual',
    usedIn: ['Topline', 'Infrastructure'],
    sampleItems: ['Data Intelligence Platform', 'Databricks SQL (Lakehouse)', 'AI/ML & Mosaic', 'Delta Sharing & Marketplace', 'Professional Services', 'Support & Training'],
  },
];

// ─── TOPLINE FORECAST ────────────────────────────────────────────────────────
export const TOPLINE_MODULES = [
  {
    name: 'Revenue Assumptions',
    type: 'Input',
    dimensions: 'Product × Segment × Time',
    lineItems: 'New Logo ACV, Expansion Rate %, Churn Rate %, Contraction Rate %',
    formulas: [
      'Net Expansion Rate = Expansion Rate % - Contraction Rate % - Churn Rate %',
      'Implied NRR = 1 + Net Expansion Rate',
      'Blended ACV = SUMPRODUCT(Segment Weight, Avg ACV by Segment)',
    ],
  },
  {
    name: 'Customer Cohort',
    type: 'Calc',
    dimensions: 'Cohort × Time',
    lineItems: 'Beg Customers, New Logos, Churned, Net Customers, Avg ACV',
    formulas: [
      'Net Customers = Beg Customers + New Logos - Churned',
      'Avg ACV = MEAN(ACV across cohort customers)',
      'Cohort ARR = Net Customers × Avg ACV',
    ],
  },
  {
    name: 'ARR Build',
    type: 'Calc',
    dimensions: 'Product × Segment × Time',
    lineItems: 'Beg ARR, New Biz ARR, Expansion ARR, Contraction ARR, Churn ARR, End ARR',
    formulas: [
      'End ARR = Beg ARR + New Business ARR + Expansion ARR - Contraction ARR - Churn ARR',
      'Net New ARR = End ARR - Beg ARR',
      'ARR Growth % = Net New ARR / Beg ARR',
    ],
  },
  {
    name: 'Net Dollar Retention',
    type: 'Calc',
    dimensions: 'Segment × Time',
    lineItems: 'Beg ARR (ex-churn cohort), Expansion, Contraction, Churn, NDR %',
    formulas: [
      'NDR % = (Beg ARR + Expansion ARR - Contraction ARR - Churn ARR) / Beg ARR',
      'Gross Retention % = (Beg ARR - Churn ARR) / Beg ARR',
      'Logo Churn % = Churned Customers / Beg Customer Count',
    ],
  },
  {
    name: 'Revenue Recognition',
    type: 'Calc',
    dimensions: 'Product × Time',
    lineItems: 'ARR, ACV, GAAP Revenue, Deferred Revenue, Billings',
    formulas: [
      'Monthly GAAP Revenue = ARR / 12',
      'Billings = GAAP Revenue + Change in Deferred Revenue',
      'Deferred Revenue Balance = Prior Balance + Billings - Revenue Recognized',
    ],
  },
  {
    name: 'Geo Split',
    type: 'Calc',
    dimensions: 'Geography × Product × Time',
    lineItems: 'Americas ARR, EMEA ARR, APAC ARR, % of Total',
    formulas: [
      'Americas % = Americas ARR / Total ARR',
      'EMEA ARR = Total ARR × EMEA Mix Assumption[Time]',
      'YoY Geo Growth % = (Current ARR - Prior Year ARR) / Prior Year ARR',
    ],
  },
  {
    name: 'Bookings Bridge',
    type: 'Calc',
    dimensions: 'Segment × Time',
    lineItems: 'New Logos, Upsell, Renewal, Total Bookings, Booking vs Plan $',
    formulas: [
      'Total Bookings = New Logo Bookings + Upsell Bookings + Renewal Bookings',
      'Bookings vs Plan = Total Bookings - Budget Bookings',
      'Upsell % of Total = Upsell Bookings / Total Bookings',
    ],
  },
  {
    name: 'Revenue Summary',
    type: 'Output',
    dimensions: 'Product × Time',
    lineItems: 'Total ARR, Total GAAP Revenue, QoQ Growth, YoY Growth, vs Plan %',
    formulas: [
      'QoQ ARR Growth % = (Current Quarter End ARR - Prior Quarter End ARR) / Prior Quarter End ARR',
      'YoY ARR Growth % = (Current Period ARR - Prior Year Period ARR) / Prior Year Period ARR',
      'vs Plan % = (Forecast ARR - Budget ARR) / Budget ARR',
    ],
  },
];

export const TOPLINE_LISTS = [
  { name: 'Product Line', items: 'Data Intelligence Platform, SQL, AI/ML, Marketplace', source: 'Manual', sampleItems: ['Data Intelligence Platform', 'Databricks SQL (Lakehouse)', 'AI/ML & Mosaic', 'Delta Sharing & Marketplace'] },
  { name: 'Customer Segment', items: 'Enterprise, Mid-Market, SMB, Strategic', source: 'Manual', sampleItems: ['Strategic (>$5M ACV)', 'Enterprise (>$1M ACV)', 'Mid-Market ($100K–$1M ACV)', 'SMB (<$100K ACV)', 'Partner-Led'] },
  { name: 'Geography', items: 'Americas, EMEA, APAC', source: 'Hub', sampleItems: ['Americas', 'EMEA', 'APAC', 'Global / Multi-Region'] },
  { name: 'Revenue Type', items: 'New Business, Expansion, Contraction, Churn, Renewal', source: 'Manual', sampleItems: ['New Business', 'Expansion', 'Contraction', 'Churn', 'Renewal'] },
  { name: 'Customer Cohort', items: 'Rolling 24-month cohort buckets', source: 'Calculated', sampleItems: ['Cohort Feb-2024', 'Cohort Mar-2024', '... 24 rolling cohort buckets ...', 'Cohort Jan-2026'] },
  { name: 'Booking Type', items: 'Direct, Channel, Marketplace', source: 'Manual', sampleItems: ['Direct – Field Sales', 'Channel – Partner', 'Marketplace – AWS', 'Marketplace – Azure', 'Self-Serve / PLG'] },
];

// ─── HEADCOUNT PLANNING ──────────────────────────────────────────────────────
export const HEADCOUNT_MODULES = [
  {
    name: 'HC Assumptions',
    type: 'Input',
    dimensions: 'Level × Geo × Time',
    lineItems: 'Base Salary, Bonus Target %, Benefits Load %, Payroll Tax %, Recruiting Cost',
    formulas: [
      'Total Loaded Cost = Base Salary × (1 + Bonus Target % + Benefits Load % + Payroll Tax %)',
      'Recruiting Cost = New Hires × Avg Recruiting Cost per Level',
      'Benefits Load = Base Salary × Benefits Load %[Level, Geo]',
    ],
  },
  {
    name: 'Position Plan',
    type: 'Input',
    dimensions: 'Position × Time',
    lineItems: 'Job Title, Level, Dept, Geo, Status (Active/Open/Approved), Start Month, End Month',
    formulas: [
      'Is Active = IF Status = "Active" AND Start Month <= Current Month AND (ISBLANK(End Month) OR End Month > Current Month) THEN 1 ELSE 0',
      'Months in Period = IF Is Active = 1 THEN 1 ELSE 0',
      'Pro-Rated Salary = Annual Salary / 12 × Months in Period',
    ],
  },
  {
    name: 'New Hire Schedule',
    type: 'Input',
    dimensions: 'Department × Time',
    lineItems: 'Approved New Hires, Expected Start Month, Backfill Flag, Req ID',
    formulas: [
      'Cumulative New Hires = CUMSUM(Approved New Hires[Department, Time])',
      'Ramp Period Cost = New Hire Salary × Ramp % by Month',
      'Backfill Rate = COUNTIF(Backfill Flag = TRUE) / Total New Hires',
    ],
  },
  {
    name: 'Attrition Model',
    type: 'Calc',
    dimensions: 'Department × Level × Time',
    lineItems: 'Beg HC, Voluntary Attrition, Involuntary, Total Attrition, Attrition Rate %',
    formulas: [
      'Total Attrition = Voluntary Attrition + Involuntary Attrition',
      'Attrition Rate % = Total Attrition / TIMESUM(Avg Headcount, YEAR)',
      'Voluntary Attrition = Avg Headcount × Voluntary Rate Assumption[Level, Time]',
    ],
  },
  {
    name: 'HC Summary',
    type: 'Calc',
    dimensions: 'Department × Time',
    lineItems: 'Beg Headcount, New Hires, Attrition, Transfers, End Headcount, Avg Headcount',
    formulas: [
      'End Headcount = Beg Headcount + New Hires - Attrition - Transfers Out + Transfers In',
      'Avg Headcount = (Beg Headcount + End Headcount) / 2',
      'Attrition Rate % = Attrition / TIMESUM(Avg Headcount, YEAR)',
    ],
  },
  {
    name: 'Comp & Benefits',
    type: 'Calc',
    dimensions: 'Position × Time',
    lineItems: 'Base Salary, Bonus, Benefits, Payroll Tax, Total Cash Comp, Loaded Cost',
    formulas: [
      'Total Cash Comp = Base Salary + Bonus',
      'Loaded Cost = Total Cash Comp + Benefits + Payroll Tax + Recruiting Cost',
      'Effective Bonus = Base Salary × Bonus Target % × Attainment Factor',
    ],
  },
  {
    name: 'Recruiting Costs',
    type: 'Calc',
    dimensions: 'Department × Time',
    lineItems: 'New Hires, Avg Recruiting Cost, Total Recruiting, Agency vs Internal',
    formulas: [
      'Total Recruiting = Agency Hires × Agency Fee + Internal Hires × Internal Cost',
      'Agency % = Agency Hires / Total New Hires',
      'Cost per Hire = Total Recruiting / Total New Hires',
    ],
  },
  {
    name: 'HC by Function',
    type: 'Output',
    dimensions: 'Function × Time',
    lineItems: 'Eng & Product, G&A, Sales & Mktg, Field Eng, Total, % of Total',
    formulas: [
      'Eng % of Total = Engineering HC / Total HC',
      'GTM Ratio = (Sales + Marketing + Field Eng HC) / Total HC',
      'R&D Ratio = (Engineering + Product HC) / Total HC',
    ],
  },
  {
    name: 'HC Expense Summary',
    type: 'Output',
    dimensions: 'Cost Center × Time',
    lineItems: 'Salaries, Bonus, Benefits, Payroll Tax, Recruiting, Total People Cost',
    formulas: [
      'Total People Cost = Salaries + Bonus + Benefits + Payroll Tax + Recruiting',
      'People Cost per Employee = Total People Cost / Avg Headcount',
      'vs Budget = Total People Cost - Budget People Cost',
    ],
  },
];

export const HEADCOUNT_LISTS = [
  { name: 'Position List', items: 'All active + approved positions (~11K+)', source: 'Workday', sampleItems: ['POS-001234 – Sr. Software Engineer, Core Platform', 'POS-001235 – Staff Engineer, Data Intelligence', 'POS-002100 – Product Manager, AI/ML', 'POS-003001 – Enterprise Account Executive, US West', '... ~11,000+ positions ...'] },
  { name: 'Job Level', items: 'IC1–IC8, M1–M5, Dir, VP, SVP, C-Suite', source: 'Manual', sampleItems: ['IC1 – Associate', 'IC2 – SWE II / Analyst II', 'IC3 – Senior SWE / Senior', 'IC4 – Staff / Lead', 'IC5 – Senior Staff', 'IC6 – Principal', 'IC7 – Distinguished', 'IC8 – Fellow', 'M1 – Manager', 'M2 – Senior Manager', 'Dir – Director', 'VP – VP', 'SVP – SVP', 'C – Executive'] },
  { name: 'Function', items: 'Engineering, Product, Sales, Field Eng, G&A, Marketing', source: 'Hub', sampleItems: ['Engineering & Product', 'Sales & Business Development', 'Field Engineering', 'Marketing', 'General & Administrative', 'Finance & Accounting', 'Legal & Compliance', 'Human Resources'] },
  { name: 'Employment Type', items: 'Full-Time, Part-Time, Contractor', source: 'Workday', sampleItems: ['Full-Time Employee', 'Part-Time Employee', 'Contractor – Staff Aug', 'Contractor – Independent', 'Intern'] },
  { name: 'Hire Type', items: 'New, Backfill, Conversion', source: 'Manual', sampleItems: ['New Headcount', 'Backfill – Voluntary Attrition', 'Backfill – Involuntary', 'Contractor Conversion', 'Internal Transfer'] },
  { name: 'Attrition Type', items: 'Voluntary, Involuntary, Retirement', source: 'Manual', sampleItems: ['Voluntary – Resignation', 'Involuntary – Performance', 'Involuntary – Reduction in Force', 'Retirement', 'End of Contract'] },
  { name: 'Office Location', items: 'SF HQ, NYC, Seattle, London, Amsterdam, Bangalore, +30', source: 'Hub', sampleItems: ['San Francisco, CA (HQ)', 'New York, NY', 'Seattle, WA', 'London, UK', 'Amsterdam, NL', 'Bangalore, IN', 'Singapore', 'Tokyo, JP', 'Berlin, DE', 'Austin, TX', 'Boston, MA', 'Dublin, IE'] },
];

// ─── NON-HEADCOUNT OPEX ──────────────────────────────────────────────────────
export const NONHC_MODULES = [
  {
    name: 'Opex Assumptions',
    type: 'Input',
    dimensions: 'Category × Department × Time',
    lineItems: 'Per-HC Rate, Growth Rate %, Seasonal Index, Inflation Assumption',
    formulas: [
      'Per-HC Opex = Avg Headcount × Per-HC Rate[Category, Dept]',
      'Inflation Adjusted Spend = Prior Year Spend × (1 + Inflation Assumption)',
      'Seasonal Phasing = Annual Budget × Seasonal Index[Month] / SUM(Seasonal Index, YEAR)',
    ],
  },
  {
    name: 'Software & SaaS',
    type: 'Input',
    dimensions: 'Vendor × Department × Time',
    lineItems: 'Contract Value, Start Date, End Date, Auto-Renew, Monthly Amort',
    formulas: [
      'Monthly Amortization = Contract Value / Contract Term Months',
      'Remaining Contract Value = Contract Value - Cumulative Amortization',
      'Renewal Risk Flag = IF Days Until Expiry < 90 THEN "At Risk" ELSE "Active"',
    ],
  },
  {
    name: 'T&E Budget',
    type: 'Input',
    dimensions: 'Department × Time',
    lineItems: 'T&E per HC, Events Budget, Field Budget, Conference Budget',
    formulas: [
      'T&E Budget = Avg Headcount × T&E per HC Rate[Dept, Season]',
      'Field Budget = Field HC × Field T&E Rate',
      'Total T&E = T&E Budget + Events Budget + Conference Budget',
    ],
  },
  {
    name: 'Marketing Programs',
    type: 'Input',
    dimensions: 'Program × Time',
    lineItems: 'Program Name, Owner, Budget, Phasing, Expected Pipeline $',
    formulas: [
      'Monthly Spend = Annual Budget × Program Phasing %[Month]',
      'Pipeline ROI = Expected Pipeline $ / Program Budget',
      'CPL (Cost per Lead) = Program Budget / Expected Leads',
    ],
  },
  {
    name: 'Professional Services',
    type: 'Input',
    dimensions: 'Vendor × Department × Time',
    lineItems: 'Engagement Type, Monthly Spend, SOW Value, Remaining',
    formulas: [
      'SOW Remaining = SOW Value - Cumulative Invoiced',
      'Monthly Run Rate = SOW Value / Engagement Duration Months',
      'Accrued Not Invoiced = Monthly Run Rate × Months Elapsed - Cumulative Invoiced',
    ],
  },
  {
    name: 'Facilities',
    type: 'Input',
    dimensions: 'Office × Time',
    lineItems: 'Lease Cost, Utilities, Office Ops, Seating Capacity, Cost per Seat',
    formulas: [
      'Cost per Seat = (Lease Cost + Utilities + Office Ops) / Seating Capacity',
      'Utilization Rate = Avg Daily Occupancy / Seating Capacity',
      'Lease Escalation = Prior Year Lease × (1 + Escalation %)',
    ],
  },
  {
    name: 'Depreciation',
    type: 'Calc',
    dimensions: 'Asset × Time',
    lineItems: 'Asset Type, Cost Basis, Useful Life, Monthly Depr, Accumulated',
    formulas: [
      'Monthly Depreciation = Cost Basis / (Useful Life × 12)',
      'Accumulated Depreciation = CUMSUM(Monthly Depreciation)',
      'Net Book Value = Cost Basis - Accumulated Depreciation',
    ],
  },
  {
    name: 'Opex Summary',
    type: 'Calc',
    dimensions: 'Category × Department × Time',
    lineItems: 'Actual, Budget, Forecast, Variance $, Variance %',
    formulas: [
      'Variance $ = Forecast - Budget',
      'Variance % = Variance $ / Budget',
      'Full Year Estimate = YTD Actual + Remaining Forecast',
    ],
  },
  {
    name: 'Opex by P&L Line',
    type: 'Output',
    dimensions: 'P&L Category × Time',
    lineItems: 'Sales & Marketing, R&D, G&A, Total Opex, % of Revenue',
    formulas: [
      'S&M % of Revenue = Sales & Marketing Opex / Total Revenue',
      'R&D % of Revenue = R&D Opex / Total Revenue',
      'Total Opex % = Total Opex / Total Revenue',
    ],
  },
];

export const NONHC_LISTS = [
  { name: 'Opex Category', items: 'Software/SaaS, T&E, Mktg Programs, Prof Svcs, Facilities, D&A', source: 'Manual', sampleItems: ['Software & SaaS Licenses', 'Travel & Entertainment', 'Marketing Programs & Events', 'Professional Services', 'Facilities & Real Estate', 'Depreciation & Amortization', 'Other Opex'] },
  { name: 'Vendor List', items: 'Top 50 vendors by spend', source: 'NetSuite', sampleItems: ['Salesforce (CRM)', 'Workday (HRIS)', 'AWS (Non-COGS)', 'Google Workspace', 'Zoom Video', 'ServiceNow', 'Okta', 'Snowflake', 'GitHub (Copilot)', 'Slack / Salesforce', 'Tableau / Salesforce', 'Carta (Cap Table)', 'Navan (T&E)', 'Concord (Contracts)', 'Ironclad'] },
  { name: 'P&L Category', items: 'Sales & Marketing, Research & Development, G&A', source: 'Manual', sampleItems: ['Sales & Marketing', 'Research & Development', 'General & Administrative', 'Cost of Revenue (Opex)'] },
  { name: 'Program List', items: 'All active marketing programs', source: 'Marketing', sampleItems: ['Data + AI Summit 2025', 'Paid Search – Google', 'Field Events – Americas', 'Field Events – EMEA', 'Content Syndication', 'Partner Co-Marketing', 'Databricks University', 'Community & Open Source', 'Analyst Relations'] },
  { name: 'Asset Type', items: 'Hardware, Leasehold, Intangible, ROU Asset', source: 'Manual', sampleItems: ['Computer Hardware', 'Leasehold Improvements', 'Internally Developed Software', 'Right-of-Use (Operating Lease)', 'Right-of-Use (Finance Lease)', 'Purchased Intangibles'] },
  { name: 'Office List', items: 'All leased office locations', source: 'Manual', sampleItems: ['225 Fremont St, San Francisco (HQ)', '680 Folsom St, San Francisco', '111 W 33rd St, New York', '605 3rd Ave, New York', 'Plantation Wharf, London', 'Keizersgracht, Amsterdam', 'WeWork Bangalore', 'WeWork Singapore', 'Shinjuku, Tokyo'] },
];

// ─── INFRASTRUCTURE & COGS ───────────────────────────────────────────────────
export const INFRA_MODULES = [
  {
    name: 'Cloud Assumptions',
    type: 'Input',
    dimensions: 'Cloud Provider × Product × Time',
    lineItems: 'Cost per DBU, Storage Cost/TB, Egress Cost/TB, Support % of Revenue',
    formulas: [
      'Effective Cost per DBU = Compute Cost / DBU Volume',
      'Storage Cost = Data Volume (TB) × Storage Rate / 12',
      'Support Cost = Revenue × Support % of Revenue Assumption',
    ],
  },
  {
    name: 'DBU Consumption Plan',
    type: 'Input',
    dimensions: 'Product × Customer Segment × Time',
    lineItems: 'DBU Volume, YoY Growth %, Seasonal Factor, Price per DBU',
    formulas: [
      'DBU Volume = Prior Period DBU × (1 + YoY Growth %) × Seasonal Factor',
      'Compute Revenue = DBU Volume × Price per DBU',
      'DBU Efficiency = Revenue per DBU / Cost per DBU',
    ],
  },
  {
    name: 'Cloud Cost by Provider',
    type: 'Calc',
    dimensions: 'Provider × Product × Time',
    lineItems: 'Compute Cost, Storage Cost, Egress, Support, Total Cloud COGS',
    formulas: [
      'Total Cloud COGS = Compute Cost + Storage Cost + Egress + Support',
      'AWS % of Cloud COGS = AWS Cloud COGS / Total Cloud COGS',
      'Cloud Cost Growth % = (Current COGS - Prior Year COGS) / Prior Year COGS',
    ],
  },
  {
    name: 'COGS Build',
    type: 'Calc',
    dimensions: 'Product × Time',
    lineItems: 'Cloud COGS, Hosting, Depreciation, Ops Labor, Total COGS',
    formulas: [
      'Total COGS = Cloud COGS + Hosting + Depreciation + Ops Labor',
      'COGS as % of Revenue = Total COGS / Revenue',
      'Ops Labor COGS = COGS-Allocated Headcount × Loaded Cost',
    ],
  },
  {
    name: 'Gross Margin',
    type: 'Calc',
    dimensions: 'Product × Time',
    lineItems: 'Revenue, COGS, Gross Profit, Gross Margin %, vs Plan, vs Prior Year',
    formulas: [
      'Gross Profit = Revenue - Total COGS',
      'Gross Margin % = Gross Profit / Revenue',
      'Cost per DBU = Total Cloud COGS / DBU Volume',
    ],
  },
  {
    name: 'Unit Economics',
    type: 'Calc',
    dimensions: 'Product × Segment × Time',
    lineItems: 'Revenue per DBU, Cost per DBU, Contribution Margin, Payback Period',
    formulas: [
      'Contribution Margin = Revenue per DBU - Variable Cost per DBU',
      'Contribution Margin % = Contribution Margin / Revenue per DBU',
      'Customer Payback Period = CAC / (ACV × Gross Margin %)',
    ],
  },
  {
    name: 'FinOps Tracking',
    type: 'Calc',
    dimensions: 'Initiative × Time',
    lineItems: 'Initiative Name, Target Savings, Realized Savings, Owner, Status',
    formulas: [
      'Savings Realization % = Realized Savings / Target Savings',
      'Cumulative Savings = CUMSUM(Realized Savings[Initiative, Time])',
      'Annualized Savings Run Rate = Last Month Savings × 12',
    ],
  },
  {
    name: 'COGS Summary',
    type: 'Output',
    dimensions: 'Time',
    lineItems: 'Total COGS, Total Revenue, Gross Profit, Blended GM%, Target GM%',
    formulas: [
      'Blended GM% = SUM(Product GP) / SUM(Product Revenue)',
      'GM% vs Target = Blended GM% - Target GM%',
      'Infrastructure Efficiency = Total COGS / Total Revenue',
    ],
  },
];

export const INFRA_LISTS = [
  { name: 'Cloud Provider', items: 'AWS, Azure, GCP', source: 'Manual', sampleItems: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)'] },
  { name: 'Product Line', items: '(from Hub)', source: 'Hub', sampleItems: ['Data Intelligence Platform', 'Databricks SQL', 'AI/ML & Mosaic', 'Marketplace', 'Professional Services'] },
  { name: 'COGS Category', items: 'Compute, Storage, Egress, Support, Other', source: 'Manual', sampleItems: ['Compute (EC2/VMs)', 'Storage (S3/Blob/GCS)', 'Data Egress', 'Premium Support', 'Networking', 'Managed Services', 'Third-Party Licenses'] },
  { name: 'Region', items: 'us-east-1, us-west-2, eu-west-1, +6', source: 'AWS Cost Explorer', sampleItems: ['us-east-1 (N. Virginia)', 'us-west-2 (Oregon)', 'eu-west-1 (Ireland)', 'eu-central-1 (Frankfurt)', 'ap-southeast-1 (Singapore)', 'ap-northeast-1 (Tokyo)', 'ca-central-1 (Canada)', 'sa-east-1 (São Paulo)', 'ap-south-1 (Mumbai)'] },
  { name: 'FinOps Initiative', items: 'All active cost reduction programs', source: 'Manual', sampleItems: ['Reserved Instance / Savings Plans – AWS', 'Committed Use Discounts – GCP', 'Azure Hybrid Benefit', 'Storage Tiering Optimization', 'Idle Resource Cleanup', 'Spot Instance Migration', 'DBU Efficiency Improvement Q1', 'Egress Reduction via CDN'] },
  { name: 'Cost Center (COGS)', items: 'COGS-specific cost centers', source: 'Hub', sampleItems: ['CC-COGS-001 – Platform Operations', 'CC-COGS-002 – SRE / Infrastructure Eng', 'CC-COGS-003 – Cloud FinOps', 'CC-COGS-004 – Customer Support (COGS)', 'CC-COGS-005 – Professional Services COGS'] },
];

// ─── EQUITY COMPENSATION ─────────────────────────────────────────────────────
export const EQUITY_MODULES = [
  {
    name: 'Grant Assumptions',
    type: 'Input',
    dimensions: 'Grant Type × Level × Time',
    lineItems: 'Grant Size (shares), FMV at Grant, Vesting Schedule, Cliff Period',
    formulas: [
      'Total Grant Value = Shares Granted × FMV at Grant Date',
      'Annual Vest Value = Total Grant Value / Vesting Years',
      'Cliff Vest Amount = Total Grant Value × Cliff Vest %',
    ],
  },
  {
    name: 'RSU Grant Plan',
    type: 'Input',
    dimensions: 'Grant Cohort × Time',
    lineItems: 'Grant Date, Shares, FMV, Recipient Level, Department, Vesting Start',
    formulas: [
      'Grant FMV = Shares × FMV at Grant Date',
      'Monthly Expense Rate = Grant FMV / (Vesting Months - Cliff Months)',
      'Forfeiture Adjustment = Grant FMV × Expected Forfeiture Rate',
    ],
  },
  {
    name: 'Vesting Schedule',
    type: 'Calc',
    dimensions: 'Grant × Time',
    lineItems: 'Vested Shares, Unvested Shares, Cumulative Vested %, Monthly Vest $',
    formulas: [
      'Cumulative Vested % = IF Month >= Cliff Month THEN MIN((Month - Grant Month) / Vest Months, 1) ELSE 0',
      'Vested Shares = Total Shares × Cumulative Vested %',
      'Monthly Vest $ = Vested Shares × FMV at Grant',
    ],
  },
  {
    name: 'SBC Expense',
    type: 'Calc',
    dimensions: 'Grant Cohort × Department × Time',
    lineItems: 'Monthly SBC Expense, Cumulative Expense, Unamortized Balance, Grant Date FMV',
    formulas: [
      'Monthly SBC Expense = Grant FMV / Vesting Months',
      'Unamortized Balance = Total Grant FMV - Cumulative SBC Expense',
      'SBC % of Revenue = SUM(All Departments, Monthly SBC) / Revenue',
    ],
  },
  {
    name: 'New Grant Projection',
    type: 'Input',
    dimensions: 'Department × Level × Time',
    lineItems: 'Projected New Grants, Expected FMV, Attrition Forfeitures, Net Expense',
    formulas: [
      'Net New SBC = Projected New Grants × Expected FMV / Vesting Months',
      'Forfeiture Benefit = Unvested Balance × Forfeiture Rate',
      'Net SBC Expense = New SBC + Existing SBC - Forfeiture Benefit',
    ],
  },
  {
    name: 'SBC by Function',
    type: 'Output',
    dimensions: 'Function × Time',
    lineItems: 'Eng & Product SBC, G&A SBC, Sales SBC, Total SBC, SBC as % of Revenue',
    formulas: [
      'SBC % Revenue = Total SBC / Revenue',
      'Eng % of Total SBC = Engineering SBC / Total SBC',
      'SBC per Employee = Total SBC / Avg Headcount',
    ],
  },
  {
    name: 'GAAP vs Non-GAAP',
    type: 'Output',
    dimensions: 'P&L Line × Time',
    lineItems: 'GAAP Expense, SBC Addback, Non-GAAP Expense, by Dept and Total',
    formulas: [
      'Non-GAAP OpEx = GAAP OpEx - SBC Expense - Amortization of Intangibles',
      'Non-GAAP Gross Margin % = (Revenue - COGS + COGS SBC) / Revenue',
      'Non-GAAP Operating Income = GAAP Op Income + SBC + D&A of Acquired Intangibles',
    ],
  },
];

export const EQUITY_LISTS = [
  { name: 'Grant Type', items: 'RSU, ISO, NSO, Performance RSU, ESPP', source: 'Carta', sampleItems: ['Restricted Stock Units (RSU)', 'Incentive Stock Options (ISO)', 'Non-Qualified Stock Options (NSO)', 'Performance-Based RSU (PRSU)', 'Employee Stock Purchase Plan (ESPP)'] },
  { name: 'Vesting Schedule', items: '4yr/1yr cliff, 4yr monthly, 2yr monthly, Custom', source: 'Manual', sampleItems: ['4-Year / 1-Year Cliff (Standard)', '4-Year Monthly (No Cliff)', '2-Year Monthly (Refresh)', 'Single Vest (Special)', '3-Year Monthly', 'Custom Executive Schedule'] },
  { name: 'Grant Cohort', items: 'Rolling cohorts by grant date (monthly buckets)', source: 'Carta', sampleItems: ['Grant Cohort – Feb 2022 (IPO Refresh)', 'Grant Cohort – Aug 2022', 'Grant Cohort – Feb 2023', '... rolling monthly cohort buckets ...', 'Grant Cohort – Jan 2026'] },
  { name: 'Dept (Equity)', items: '(from Hub function list)', source: 'Hub', sampleItems: ['Engineering & Product', 'Sales & BD', 'Field Engineering', 'Marketing', 'G&A', 'Finance', 'Legal'] },
  { name: 'Expense Category', items: 'COGS, Sales & Mktg, R&D, G&A (for SBC allocation)', source: 'Manual', sampleItems: ['Cost of Revenue (COGS SBC)', 'Sales & Marketing SBC', 'Research & Development SBC', 'General & Administrative SBC'] },
];

// ─── SALES OPS & COMMISSIONS ─────────────────────────────────────────────────
export const SALESOPS_MODULES = [
  {
    name: 'Comp Plan Assumptions',
    type: 'Input',
    dimensions: 'Role × Time',
    lineItems: 'On-Target Earnings, Base/Variable Split, Accelerator Thresholds, Clawback Rules',
    formulas: [
      'Variable Pay at Target = OTE × Variable %',
      'Accelerated Variable = Variable Pay at Target × Accelerator Multiplier',
      'Effective Commission Rate = Commission Earned / Total Bookings',
    ],
  },
  {
    name: 'Quota Plan',
    type: 'Input',
    dimensions: 'Rep × Time',
    lineItems: 'Annual Quota, Monthly Phasing %, Territory, Segment, Product Overlay',
    formulas: [
      'Monthly Quota = Annual Quota × Monthly Phasing %[Month]',
      'Cumulative Quota = CUMSUM(Monthly Quota[Rep, Time])',
      'Territory Quota Coverage = Sum of Rep Quotas / Territory Target',
    ],
  },
  {
    name: 'Bookings Actuals',
    type: 'Input',
    dimensions: 'Rep × Deal × Time',
    lineItems: 'Deal Name, Close Date, ACV, Product, Segment, New/Expansion',
    formulas: [
      'Total Bookings = SUM(ACV across closed deals in period)',
      'New Logo % = New Logo ACV / Total Bookings',
      'Avg Deal Size = Total Bookings / Deal Count',
    ],
  },
  {
    name: 'Attainment Calc',
    type: 'Calc',
    dimensions: 'Rep × Time',
    lineItems: 'Quota, Bookings, Attainment %, Payout Multiplier, Commission Earned',
    formulas: [
      'Attainment % = Bookings / Quota',
      'Payout Multiplier = IF Attainment % < 50% THEN 0 ELSE IF Attainment % < 100% THEN 1 ELSE 1.5',
      'Commission Earned = OTE × Variable % × Payout Multiplier × Attainment %',
    ],
  },
  {
    name: 'Commission Accrual',
    type: 'Calc',
    dimensions: 'Department × Time',
    lineItems: 'Earned Commissions, Draws, Recoveries, Net Accrual, Cash vs Accrual Timing',
    formulas: [
      'Net Accrual = Earned Commissions - Draws - Recoveries',
      'Accrual vs Cash Timing Diff = Accrued Commission - Cash Paid Commission',
      'Recoverable Balance = Cumulative Draws - Cumulative Commission Earned',
    ],
  },
  {
    name: 'Sales Productivity',
    type: 'Calc',
    dimensions: 'Segment × Time',
    lineItems: 'Reps (Quota Carrying), Avg Quota, Avg Attainment, Revenue per Rep, Ramp % HC',
    formulas: [
      'ARR per Rep = Total ARR / Quota-Carrying Reps',
      'Avg Quota Attainment = MEAN(Attainment % across all reps)',
      'Ramp Rate = Ramping HC / Total Quota-Carrying HC',
    ],
  },
  {
    name: 'Territory Model',
    type: 'Input',
    dimensions: 'Territory × Time',
    lineItems: 'Territory Name, Region, Segment, # Accounts, Assigned AE, Whitespace $',
    formulas: [
      'Whitespace Coverage = Whitespace $ / (# Accounts × Avg Industry Spend)',
      'Territory Quota = # Accounts × Avg ACV Assumption × Penetration Rate',
      'Accounts per Rep = # Accounts / Assigned AEs',
    ],
  },
  {
    name: 'Commission Summary',
    type: 'Output',
    dimensions: 'Role × Time',
    lineItems: 'Total Commission $, OTE %, Commission as % of Bookings, vs Budget',
    formulas: [
      'Commission as % of Bookings = Total Commission / Total Bookings',
      'OTE Attainment % = Total Commission Earned / Total OTE',
      'Commission Expense vs Budget = Actual Commission - Budget Commission',
    ],
  },
];

export const SALESOPS_LISTS = [
  { name: 'Sales Role', items: 'Enterprise AE, MM AE, SDR, Solutions Engineer, CSM, Partner', source: 'Manual', sampleItems: ['Enterprise Account Executive (>$1M ACV)', 'Mid-Market Account Executive', 'Sales Development Rep (SDR)', 'Solutions Engineer / SE', 'Customer Success Manager (CSM)', 'Partner Sales Manager', 'Sales Manager', 'Regional VP of Sales'] },
  { name: 'Sales Rep List', items: 'All quota-carrying reps (~400+)', source: 'Salesforce', sampleItems: ['Rep-0001 – Enterprise AE, US West', 'Rep-0002 – Enterprise AE, US East', 'Rep-0003 – MM AE, US West', '... ~400+ quota-carrying reps ...', 'Rep-0400 – APAC Enterprise AE'] },
  { name: 'Territory', items: 'All sales territories by region and segment', source: 'Sales Ops', sampleItems: ['US West – Enterprise – Tech & Media', 'US West – Enterprise – FSI', 'US East – Enterprise – Retail & CPG', 'EMEA – UK & Ireland Enterprise', 'EMEA – DACH Enterprise', 'EMEA – Nordics', 'APAC – ANZ', 'APAC – Japan', 'Americas – Mid-Market Pod 1'] },
  { name: 'Comp Plan', items: 'All active compensation plans by role and year', source: 'Manual', sampleItems: ['FY2026 – Enterprise AE Plan', 'FY2026 – MM AE Plan', 'FY2026 – SDR Plan', 'FY2026 – SE Overlay Plan', 'FY2026 – CSM Plan', 'FY2026 – Partner Sales Plan', 'FY2026 – Sales Leadership Plan'] },
  { name: 'Accelerator Tier', items: '0-50%, 51-75%, 76-100%, 101-125%, 125%+', source: 'Manual', sampleItems: ['Tier 0: < 50% Attainment → 0x', 'Tier 1: 50–75% → 0.75x', 'Tier 2: 76–100% → 1.0x', 'Tier 3: 101–125% → 1.25x', 'Tier 4: 126–150% → 1.5x', 'Tier 5: > 150% → 2.0x'] },
  { name: 'Deal Type', items: 'New Logo, Expansion, Renewal, Channel', source: 'Salesforce', sampleItems: ['New Logo', 'Upsell – Expansion', 'Cross-Sell', 'Renewal – Standard', 'Renewal – Multi-Year', 'Channel / Partner-Sourced'] },
  { name: 'Booking Status', items: 'Closed Won, Committed, Best Case, Pipeline', source: 'Salesforce', sampleItems: ['Closed Won', 'Committed (90%)', 'Best Case (50%)', 'Upside (25%)', 'Pipeline (<25%)'] },
];
