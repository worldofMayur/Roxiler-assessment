import React, { useEffect, useState } from 'react';
import OwnerLayout from '../../components/Layout/OwnerLayout.jsx';
import Table from '../../components/UI/Table.jsx';
import RatingStars from '../../components/UI/RatingStars.jsx';
import Button from '../../components/UI/Button.jsx';
import Input from '../../components/UI/Input.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function OwnerDashboardPage() {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0,
  });
  const [stores, setStores] = useState([]);
  const [selectedStoreDetails, setSelectedStoreDetails] = useState(null);

  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingRaters, setLoadingRaters] = useState(false);
  const [error, setError] = useState('');

  // pagination for owner stores
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // create / edit form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
  });

  function updateForm(field, value) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchStats() {
    if (!token) return;
    setLoadingStats(true);
    setError('');
    try {
      const res = await api.get('/owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load owner dashboard');
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchStores(nextPage = page) {
    if (!token) return;
    setLoadingStores(true);
    setError('');
    try {
      const res = await api.get('/owner/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
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
      setLoadingStores(false);
    }
  }

  async function fetchRaters(storeId) {
    if (!token) return;
    setLoadingRaters(true);
    setError('');
    try {
      const res = await api.get(`/owner/stores/${storeId}/raters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedStoreDetails(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load raters');
      setSelectedStoreDetails(null);
    } finally {
      setLoadingRaters(false);
    }
  }

  useEffect(() => {
    fetchStats();
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
      };

      if (formValues.id == null) {
        // create
        await api.post('/owner/stores', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // update
        await api.put(`/owner/stores/${formValues.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // reset form
      setFormValues({
        id: null,
        name: '',
        email: '',
        address: '',
      });
      setShowCreateForm(false);
      setShowEditForm(false);

      // refresh data
      await Promise.all([fetchStores(1), fetchStats()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save store');
    } finally {
      setSaving(false);
    }
  }

  const grid = {
    display: 'grid',
    gridTemplateColumns: '2fr 3fr',
    gap: 16,
  };

  const statsCard = {
    background: '#FFFFFF',
    borderRadius: 18,
    padding: '18px 18px 16px',
    boxShadow: '0 12px 24px rgba(15,23,42,0.06)',
    border: '1px solid #E5E7EB',
    marginBottom: 18,
  };

  const statsTitle = {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 8,
  };

  const statsSubtitle = {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  };

  const statsRow = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: 12,
  };

  const statBox = {
    background: '#F9FAFB',
    borderRadius: 12,
    padding: '10px 12px',
    border: '1px solid #E5E7EB',
  };

  const statLabel = {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  };

  const statValue = {
    fontSize: 18,
    fontWeight: 600,
  };

  const card = {
    background: '#FFFFFF',
    borderRadius: 18,
    padding: '18px 18px 16px',
    boxShadow: '0 12px 24px rgba(15,23,42,0.06)',
    border: '1px solid #E5E7EB',
  };

  const headerRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  };

  const sectionTitle = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
  };

  const sectionSubtitle = {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  };

  const errorText = {
    color: '#B91C1C',
    fontSize: 13,
    marginTop: 8,
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
    gridTemplateColumns: 'repeat(3, minmax(0,1fr)) auto',
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
    { key: 'name', header: 'Store' },
    { key: 'address', header: 'Address' },
    { key: 'rating', header: 'Average Rating' },
    { key: 'count', header: 'Total Ratings' },
    { key: 'actions', header: 'Actions' },
  ];

  const data = stores.map((s) => ({
    name: s.name,
    address: s.address,
    rating: <RatingStars value={Math.round(s.averageRating || 0)} />,
    count: s.ratingsCount,
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
          onClick={() => fetchRaters(s.id)}
        >
          View raters
        </Button>
        <Button
          style={{
            padding: '6px 10px',
            fontSize: 13,
            borderRadius: 8,
            background: '#111827',
            border: 'none',
          }}
          onClick={() => {
            setFormValues({
              id: s.id,
              name: s.name || '',
              email: s.email || '',
              address: s.address || '',
            });
            setShowEditForm(true);
            setShowCreateForm(false);
          }}
        >
          Edit
        </Button>
      </div>
    ),
  }));

  // raters table
  const ratersColumns = [
    { key: 'name', header: 'User' },
    { key: 'email', header: 'Email' },
    { key: 'rating', header: 'Rating' },
  ];

  const ratersData =
    selectedStoreDetails?.raters?.map((r) => ({
      name: r.name,
      email: r.email,
      rating: <RatingStars value={r.rating} />,
    })) || [];

  return (
    <OwnerLayout>
      {/* Stats on top */}
      <div style={statsCard}>
        <div style={statsTitle}>Overview</div>
        <div style={statsSubtitle}>
          Summary of your stores and how customers are rating them.
        </div>

        {loadingStats && (
          <p style={{ fontSize: 13, color: '#6B7280' }}>Loading stats…</p>
        )}

        <div style={statsRow}>
          <div style={statBox}>
            <div style={statLabel}>Your Stores</div>
            <div style={statValue}>{stats.totalStores}</div>
          </div>
          <div style={statBox}>
            <div style={statLabel}>Total Ratings</div>
            <div style={statValue}>{stats.totalRatings}</div>
          </div>
          <div style={statBox}>
            <div style={statLabel}>Average Rating</div>
            <div style={statValue}>
              {stats.averageRating.toFixed
                ? stats.averageRating.toFixed(1)
                : stats.averageRating}
            </div>
          </div>
        </div>
      </div>

      {error && <p style={errorText}>{error}</p>}

      {/* Stores + raters grid */}
      <div style={grid}>
        {/* Stores list + create/edit */}
        <div style={card}>
          <div style={headerRow}>
            <div>
              <div style={sectionTitle}>Your Stores</div>
              <div style={sectionSubtitle}>
                Each store with its average rating and number of ratings.
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
              <div
                style={{
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
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
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-end',
                  }}
                >
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
                  {(showCreateForm || showEditForm) &&
                    (
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

          {loadingStores && (
            <p style={{ fontSize: 13, color: '#6B7280' }}>Loading stores…</p>
          )}

          {stores.length === 0 && !loadingStores ? (
            <p style={{ fontSize: 13, color: '#6B7280' }}>
              You don&apos;t own any stores yet. Use &quot;Add Store&quot; to
              create one.
            </p>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Raters list */}
        <div style={card}>
          <div style={sectionTitle}>Users who rated</div>
          <div style={sectionSubtitle}>
            Select a store to see all users and their ratings.
          </div>

          {loadingRaters && (
            <p style={{ fontSize: 13, color: '#6B7280' }}>Loading raters…</p>
          )}

          {!selectedStoreDetails ? (
            <p style={{ fontSize: 13, color: '#6B7280' }}>
              Click &quot;View raters&quot; on a store to see details.
            </p>
          ) : ratersData.length === 0 ? (
            <p style={{ fontSize: 13, color: '#6B7280' }}>
              No ratings yet for{' '}
              <strong>{selectedStoreDetails.store.name}</strong>.
            </p>
          ) : (
            <>
              <p
                style={{
                  fontSize: 13,
                  color: '#4B5563',
                  marginBottom: 8,
                }}
              >
                Store: <strong>{selectedStoreDetails.store.name}</strong> ·{' '}
                Average rating:{' '}
                <strong>
                  {selectedStoreDetails.averageRating.toFixed
                    ? selectedStoreDetails.averageRating.toFixed(1)
                    : selectedStoreDetails.averageRating}
                </strong>
              </p>
              <Table columns={ratersColumns} data={ratersData} />
            </>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
