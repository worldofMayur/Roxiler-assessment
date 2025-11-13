import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../UI/Button.jsx';

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e5e7eb' }}>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937' }}>
        <strong>Admin Dashboard</strong>
        <Button style={{ float: 'right' }} onClick={logout}>Logout</Button>
      </header>
      <main style={{ padding: '16px' }}>{children}</main>
    </div>
  );
}