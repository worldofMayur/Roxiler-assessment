import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../UI/Button.jsx';

export default function OwnerLayout({ children }) {
  const { logout } = useAuth();

  const page = {
    minHeight: '100vh',
    background: '#F4F5FB',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#111827',
  };

  const header = {
    height: 60,
    background: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  };

  const brand = {
    fontSize: 16,
    fontWeight: 600,
  };

  const main = {
    maxWidth: 1120,
    margin: '32px auto',
    padding: '0 16px 32px',
    boxSizing: 'border-box',
  };

  return (
    <div style={page}>
      <header style={header}>
        <div style={brand}>Store Owner · Store Rating Platform</div>
        <Button
          onClick={logout}
          style={{
            padding: '7px 12px',
            background: '#111827',
            borderRadius: 999,
            fontSize: 13,
          }}
        >
          Logout
        </Button>
      </header>
      <main style={main}>{children}</main>
    </div>
  );
}
