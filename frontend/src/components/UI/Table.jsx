import React from 'react';

export default function Table({ columns, data }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        background: '#FFFFFF',
      }}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderBottom: '1px solid #E5E7EB',
                fontWeight: 600,
                color: '#4B5563',
                background: '#F9FAFB',
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            style={{
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                style={{
                  padding: '10px 12px',
                  verticalAlign: 'middle',
                  color: '#111827',
                }}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
