import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Overview', path: '/' },
  { label: 'Integration', path: '/integration', teal: true },
  { label: 'Hub Model', path: '/hub' },
  { label: 'Topline', path: '/topline' },
  { label: 'Headcount', path: '/headcount' },
  { label: 'Non-Headcount', path: '/non-headcount' },
  { label: 'Infrastructure', path: '/infrastructure' },
  { label: 'Equity', path: '/equity' },
  { label: 'Sales Ops', path: '/sales-ops' },
];

export default function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? 'rgba(10,15,28,0.92)'
          : 'rgba(10,15,28,0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'var(--db-border)' : 'transparent'}`,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          {/* Databricks hexagon */}
          <svg width="28" height="28" viewBox="0 0 100 115" fill="none">
            <path d="M50 0L97 27.5V82.5L50 110L3 82.5V27.5L50 0Z" fill="var(--db-red)" />
            <path d="M30 55L50 44L70 55V77L50 88L30 77V55Z" fill="white" opacity="0.9" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, color: 'var(--db-white)', letterSpacing: '0.12em' }}>DATABRICKS</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--db-muted)', letterSpacing: '0.06em' }}>× ANAPLAN ARCHITECTURE</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="nav-links-desktop">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.path);
            const activeColor = link.teal ? 'var(--db-teal)' : 'var(--db-red)';
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 10px',
                  textDecoration: 'none',
                  color: active ? activeColor : 'var(--db-muted)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 6,
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--db-white)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--db-muted)'; }}
              >
                {active && (
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: activeColor, flexShrink: 0 }} />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--db-white)' }}
          className="nav-hamburger"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: 'var(--db-navy-2)', borderTop: '1px solid var(--db-border)', padding: '8px 16px 16px' }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.path);
            const activeColor = link.teal ? 'var(--db-teal)' : 'var(--db-red)';
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px',
                  textDecoration: 'none', color: active ? activeColor : 'var(--db-muted)',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 14, borderBottom: '1px solid var(--db-border)',
                }}
              >
                {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: activeColor }} />}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
