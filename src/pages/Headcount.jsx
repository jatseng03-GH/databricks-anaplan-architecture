import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { HEADCOUNT_MODULES, HEADCOUNT_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Goal', value: 'Model headcount by position, loaded cost per hire, and total compensation expense by department for budget and rolling forecast. Covers all ~11,000 active employees plus ~3,000 planned new hires in 2025.' },
  { label: 'Key Outputs', value: 'Monthly headcount by department, fully-loaded people cost by cost center, hiring waterfall by function, attrition analysis, and HC vs. budget variance with traffic-light status.' },
  { label: 'Owner', value: 'FP&A + HR Business Partners. Model inputs owned by HRBPs (position plans) and Recruiting Ops (new hire schedules). Reviewed monthly in HC operating review with Chief People Officer.' },
  { label: 'Scope', value: 'All full-time employees globally. Contractors tracked separately in a Contractor module with cost routed to Non-Headcount Opex. International entities use local salary bands with Hub FX rates.' },
];

const IDENTIFY = [
  { label: 'Primary Drivers', value: ['Approved headcount by level and department', 'Hiring timing and start month assumptions', 'Voluntary attrition rate by level and tenure', 'Loaded comp by level and geo (from Hub)'] },
  { label: 'Data Inputs', value: ['Workday: active positions, org assignments, salaries', 'Offer letters (manual entry by Recruiting)', 'HRBP attrition assumptions by department', 'Hub Global Assumptions: benefit rates, payroll tax'] },
  { label: 'Headcount Context', value: ['~11,000 employees as of 2025', 'Hiring 3,000 in 2025 (plan)', 'HQ: San Francisco, CA', 'Global offices: 35+ locations', 'IC1–IC8 individual contributor levels', 'M1–M5, Director, VP, SVP, C-Suite management'] },
  { label: 'Key Risks', value: ['Attrition rate variance vs. assumption', 'Hiring timing slippage (approved vs. started)', 'Benefits cost fluctuation (health, dental, 401K)', 'Geo mix shift driving comp assumption changes'] },
];

const OUTPUT = [
  { title: 'Headcount Waterfall by Quarter', description: 'Beginning HC → New Hires → Attrition → Net Change → Ending HC for each department. Primary metric in quarterly HC operating review with CPO and CFO.' },
  { title: 'Cost per Employee by Level and Geo', description: 'Fully-loaded cost per employee (salary + bonus + benefits + payroll tax + recruiting) segmented by job level and geography. Used for capacity planning decisions.' },
  { title: 'HC vs. Budget Variance', description: 'Monthly headcount and expense variance vs. budget with traffic-light status (green/yellow/red) by department. Automated alert when >5% over budget.' },
  { title: 'Function Mix Analysis', description: 'Engineering %, Sales & GTM %, G&A % as share of total headcount. R&D ratio and GTM ratio tracked as key operating efficiency metrics.' },
  { title: 'New Hire Schedule', description: 'Monthly new hire plan by department with expected start dates. Feeds commission model (ramp period) and real estate planning (seat demand).' },
  { title: 'Attrition Analysis', description: 'Voluntary vs. involuntary attrition by department and level. Annualized attrition rate trend vs. technology industry benchmarks for retention risk management.' },
];

export default function Headcount() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Headcount Planning"
        title="Headcount"
        titleAccent="Planning"
        subtitle="Position-level headcount and fully-loaded compensation planning for ~11,000 employees across 35+ global offices. Powered by Workday position data with HRBP-owned hiring schedules and attrition assumptions."
        badge="Spoke Model"
        icon={Users}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '9', color: 'var(--db-teal)' },
          { label: 'Lists', value: '7', color: 'var(--db-gold)' },
          { label: 'Total Employees', value: '~11K', color: 'var(--db-red)' },
          { label: '2025 Hiring Plan', value: '3,000', color: 'var(--db-gold)' },
          { label: 'Global Offices', value: '35+', color: 'var(--db-teal)' },
          { label: 'Job Levels', value: '14', color: 'var(--db-muted-2)' },
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
        modules={HEADCOUNT_MODULES}
        lists={HEADCOUNT_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/headcount" />
    </motion.div>
  );
}
