import React from 'react';

export default function Button({ children, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: '10px 14px',
        borderRadius: 8,
        border: '1px solid transparent',
        background: '#111827',
        color: '#F9FAFB',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 500,
        boxSizing: 'border-box',
        transition: 'background 0.15s ease, transform 0.05s ease, box-shadow 0.15s ease',
        ...style,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.99)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </button>
  );
}
