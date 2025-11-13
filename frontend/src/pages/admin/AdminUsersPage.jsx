import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout.jsx';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import Table from '../../components/UI/Table.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    sortBy: 'name',
    order: 'asc',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchUsers() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filters,
          name: filters.name || undefined,
          email: filters.email || undefined,
          address: filters.address || undefined,
          role: filters.role || undefined,
        },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
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
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
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
    { key: 'role', header: 'Role' },
  ];

  const data = users.map((u) => ({
    name: u.name,
    email: u.email,
    address: u.address,
    role: u.role,
  }));

  return (
    <AdminLayout>
      <div style={card}>
        <div style={headerRow}>
          <div>
            <div style={title}>Users</div>
            <div style={subtitle}>Filter and inspect all platform users.</div>
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
          <select
            value={filters.role}
            onChange={(e) => updateFilter('role', e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #D1D5DB',
              background: '#F9FAFB',
              fontSize: 13,
            }}
          >
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
          </select>

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
              <option value="role">Sort: Role</option>
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
              onClick={fetchUsers}
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
          <p style={{ fontSize: 13, color: '#6B7280' }}>Loading users…</p>
        )}
        {error && <p style={errorText}>{error}</p>}

        <Table columns={columns} data={data} />
      </div>
    </AdminLayout>
  );
}
