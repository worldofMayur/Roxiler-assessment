import React from 'react';

export default function Input(props) {
  return (
    <input
      {...props}
      style={{
        padding: '8px 10px',
        borderRadius: '6px',
        border: '1px solid #4b5563',
        background: '#020617',
        color: '#f9fafb',
        fontSize: '0.9rem'
      }}
    />
  );
}