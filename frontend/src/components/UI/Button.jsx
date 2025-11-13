import React from 'react';

export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: '8px 14px',
        borderRadius: '6px',
        border: '1px solid #333',
        background: '#111827',
        color: '#f9fafb',
        cursor: 'pointer',
        fontSize: '0.9rem'
      }}
    >
      {children}
    </button>
  );
}