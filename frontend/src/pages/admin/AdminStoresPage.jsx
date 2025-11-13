import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout.jsx';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import Table from '../../components/UI/Table.jsx';
import RatingStars from '../../components/UI/RatingStars.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    sortBy: 'name',
    order: 'asc',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchStores() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filters,
          name: filters.name || undefined,
          email: filters.email || undefined,
          address: filters.address || undefined,
        },
      });
      setStores(res.data.stores || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const card = {
    background: '#FFFFFF',
    borderRadius: 18,
    padding: '20px 20px 18px',
    boxShadow: '0 12px 24px rgba(15,23,42,0.06)',
    border: '1px solid #E5E7EB',
  };

  const headerRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  };

  const title = {
    fontSize: 20,
    fontWeight: 600,
  };

  const subtitle = {
    fontSize: 13,
    color: '#6B7280',
  };

  const filtersRow = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr)) auto',
    gap: 8,
    marginBottom: 16,
  };

  const errorText = {
    color: '#B91C1C',
    fontSize: 13,
    marginBottom: 10,
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'address', header: 'Address' },
    { key: 'rating', header: 'Rating' },
  ];

  const data = stores.map((s) => ({
    name: s.name,
    email: s.email,
    address: s.address,
    rating: <RatingStars value={Math.round(s.rating || 0)} />,
  }));

  return (
    <AdminLayout>
      <div style={card}>
        <div style={headerRow}>
          <div>
            <div style={title}>Stores</div>
            <div style={subtitle}>Filter stores and see their ratings.</div>
          </div>
        </div>

        <div style={filtersRow}>
          <Input
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
          <Input
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => updateFilter('email', e.target.value)}
          />
          <Input
            placeholder="Filter by address"
            value={filters.address}
            onChange={(e) => updateFilter('address', e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                background: '#F9FAFB',
                fontSize: 13,
              }}
            >
              <option value="name">Sort: Name</option>
              <option value="email">Sort: Email</option>
              <option value="address">Sort: Address</option>
              <option value="rating">Sort: Rating</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => updateFilter('order', e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #D1D5DB',
                background: '#F9FAFB',
                fontSize: 13,
              }}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
            <Button
              onClick={fetchStores}
              style={{
                padding: '8px 14px',
                background: '#2563EB',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              Apply
            </Button>
          </div>
        </div>

        {loading && (
          <p style={{ fontSize: 13, color: '#6B7280' }}>Loading stores…</p>
        )}
        {error && <p style={errorText}>{error}</p>}

        <Table columns={columns} data={data} />
      </div>
    </AdminLayout>
  );
}
