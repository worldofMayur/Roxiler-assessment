import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout.jsx';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import Table from '../../components/UI/Table.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminUsersPage() {
  const { token, user } = useAuth();
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

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [deletingId, setDeletingId] = useState(null);

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchUsers(nextPage = page) {
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
          page: nextPage,
          pageSize,
        },
      });
      setUsers(res.data.users || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDeleteUser(id) {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(id);
    setError('');
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  }

  const card = {
    background: '#FFFFFF',
    borderRadius: 18,
    padding: '20px 20px 18px',
    boxShadow: '0 12px 24px rgba(15,23,42,0.06)',
    border: '1px solid #E5E7EB',
  };

  const headerRow = {
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

  const paginationRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    fontSize: 13,
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'address', header: 'Address' },
    { key: 'role', header: 'Role' },
    { key: 'actions', header: 'Actions' },
  ];

  const data = users.map((u) => {
    const isSelf = user?.id === u.id;
    const canDelete = u.role !== 'ADMIN' && !isSelf;
    return {
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
      actions: canDelete ? (
        <Button
          style={{
            padding: '6px 10px',
            fontSize: 13,
            borderRadius: 8,
            background: '#DC2626',
            border: 'none',
          }}
          disabled={deletingId === u.id}
          onClick={() => handleDeleteUser(u.id)}
        >
          {deletingId === u.id ? 'Deleting…' : 'Delete'}
        </Button>
      ) : (
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>Protected</span>
      ),
    };
  });

  return (
    <AdminLayout>
      <div style={card}>
        <div style={headerRow}>
          <div style={title}>Users</div>
          <div style={subtitle}>
            Filter and manage users registered in the rating platform.
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
            <option value="">Any role</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
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
              onClick={() => fetchUsers(1)}
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

        {error && <p style={errorText}>{error}</p>}
        {loading && (
          <p style={{ fontSize: 13, color: '#6B7280' }}>Loading users…</p>
        )}

        <Table columns={columns} data={data} />

        <div style={paginationRow}>
          <span>
            Showing page {page} of {totalPages} · Total {total} users
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchUsers(page - 1)}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: page <= 1 ? '#E5E7EB' : '#F3F4F6',
                color: '#111827',
                border: '1px solid #D1D5DB',
                fontSize: 13,
              }}
            >
              Previous
            </Button>
            <Button
              type="button"
              disabled={page >= totalPages}
              onClick={() => fetchUsers(page + 1)}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                background: page >= totalPages ? '#E5E7EB' : '#F3F4F6',
                color: '#111827',
                border: '1px solid #D1D5DB',
                fontSize: 13,
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
