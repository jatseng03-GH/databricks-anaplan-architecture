import { useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

const SOURCE_COLORS = {
  Workday: 'pill-teal',
  NetSuite: 'pill-gold',
  Manual: 'pill-muted',
  System: 'pill-navy',
  Calculated: 'pill-red',
  Carta: 'pill-gold',
  Salesforce: 'pill-teal',
  Hub: 'pill-red',
  'Sales Ops': 'pill-teal',
  Marketing: 'pill-gold',
  'AWS Cost Explorer': 'pill-teal',
};

export default function ListTable({ lists }) {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = lists.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.source.toLowerCase().includes(search.toLowerCase()) ||
    l.items.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--db-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search lists..."
          style={{
            width: '100%', padding: '8px 12px 8px 30px',
            background: 'var(--db-navy)', border: '1px solid var(--db-border)',
            borderRadius: 6, color: 'var(--db-white)', fontSize: 13,
            fontFamily: 'DM Sans, sans-serif', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--db-red)'}
          onBlur={e => e.target.style.borderColor = 'var(--db-border)'}
        />
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--db-muted)', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
          No lists match "{search}"
        </div>
      )}

      {filtered.map((list, i) => {
        const actualIdx = lists.indexOf(list);
        const isOpen = open === actualIdx;
        return (
          <div key={list.name} className="accordion-item">
            <div className="accordion-header" onClick={() => setOpen(isOpen ? null : actualIdx)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                {isOpen
                  ? <ChevronDown size={14} color="var(--db-red)" style={{ flexShrink: 0 }} />
                  : <ChevronRight size={14} color="var(--db-muted)" style={{ flexShrink: 0 }} />}
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--db-white)' }}>{list.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted)' }}>{list.items}</span>
                <span className={`pill ${SOURCE_COLORS[list.source] || 'pill-muted'}`}>{list.source}</span>
              </div>
            </div>
            {isOpen && (
              <div className="accordion-body">
                {/* Used In */}
                {list.usedIn && (
                  <div style={{ marginBottom: 12, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Used In:</span>
                    {list.usedIn.map(u => (
                      <span key={u} className="pill pill-navy">{u}</span>
                    ))}
                  </div>
                )}
                {/* Sample items */}
                {list.sampleItems && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {list.sampleItems.map((item, si) => (
                      <div key={si} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '5px 8px', borderRadius: 4,
                        background: 'var(--db-navy-2)',
                        border: '1px solid var(--db-border)',
                      }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--db-border-2)', minWidth: 20 }}>{String(si + 1).padStart(2, '0')}</span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted-2)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
