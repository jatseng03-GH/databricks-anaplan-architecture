import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { EQUITY_MODULES, EQUITY_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Goal', value: 'Forecast stock-based compensation (SBC) expense by grant cohort, vesting schedule, and department for GAAP P&L reporting. Enable accurate GAAP vs. Non-GAAP reconciliation for board packages and pre-IPO financial statements.' },
  { label: 'Regulatory Framework', value: 'ASC 718 (FASB): Compensation — Stock Compensation. Requires straight-line expense recognition over the requisite service period (vesting period). Forfeitures estimated at grant date or recognized as incurred.' },
  { label: 'Business Context', value: 'Databricks is pre-IPO. Equity is the primary long-term compensation tool for ~11,000 employees. RSUs are the predominant instrument. High SBC as % of revenue is typical for hypergrowth pre-IPO companies.' },
  { label: 'Owner', value: 'Finance — Technical Accounting and Equity Plan Administration. Carta is the cap table system of record. FP&A builds the planning model; Accounting owns final ASC 718 calculations in GL.' },
];

const IDENTIFY = [
  { label: 'Grant Types', value: ['RSUs: 4-year vest, 1-year cliff (standard)', 'ISOs: 4-year vest, 10-year term (early employees)', 'NSOs: 4-year vest (executives, advisors)', 'Performance RSUs: milestone + time vest', 'ESPP: 24-month offering, 15% discount'] },
  { label: 'Data Sources', value: ['Carta (cap table): all historical grants, vesting schedules', 'Manual export to Anaplan (monthly refresh)', 'HRBP: new grant projections by department and level', 'Treasury: FMV estimates for new grant pricing'] },
  { label: 'SBC Drivers', value: ['Grant size (shares) × FMV at grant date', 'Vesting schedule and cliff period', 'Forfeiture rate by level and tenure', 'New hire grant projections (refresh schedule)', 'Executive special grants and promotions'] },
  { label: 'GAAP vs. Non-GAAP', value: ['GAAP: SBC expensed per ASC 718 schedule', 'Non-GAAP: SBC added back to all P&L lines', 'Key investor metric: Non-GAAP operating income', 'SBC % of revenue tracked quarterly vs. peers'] },
];

const OUTPUT = [
  { title: 'SBC Waterfall', description: 'Existing grants + new grants – forfeitures = Total SBC by month. Separated by Engineering/R&D, Sales & Marketing, G&A for P&L line item allocation.' },
  { title: 'GAAP vs. Non-GAAP Bridge Table', description: 'Line-by-line reconciliation: GAAP Gross Profit → Non-GAAP Gross Profit, GAAP OpEx → Non-GAAP OpEx. Primary exhibit in board financial package.' },
  { title: 'Unamortized Equity Balance Schedule', description: 'Total unamortized SBC balance (future expense commitment) by grant cohort. Critical for IPO S-1 disclosure preparation and investor roadshow materials.' },
  { title: 'SBC by Function and Level', description: 'Engineering SBC vs. Sales SBC vs. G&A SBC. Average SBC per employee by level. Used for compensation benchmarking and talent retention analysis.' },
  { title: 'Forfeiture Analysis', description: 'Estimated vs. actual forfeiture rate by department. Forfeiture benefit reduces SBC expense. High-attrition departments (Sales) show higher forfeiture benefit than Engineering.' },
  { title: 'New Grant Projection', description: 'Annual grant refresh projections by department and level. Models forward SBC expense for 4+ years. Used in long-range plan for GAAP expense forecasting.' },
];

export default function EquityComp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Equity Compensation"
        title="Equity"
        titleAccent="Compensation"
        subtitle="ASC 718 stock-based compensation expense modeling for RSU and option grants across ~11,000 employees. Pre-IPO environment with Carta as cap table system of record. Powers GAAP vs. Non-GAAP reconciliation."
        badge="Spoke Model"
        icon={Percent}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '7', color: 'var(--db-teal)' },
          { label: 'Lists', value: '5', color: 'var(--db-gold)' },
          { label: 'Standard', value: 'ASC 718', color: 'var(--db-red)' },
          { label: 'Cap Table', value: 'Carta', color: 'var(--db-gold)' },
          { label: 'Grant Types', value: '5', color: 'var(--db-teal)' },
          { label: 'Vest Schedules', value: '6+', color: 'var(--db-muted-2)' },
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
        modules={EQUITY_MODULES}
        lists={EQUITY_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/equity" />
    </motion.div>
  );
}
