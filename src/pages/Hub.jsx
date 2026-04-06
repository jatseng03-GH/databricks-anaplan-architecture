import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { HUB_MODULES, HUB_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Business Problem', value: 'Eliminate reconciliation errors caused by inconsistent org hierarchies and assumptions across 6+ planning models. A single change to an org structure should propagate automatically to every downstream spoke model.' },
  { label: 'Scope', value: 'All FP&A models company-wide. The Hub serves as the single source of truth for all shared reference data including org hierarchy, time dimensions, global assumptions, and position master data.' },
  { label: 'Owner', value: 'FP&A Systems team — managed by Senior Anaplan Architect. Change requests require sign-off from VP of FP&A and HR Systems Lead.' },
  { label: 'Success Metrics', value: 'Zero reconciliation variances in monthly close > 5 minutes. Org change propagation time reduced from 3 days to same-day. All spoke models locked from editing master lists directly.' },
];

const IDENTIFY = [
  { label: 'Data Sources', value: ['Workday (Org, Positions, Employees)', 'NetSuite (Cost Centers, Legal Entities)', 'Manual Assumptions (FX, Benefits, Merit)', 'HR Business Partners (Headcount Plans)'] },
  { label: 'Key Dimensions', value: ['Organization (Department, Cost Center)', 'Time (Month, Quarter, Year, FY)', 'Legal Entity', 'Version (Budget, Forecast, Actuals)', 'Scenario (Base, Upside, Downside)'] },
  { label: 'Integration Method', value: ['Workday → Anaplan Connect (daily sync)', 'NetSuite → CSV export via Anaplan CloudWorks', 'Manual inputs via Anaplan web interface', 'Hub → Spokes via Saved Anaplan Import Actions'] },
  { label: 'Key Risks', value: ['Workday hierarchy changes mid-quarter', 'FX rate assumption misalignment', 'Version lock timing vs. close calendar', 'Spoke model drift from Hub lists'] },
];

const OUTPUT = [
  { title: 'Downstream Model Imports', description: 'All six spoke models consume Hub lists via scheduled Anaplan import actions. Hub changes propagate automatically during nightly refresh cycles.' },
  { title: 'Global Assumptions Publishing', description: 'FX rates, merit percentages, benefit rates, and payroll tax rates published to all spoke models via COLLECT formulas at each planning cycle.' },
  { title: 'ALM Lifecycle', description: 'Dev → Test → Production model chain with quarterly change reviews. All structural changes to Hub require FP&A Systems ticket and VP approval before production deployment.' },
  { title: 'Org Hierarchy Reports', description: 'Cost center rollup reports generated for CFO review. Department-level expense summaries consolidated from all spoke models via the Hub hierarchy.' },
  { title: 'Version Management', description: 'Hub controls version lock status for all models. Budget lock, forecast lock, and actuals freeze are coordinated from Hub Version Management module.' },
  { title: 'Position Master Distribution', description: 'Position master acts as the authoritative headcount roster. All compensation calculations in the Headcount and Equity models reference Position Master via Hub import.' },
];

export default function Hub() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Hub Model"
        title="Anaplan Data Hub"
        titleAccent="Model"
        subtitle="The central model of the hub-and-spoke architecture. Single source of truth for org hierarchy, time, headcount positions, cost center mapping, and global assumptions. All six spoke models import from the Hub."
        badge="Hub Model"
        icon={Database}
      />

      {/* Key stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '8', color: 'var(--db-teal)' },
          { label: 'Lists', value: '9', color: 'var(--db-gold)' },
          { label: 'Downstream Models', value: '6', color: 'var(--db-red)' },
          { label: 'Departments', value: '~120', color: 'var(--db-muted-2)' },
          { label: 'Cost Centers', value: '~280', color: 'var(--db-muted-2)' },
          { label: 'Legal Entities', value: '~18', color: 'var(--db-muted-2)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <DiscoSection
        define={DEFINE}
        identify={IDENTIFY}
        modules={HUB_MODULES}
        lists={HUB_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/hub" />
    </motion.div>
  );
}
