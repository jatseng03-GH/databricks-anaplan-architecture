import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { NONHC_MODULES, NONHC_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Goal', value: 'Driver-based non-headcount expense planning by cost category and department with monthly phasing. Covers all non-people operating expenses in Sales & Marketing, R&D, and G&A P&L lines.' },
  { label: 'Scope', value: 'Excludes people costs (in Headcount model) and COGS (in Infrastructure model). Covers Software/SaaS, T&E, Marketing Programs, Professional Services, Facilities, and Depreciation & Amortization.' },
  { label: 'Owner', value: 'FP&A Cost Center Owners. Budget owned by department heads with FP&A business partners. Marketing Programs managed by Growth Finance. Facilities managed by Real Estate & Workplace team.' },
  { label: 'Key Challenge', value: 'Phase accurately: Software contracts renew at different points; marketing spend is highly seasonal (Q4 events-heavy); T&E correlates to headcount ramp. Per-HC drivers used for variable categories.' },
];

const IDENTIFY = [
  { label: 'Opex Categories', value: ['Software & SaaS (Salesforce, Workday, GitHub, etc.)', 'Travel & Entertainment (per-HC rates + field)', 'Marketing Programs (events, demand gen, digital)', 'Professional Services (legal, consulting, audit)', 'Facilities & Real Estate (leases + utilities)', 'Depreciation & Amortization'] },
  { label: 'Key Drivers', value: ['Per-headcount rates for T&E and some SaaS', 'Contract values and start/end dates for SaaS', 'Marketing program budgets with seasonal phasing', 'Lease terms and escalation rates for facilities', 'Asset schedules for depreciation'] },
  { label: 'Data Sources', value: ['NetSuite: actuals by vendor and cost center', 'Procurement: vendor contracts and SOW values', 'Marketing Ops: program budgets and phasing', 'HR: contractor headcount for T&E calibration'] },
  { label: 'Top Vendors by Category', value: ['SaaS: Salesforce, Workday, GitHub, Okta, Zoom', 'T&E: Navan (Pcard), Concur legacy', 'Prof Svcs: Big 4 audit, legal firms, consultants', 'Facilities: JLL (real estate), WeWork (flex)'] },
];

const OUTPUT = [
  { title: 'Opex by Category Waterfall vs. Prior Year', description: 'Category-level spend waterfall comparing current year to prior year. Highlights structural cost changes vs. growth-driven investment. Key P&L management tool for CFO.' },
  { title: 'Vendor Spend Concentration', description: 'Top 20 vendors by total spend. Vendor renewal risk flags. Contract expiration calendar for procurement negotiations. Used in software rationalization reviews.' },
  { title: 'Department Budget vs. Actual Tracker', description: 'Monthly variance report by department and category with YTD totals. Traffic-light status: green (<5% over), yellow (5–10%), red (>10%). Input to quarterly business reviews.' },
  { title: 'Opex % of Revenue Trend', description: 'S&M%, R&D%, G&A% as percentage of revenue tracked against operating leverage targets. Key metric for demonstrating scale efficiency to board and future investors.' },
  { title: 'Full Year Estimate (FYE)', description: 'YTD actuals + remaining forecast = FYE estimate. Reforecasting trigger if FYE deviates >3% from budget. Department heads review monthly.' },
  { title: 'Marketing Program ROI', description: 'Program-level spend vs. expected pipeline sourced. Cost per lead, cost per MQL, and pipeline coverage ratios by program. Joint output with Revenue FP&A.' },
];

export default function NonHeadcount() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Non-Headcount Opex"
        title="Non-Headcount"
        titleAccent="Opex"
        subtitle="Driver-based non-people operating expense planning across Software/SaaS, T&E, Marketing Programs, Professional Services, Facilities, and D&A — by cost center and P&L category with monthly phasing."
        badge="Spoke Model"
        icon={Receipt}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '9', color: 'var(--db-teal)' },
          { label: 'Lists', value: '6', color: 'var(--db-gold)' },
          { label: 'P&L Lines', value: '3', color: 'var(--db-red)' },
          { label: 'Top Vendors', value: '50+', color: 'var(--db-gold)' },
          { label: 'Opex Categories', value: '6', color: 'var(--db-teal)' },
          { label: 'Global Offices', value: '35+', color: 'var(--db-muted-2)' },
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
        modules={NONHC_MODULES}
        lists={NONHC_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/non-headcount" />
    </motion.div>
  );
}
