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

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // create / edit form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formValues, setFormValues] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
    ownerEmail: '',
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function updateFilter(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function updateForm(field, value) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchStores(nextPage = page) {
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
          page: nextPage,
          pageSize,
        },
      });
      setStores(res.data.stores || []);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreateOrUpdate(e) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError('');

    try {
      const payload = {
        name: formValues.name,
        email: formValues.email || null,
        address: formValues.address || null,
        ownerEmail: formValues.ownerEmail || undefined,
      };

      if (formValues.id == null) {
        await api.post('/admin/stores', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.put(`/admin/stores/${formValues.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormValues({
        id: null,
        name: '',
        email: '',
        address: '',
        ownerEmail: '',
      });
      setShowCreateForm(false);
      setShowEditForm(false);
      await fetchStores(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save store');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStore(id) {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    setDeletingId(id);
    setError('');
    try {
      await api.delete(`/admin/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchStores(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete store');
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

  const formCard = {
    marginBottom: 16,
    padding: '12px 12px',
    borderRadius: 12,
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
  };

  const formRow = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
    gap: 8,
    alignItems: 'center',
  };

  const formLabel = {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
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
    { key: 'rating', header: 'Rating' },
    { key: 'actions', header: 'Actions' },
  ];

  const data = stores.map((s) => ({
    name: s.name,
    email: s.email,
    address: s.address,
    rating: <RatingStars value={Math.round(s.rating || 0)} />,
    actions: (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          style={{
            padding: '6px 10px',
            fontSize: 13,
            borderRadius: 8,
            background: '#2563EB',
            border: 'none',
          }}
          onClick={() => {
            setFormValues({
              id: s.id,
              name: s.name || '',
              email: s.email || '',
              address: s.address || '',
              ownerEmail: '',
            });
            setShowEditForm(true);
            setShowCreateForm(false);
          }}
        >
          Edit
        </Button>
        <Button
          style={{
            padding: '6px 10px',
            fontSize: 13,
            borderRadius: 8,
            background: '#DC2626',
            border: 'none',
          }}
          disabled={deletingId === s.id}
          onClick={() => handleDeleteStore(s.id)}
        >
          {deletingId === s.id ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    ),
  }));

  return (
    <AdminLayout>
      <div style={card}>
        <div style={headerRow}>
          <div>
            <div style={title}>Stores</div>
            <div style={subtitle}>
              Filter stores, see their ratings, and manage them.
            </div>
          </div>
          <Button
            style={{
              padding: '8px 12px',
              background: '#2563EB',
              borderRadius: 999,
              border: 'none',
              fontSize: 13,
            }}
            onClick={() => {
              setFormValues({
                id: null,
                name: '',
                email: '',
                address: '',
                ownerEmail: '',
              });
              setShowCreateForm((v) => !v);
              setShowEditForm(false);
            }}
          >
            {showCreateForm ? 'Cancel' : 'Add Store'}
          </Button>
        </div>

        {(showCreateForm || showEditForm) && (
          <form style={formCard} onSubmit={handleCreateOrUpdate}>
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500 }}>
              {formValues.id == null ? 'Create New Store' : 'Edit Store'}
            </div>
            <div style={formRow}>
              <div>
                <div style={formLabel}>Store Name</div>
                <Input
                  placeholder="Store name"
                  value={formValues.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                />
              </div>
              <div>
                <div style={formLabel}>Email (optional)</div>
                <Input
                  placeholder="Store email"
                  value={formValues.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                />
              </div>
              <div>
                <div style={formLabel}>Address (optional)</div>
                <Input
                  placeholder="Store address"
                  value={formValues.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                />
              </div>
              <div>
                <div style={formLabel}>Owner Email (optional)</div>
                <Input
                  placeholder="owner@example.com"
                  value={formValues.ownerEmail}
                  onChange={(e) => updateForm('ownerEmail', e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <Button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '8px 14px',
                    background: '#2563EB',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  {saving
                    ? 'Saving...'
                    : formValues.id == null
                    ? 'Create'
                    : 'Save'}
                </Button>
                {(showEditForm || showCreateForm) && (
                  <Button
                    type="button"
                    style={{
                      padding: '8px 14px',
                      background: '#E5E7EB',
                      color: '#374151',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                    onClick={() => {
                      setShowCreateForm(false);
                      setShowEditForm(false);
                      setFormValues({
                        id: null,
                        name: '',
                        email: '',
                        address: '',
                        ownerEmail: '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </form>
        )}

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
              onClick={() => fetchStores(1)}
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

        <div style={paginationRow}>
          <span>
            Showing page {page} of {totalPages} · Total {total} stores
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchStores(page - 1)}
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
              onClick={() => fetchStores(page + 1)}
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
