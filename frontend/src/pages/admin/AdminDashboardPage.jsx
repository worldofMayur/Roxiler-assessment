import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/UI/Button.jsx';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchStats() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const cardGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  };

  const card = {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '16px 18px',
    boxShadow: '0 12px 24px rgba(15,23,42,0.06)',
    border: '1px solid #E5E7EB',
  };

  const label = {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  };

  const value = {
    fontSize: 22,
    fontWeight: 600,
  };

  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const title = {
    fontSize: 22,
    fontWeight: 600,
  };

  const subtitle = {
    fontSize: 13,
    color: '#6B7280',
  };

  const errorText = {
    color: '#B91C1C',
    fontSize: 13,
    marginTop: 8,
  };

  return (
    <AdminLayout>
      <div style={row}>
        <div>
          <div style={title}>Overview</div>
          <div style={subtitle}>
            High-level metrics for users, stores and ratings.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/users">
            <Button
              style={{
                background: '#EEF2FF',
                color: '#1D4ED8',
                borderRadius: 999,
                border: 'none',
              }}
            >
              View Users
            </Button>
          </Link>
          <Link to="/admin/stores">
            <Button
              style={{
                background: '#EEF2FF',
                color: '#1D4ED8',
                borderRadius: 999,
                border: 'none',
              }}
            >
              View Stores
            </Button>
          </Link>
        </div>
      </div>

      {loading && (
        <p style={{ fontSize: 13, color: '#6B7280', marginTop: 12 }}>
          Loading dashboard…
        </p>
      )}
      {error && <p style={errorText}>{error}</p>}

      <div style={cardGrid}>
        <div style={card}>
          <div style={label}>Total Users</div>
          <div style={value}>{stats.totalUsers}</div>
        </div>
        <div style={card}>
          <div style={label}>Total Stores</div>
          <div style={value}>{stats.totalStores}</div>
        </div>
        <div style={card}>
          <div style={label}>Total Ratings</div>
          <div style={value}>{stats.totalRatings}</div>
        </div>
      </div>
    </AdminLayout>
  );
}
