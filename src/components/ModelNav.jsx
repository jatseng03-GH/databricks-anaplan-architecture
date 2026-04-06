import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MODELS = [
  { label: 'Hub Model', path: '/hub' },
  { label: 'Topline Forecast', path: '/topline' },
  { label: 'Headcount Planning', path: '/headcount' },
  { label: 'Non-Headcount Opex', path: '/non-headcount' },
  { label: 'Infrastructure & COGS', path: '/infrastructure' },
  { label: 'Equity Compensation', path: '/equity' },
  { label: 'Sales Ops & Commissions', path: '/sales-ops' },
];

export default function ModelNav({ currentPath }) {
  const idx = MODELS.findIndex(m => m.path === currentPath);
  const prev = idx > 0 ? MODELS[idx - 1] : null;
  const next = idx < MODELS.length - 1 ? MODELS[idx + 1] : null;

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderTop: '1px solid var(--db-border)',
      paddingTop: 32, marginTop: 64,
    }}>
      {prev ? (
        <Link to={prev.path} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--db-border)', background: 'var(--db-navy-2)', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--db-red)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--db-border)'}
        >
          <ChevronLeft size={16} color="var(--db-red)" />
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Previous</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--db-white)' }}>{prev.label}</div>
          </div>
        </Link>
      ) : <div />}

      {next ? (
        <Link to={next.path} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--db-border)', background: 'var(--db-navy-2)', transition: 'border-color 0.2s', textAlign: 'right' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--db-red)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--db-border)'}
        >
          <div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--db-white)' }}>{next.label}</div>
          </div>
          <ChevronRight size={16} color="var(--db-red)" />
        </Link>
      ) : <div />}
    </div>
  );
}
