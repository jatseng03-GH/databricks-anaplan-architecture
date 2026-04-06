import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

const TYPE_COLORS = {
  Input: 'pill-gold',
  Calc: 'pill-teal',
  Output: 'pill-red',
  System: 'pill-muted',
};

export default function ModuleTable({ modules }) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [expanded, setExpanded] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...modules].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField] || '';
    const bv = b[sortField] || '';
    return sortDir === 'asc'
      ? av.localeCompare(bv)
      : bv.localeCompare(av);
  });

  const SortIcon = ({ field }) => (
    <ArrowUpDown size={11} style={{ opacity: sortField === field ? 1 : 0.4, marginLeft: 4, display: 'inline' }} />
  );

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--db-border)' }}>
      <table className="db-table" style={{ minWidth: 700 }}>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{ width: '22%' }}>Module Name <SortIcon field="name" /></th>
            <th onClick={() => handleSort('type')} style={{ width: '10%' }}>Type <SortIcon field="type" /></th>
            <th onClick={() => handleSort('dimensions')} style={{ width: '25%' }}>Dimensions <SortIcon field="dimensions" /></th>
            <th style={{ width: '40%' }}>Key Line Items</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((mod, i) => (
            <>
              <tr
                key={mod.name}
                className={expanded === i ? 'row-expanded' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <td>
                  <span style={{ fontWeight: 500, color: 'var(--db-white)' }}>{mod.name}</span>
                </td>
                <td>
                  <span className={`pill ${TYPE_COLORS[mod.type] || 'pill-muted'}`}>{mod.type}</span>
                </td>
                <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--db-muted-2)' }}>{mod.dimensions}</td>
                <td style={{ fontSize: 12, color: 'var(--db-muted)', lineHeight: 1.5 }}>{mod.lineItems}</td>
                <td style={{ textAlign: 'center' }}>
                  {expanded === i
                    ? <ChevronUp size={14} color="var(--db-red)" />
                    : <ChevronDown size={14} color="var(--db-muted)" />}
                </td>
              </tr>
              {expanded === i && mod.formulas && (
                <tr key={`${mod.name}-expanded`} style={{ background: 'rgba(5,8,16,0.7)' }}>
                  <td colSpan={5} style={{ padding: '12px 16px 16px' }}>
                    <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--db-muted)', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Sample Formulas
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {mod.formulas.map((f, fi) => (
                        <div key={fi} className="formula-block" style={{ fontSize: 12 }}>
                          {f}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
