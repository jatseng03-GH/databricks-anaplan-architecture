import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { TOPLINE_MODULES, TOPLINE_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Goal', value: 'Produce a monthly revenue forecast by product line, customer segment, and geography for a 24-month rolling horizon. The model drives the company financial plan, board reporting, and investor narratives.' },
  { label: 'Key Outputs', value: 'ARR, Net New ARR, Churn, Expansion, Contraction, NRR by cohort. GAAP revenue recognition schedule. Bookings bridge: new logos, upsell, renewals.' },
  { label: 'Owner', value: 'Revenue FP&A team. Model inputs owned by Sales Finance (segment assumptions) and Go-To-Market leadership (new logo targets). GTM forecast reviewed weekly during planning cycles.' },
  { label: 'Planning Horizon', value: '24-month rolling forecast updated monthly. Annual budget set in November/December. Quarterly forecast updates (Q1-Q4 Forecast versions) aligned to board cadence.' },
];

const IDENTIFY = [
  { label: 'Key Drivers', value: ['Customer count by segment', 'Average contract value (ACV)', 'Expansion rate % by cohort', 'Churn rate % by segment', 'New logo rate & pipeline conversion'] },
  { label: 'Customer Segments', value: ['Strategic (>$5M ACV) — ~100 accounts', 'Enterprise (>$1M ACV) — 500+ accounts', 'Mid-Market ($100K–$1M) — ~2,000 accounts', 'SMB (<$100K) — self-serve / PLG'] },
  { label: 'Product Lines', value: ['Data Intelligence Platform (core DBU)', 'Databricks SQL (>$1B ARR)', 'AI/ML & Mosaic (>$1B ARR)', 'Marketplace & Delta Sharing', 'Professional Services'] },
  { label: 'Current Benchmarks', value: ['$5.4B ARR as of Q3 FY2026', '>65% YoY growth rate', '>140% Net Dollar Retention', '500+ customers over $1M ACV', '10,000+ total customer organizations'] },
];

const OUTPUT = [
  { title: 'ARR Bridge Waterfall', description: 'Monthly waterfall chart showing Beginning ARR → New Business → Expansion → Contraction → Churn → Ending ARR. Used in CFO and board review packages.' },
  { title: 'NDR Trend by Segment', description: 'Net Dollar Retention cohort analysis by customer segment. Enterprise >140% NDR highlighted as key investor metric. Tracked quarterly against plan.' },
  { title: 'Geo Mix Analysis', description: 'Americas / EMEA / APAC revenue split by product line. Used for sales capacity planning and GTM resource allocation decisions.' },
  { title: 'Plan vs. Actual Variance', description: 'Monthly and YTD variance analysis by product and segment. Traffic-light status for each product line against budget. Key input to operating review.' },
  { title: 'Bookings Bridge', description: 'New logo vs. expansion vs. renewal bookings split. Tracks quota attainment assumptions feeding into Sales Ops commission model.' },
  { title: 'Scenario Analysis', description: 'Base / Upside / Downside scenarios with probability weights. Sensitivity analysis on churn rate and expansion rate assumptions for risk-adjusted planning.' },
];

export default function ToplineForecast() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Topline Forecast"
        title="Topline Revenue"
        titleAccent="Forecast"
        subtitle="Driver-based ARR forecasting across all Databricks product lines, customer segments, and geographies. Built on cohort-level NDR modeling with a 24-month rolling horizon."
        badge="Spoke Model"
        icon={TrendingUp}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '8', color: 'var(--db-teal)' },
          { label: 'Lists', value: '6', color: 'var(--db-gold)' },
          { label: 'Current ARR', value: '$5.4B', color: 'var(--db-red)' },
          { label: 'YoY Growth', value: '>65%', color: 'var(--db-gold)' },
          { label: 'NDR', value: '>140%', color: 'var(--db-teal)' },
          { label: '$1M+ Customers', value: '500+', color: 'var(--db-muted-2)' },
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
        modules={TOPLINE_MODULES}
        lists={TOPLINE_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/topline" />
    </motion.div>
  );
}
