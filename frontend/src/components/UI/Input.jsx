import React from 'react';

export default function Input({ style, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid #D1D5DB',
        background: '#F9FAFB',
        color: '#111827',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#2563EB';
        e.target.style.boxShadow = '0 0 0 1px rgba(37,99,235,0.35)';
        props.onFocus && props.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#D1D5DB';
        e.target.style.boxShadow = 'none';
        props.onBlur && props.onBlur(e);
      }}
    />
  );
}
