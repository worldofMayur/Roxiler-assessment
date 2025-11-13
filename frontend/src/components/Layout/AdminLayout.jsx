import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../UI/Button.jsx';

export default function AdminLayout({ children }) {
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

  const nav = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  };

  const navLinkBase = {
    fontSize: 13,
    textDecoration: 'none',
    color: '#6B7280',
    padding: '6px 10px',
    borderRadius: 999,
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
        <div style={brand}>Admin · Store Rating Platform</div>

        <div style={nav}>
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => ({
              ...navLinkBase,
              backgroundColor: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#1D4ED8' : '#6B7280',
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            style={({ isActive }) => ({
              ...navLinkBase,
              backgroundColor: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#1D4ED8' : '#6B7280',
            })}
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/stores"
            style={({ isActive }) => ({
              ...navLinkBase,
              backgroundColor: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#1D4ED8' : '#6B7280',
            })}
          >
            Stores
          </NavLink>

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
        </div>
      </header>

      <main style={main}>{children}</main>
    </div>
  );
}
