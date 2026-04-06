import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PageHeader({ breadcrumb, title, titleAccent, subtitle, badge, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 40 }}
    >
      {/* Breadcrumb */}
      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted)' }}>
          <Link to="/" style={{ color: 'var(--db-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--db-red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--db-muted)'}
          >Home</Link>
          <span style={{ color: 'var(--db-border-2)' }}>›</span>
          <span style={{ color: 'var(--db-muted-2)' }}>{breadcrumb}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {Icon && (
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'rgba(238,61,44,0.12)',
            border: '1px solid rgba(238,61,44,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 4,
          }}>
            <Icon size={22} color="var(--db-red)" />
          </div>
        )}
        <div>
          {badge && (
            <div style={{ marginBottom: 10 }}>
              <span className="pill pill-red">{badge}</span>
            </div>
          )}
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--db-white)', lineHeight: 1.1, marginBottom: 8 }}>
            {title}
            {titleAccent && (
              <> <em style={{ color: 'var(--db-red)', fontStyle: 'italic' }}>{titleAccent}</em></>
            )}
          </h1>
          {subtitle && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'var(--db-muted)', lineHeight: 1.6, maxWidth: 680, margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
