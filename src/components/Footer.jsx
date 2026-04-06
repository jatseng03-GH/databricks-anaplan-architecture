import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--db-border)',
      background: 'var(--db-navy-2)',
      padding: '32px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 100 115" fill="none">
            <path d="M50 0L97 27.5V82.5L50 110L3 82.5V27.5L50 0Z" fill="var(--db-red)" />
            <path d="M30 55L50 44L70 55V77L50 88L30 77V55Z" fill="white" opacity="0.9" />
          </svg>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--db-white)', letterSpacing: '0.1em' }}>DATABRICKS × ANAPLAN</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', marginTop: 2 }}>FP&A Architecture Reference</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Overview', path: '/' },
            { label: 'Hub Model', path: '/hub' },
            { label: 'Topline', path: '/topline' },
            { label: 'Headcount', path: '/headcount' },
            { label: 'Infrastructure', path: '/infrastructure' },
            { label: 'Sales Ops', path: '/sales-ops' },
          ].map(l => (
            <Link key={l.path} to={l.path} style={{ color: 'var(--db-muted)', fontSize: 12, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--db-white)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--db-muted)'}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textAlign: 'right' }}>
          Architecture reference tool<br />
          <span style={{ color: 'var(--db-border-2)' }}>Databricks FP&A · Anaplan Hub-and-Spoke</span>
        </div>
      </div>
    </footer>
  );
}
