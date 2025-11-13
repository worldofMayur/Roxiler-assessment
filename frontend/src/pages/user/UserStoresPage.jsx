import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/Layout/UserLayout.jsx';
import Table from '../../components/UI/Table.jsx';
import RatingStars from '../../components/UI/RatingStars.jsx';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function UserStoresPage() {
  const { token } = useAuth();

  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [savingStoreId, setSavingStoreId] = useState(null);

  async function fetchStores(nextPage = page) {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          searchName: searchName || undefined,
          searchAddress: searchAddress || undefined,
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

  async function handleRate(storeId, value) {
    if (!token) return;
    setSavingStoreId(storeId);
    setError('');
    try {
      await api.post(
        `/ratings/${storeId}`,
        { rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchStores(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSavingStoreId(null);
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
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr)) auto',
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
    { key: 'name', header: 'Store' },
    { key: 'address', header: 'Address' },
    { key: 'overallRating', header: 'Overall Rating' },
    { key: 'userRating', header: 'Your Rating' },
    { key: 'actions', header: 'Rate' },
  ];

  const data = stores.map((s) => ({
    name: s.name,
    address: s.address,
    overallRating: <RatingStars value={Math.round(s.overallRating || 0)} />,
    userRating: s.userRating ? (
      <RatingStars value={s.userRating} />
    ) : (
      <span style={{ fontSize: 13, color: '#6B7280' }}>Not rated yet</span>
    ),
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handleRate(s.id, val)}
            disabled={savingStoreId === s.id}
            style={{
              padding: '4px 8px',
              borderRadius: 999,
              border:
                s.userRating === val
                  ? '1px solid #2563EB'
                  : '1px solid #D1D5DB',
              background:
                s.userRating === val ? 'rgba(37,99,235,0.08)' : '#FFFFFF',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {val}
          </button>
        ))}
      </div>
    ),
  }));

  return (
    <UserLayout>
      <div style={card}>
        <div style={headerRow}>
          <div>
            <div style={title}>Stores</div>
            <div style={subtitle}>
              Browse stores and rate your experience from 1 to 5 stars.
            </div>
          </div>
        </div>

        <div style={filtersRow}>
          <Input
            placeholder="Search by store name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            placeholder="Search by address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
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

        {error && <p style={errorText}>{error}</p>}
        {loading && (
          <p style={{ fontSize: 13, color: '#6B7280' }}>Loading stores…</p>
        )}

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
    </UserLayout>
  );
}
