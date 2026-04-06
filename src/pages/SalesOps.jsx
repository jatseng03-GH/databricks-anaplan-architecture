import { motion } from 'framer-motion';
import { BadgeDollarSign } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { SALESOPS_MODULES, SALESOPS_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Goal', value: 'Calculate sales commission expense by rep, model quota attainment scenarios, and produce accurate sales comp accruals for monthly close. The model must align to Topline Forecast assumptions for bookings.' },
  { label: 'Business Context', value: 'Databricks has 500+ customers over $1M ACV with a direct enterprise sales motion. Sales comp is a major S&M expense. Accuracy matters: over-accrual wastes cash; under-accrual creates surprise expenses.' },
  { label: 'Owner', value: 'Sales Finance + Sales Ops. Quota letters owned by VP of Sales. Comp plan design owned by Sales Compensation. Monthly accruals reviewed and approved by VP of Finance and Chief Revenue Officer.' },
  { label: 'Key Challenge', value: 'Bookings timing vs. revenue recognition. Accelerator mechanics create non-linear expense (best quarter for reps = most expensive quarter for company). Clawback recovery tracking requires rep-level ledger.' },
];

const IDENTIFY = [
  { label: 'Data Sources', value: ['Salesforce: bookings actuals (daily sync via Anaplan Connect)', 'Quota letters: manual upload by Sales Ops', 'Comp plans: manual entry by Sales Finance', 'Workday: rep hire dates for ramp calculations'] },
  { label: 'Sales Segments', value: ['Enterprise AE: >$1M deal focus, ~100 reps', 'Mid-Market AE: $100K–$1M, ~150 reps', 'SDR: pipeline generation, ~100 SDRs', 'Solutions Engineer: technical overlay, ~75 SEs', 'Customer Success Manager: expansion, ~75 CSMs', 'Partner Sales: channel, ~25 managers'] },
  { label: 'Comp Plan Structure', value: ['OTE range: $250K–$500K (Enterprise AE)', '50/50 Base/Variable split (Enterprise AE)', 'Quarterly bookings quota (annual phased)', 'Accelerators: 1.0x at 100%, 1.5x at >100%', 'Clawback: 12-month period on new logos'] },
  { label: 'Alignment to Topline', value: ['Quota plan = Topline bookings forecast by segment', 'Attainment scenarios = revenue plan scenarios', 'Commission accrual feeds S&M expense in OpEx', 'Deal-level bookings feed ARR Build module'] },
];

const OUTPUT = [
  { title: 'Commission Expense Bridge', description: 'Budget vs. forecast vs. actual commission expense by role and segment. Shows impact of above/below-quota attainment on total commission expense. Key input to monthly S&M expense close.' },
  { title: 'Quota Attainment Distribution', description: 'Histogram of attainment % across all reps: what % of reps are at 0–50%, 50–75%, 75–100%, 100–125%, 125%+. Key indicator of sales team health and commission expense risk.' },
  { title: 'Sales Productivity Trend', description: 'ARR per quota-carrying rep by segment over time. Productivity target: $2–3M ARR per Enterprise AE. Ramp-adjusted productivity vs. fully-ramped productivity tracked separately.' },
  { title: 'Commission Accrual Report', description: 'Monthly commission accrual by cost center for accounting team. Splits cash-basis vs. accrual-basis timing differences. Required for monthly financial close process.' },
  { title: 'Territory Coverage Analysis', description: 'Total addressable quota vs. territory assignment. Whitespace $ by territory. Used by CRO for territory planning and headcount add justification.' },
  { title: 'OTE Attainment Summary', description: 'Total OTE at target vs. projected OTE payout by role. Measures how efficiently the sales organization is converting OTE investment into revenue. Key input to annual comp plan design.' },
];

export default function SalesOps() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Sales Ops & Commissions"
        title="Sales Ops"
        titleAccent="& Commissions"
        subtitle="Commission and variable pay calculation for 400+ quota-carrying reps, quota attainment scenario modeling, and sales productivity analytics. Powered by Salesforce bookings data with monthly close accruals."
        badge="Spoke Model"
        icon={BadgeDollarSign}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '8', color: 'var(--db-teal)' },
          { label: 'Lists', value: '7', color: 'var(--db-gold)' },
          { label: 'Quota Reps', value: '400+', color: 'var(--db-red)' },
          { label: '$1M+ Accounts', value: '500+', color: 'var(--db-gold)' },
          { label: 'Sales Roles', value: '6', color: 'var(--db-teal)' },
          { label: 'Accelerator Tiers', value: '6', color: 'var(--db-muted-2)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <DiscoSection
        define={DEFINE}
        identify={IDENTIFY}
        modules={SALESOPS_MODULES}
        lists={SALESOPS_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/sales-ops" />
    </motion.div>
  );
}
