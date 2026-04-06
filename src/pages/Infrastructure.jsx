import { motion } from 'framer-motion';
import { Server } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DiscoSection from '../components/DiscoSection';
import ModelNav from '../components/ModelNav';
import { INFRA_MODULES, INFRA_LISTS } from '../data/models';

const DEFINE = [
  { label: 'Goal', value: 'Forecast cloud infrastructure costs by product line and cloud provider, model gross margin by product, and identify cost efficiency opportunities. Unique to Databricks as a compute-heavy AI/data platform.' },
  { label: 'Business Context', value: 'Cloud (AWS, Azure, GCP) is the primary COGS driver for Databricks. The company operates a ~80% gross margin business. Each percentage point of GM improvement at $5.4B ARR scale = $54M.' },
  { label: 'Owner', value: 'Infrastructure FP&A + FinOps team. Cloud cost actuals owned by Engineering Infrastructure and SRE. GM% targets set by CFO and reviewed quarterly against competitive benchmarks.' },
  { label: 'Key Metrics', value: 'Cost per DBU, storage cost per TB, gross margin %, infrastructure efficiency ratio (COGS / Revenue). FinOps savings tracked separately as P&L addback for management reporting.' },
];

const IDENTIFY = [
  { label: 'Data Sources', value: ['AWS Cost Explorer → Databricks Delta Lake → Anaplan', 'Azure Cost Management → Delta Lake → Anaplan', 'GCP Billing Export → Delta Lake → Anaplan', 'Engineering FinOps team (DBU consumption plans)'] },
  { label: 'Key Cost Drivers', value: ['DBU consumption volume by product', 'Cloud compute unit price (EC2, VM, GCE)', 'Data storage volume in TB (S3, Blob, GCS)', 'Egress bandwidth costs', 'Premium Support % of revenue'] },
  { label: 'Cloud Mix', value: ['AWS: Primary cloud (~50% of compute)', 'Azure: Major cloud (~30% of compute)', 'GCP: Growing cloud (~20% of compute)', 'Multi-cloud strategy driven by customer demand'] },
  { label: 'Gross Margin Context', value: ['Current blended GM: ~80%', 'Target GM: Maintain >80% at scale', 'SQL product: Higher GM (SQL is efficient)', 'AI/ML products: Lower GM (GPU-intensive)', 'Services: Lower GM by design'] },
];

const OUTPUT = [
  { title: 'Gross Margin Bridge', description: 'Revenue vs. COGS driver decomposition: volume, price, mix, and FinOps savings. Primary tool for explaining GM% changes to CFO and engineering leadership.' },
  { title: 'Cloud Cost by Provider Pie Chart', description: 'AWS / Azure / GCP cost split by product line. Used in cloud contract negotiations and multi-cloud strategy discussions. Updated monthly from Delta Lake.' },
  { title: 'Infrastructure Efficiency Trend', description: 'Cost per $1 of revenue trend (COGS / Revenue). Key metric for demonstrating that the business achieves operating leverage as it scales. Target: declining ratio.' },
  { title: 'FinOps Savings Tracker', description: 'Initiative-level tracking of Reserved Instances, Committed Use Discounts, storage tiering, and idle resource cleanup. Savings presented net of implementation cost.' },
  { title: 'Unit Economics by Product', description: 'Revenue per DBU vs. cost per DBU by product. Identifies which products have highest contribution margins and informs product pricing strategy.' },
  { title: 'GM% by Product Line', description: 'Gross margin % for each product: Data Intelligence Platform, SQL, AI/ML, Marketplace. Supports product P&L conversations with product management and engineering.' },
];

export default function Infrastructure() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px 80px' }}
    >
      <PageHeader
        breadcrumb="Infrastructure & COGS"
        title="Infrastructure"
        titleAccent="& COGS"
        subtitle="Cloud infrastructure cost modeling across AWS, Azure, and GCP — tied to DBU consumption with gross margin analysis by product line. Built on data from Databricks' own Delta Lake pipeline."
        badge="Spoke Model"
        icon={Server}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Modules', value: '8', color: 'var(--db-teal)' },
          { label: 'Lists', value: '6', color: 'var(--db-gold)' },
          { label: 'Gross Margin', value: '~80%', color: 'var(--db-red)' },
          { label: 'Cloud Providers', value: '3', color: 'var(--db-gold)' },
          { label: 'Cloud Regions', value: '9+', color: 'var(--db-teal)' },
          { label: 'FinOps Initiatives', value: '8+', color: 'var(--db-muted-2)' },
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
        modules={INFRA_MODULES}
        lists={INFRA_LISTS}
        output={OUTPUT}
      />

      <ModelNav currentPath="/infrastructure" />
    </motion.div>
  );
}
