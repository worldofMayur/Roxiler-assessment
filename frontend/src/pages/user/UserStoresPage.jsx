import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/Layout/UserLayout.jsx';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import Table from '../../components/UI/Table.jsx';
import RatingStars from '../../components/UI/RatingStars.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function UserStoresPage() {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [savingStoreId, setSavingStoreId] = useState(null);
  const [ratingDrafts, setRatingDrafts] = useState({});

  async function fetchStores() {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          searchName: searchName || undefined,
          searchAddress: searchAddress || undefined,
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

  function handleChangeRating(storeId, value) {
    setRatingDrafts((prev) => ({ ...prev, [storeId]: value }));
  }

  async function handleSaveRating(storeId) {
    const value = Number(ratingDrafts[storeId]);
    if (!value) return;

    setSavingStoreId(storeId);
    try {
      await api.post(
        `/ratings/${storeId}`,
        { rating: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSavingStoreId(null);
    }
  }

  const card = {
    background: '#FFFFFF',
    borderRadius: 18,
    padding: '20px 20px 18px',
    boxShadow: '0 16px 30px rgba(15,23,42,0.08)',
    boxSizing: 'border-box',
  };

  const titleRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  };

  const title = {
    fontSize: 22,
    fontWeight: 600,
  };

  const subtitle = {
    fontSize: 13,
    color: '#6B7280',
  };

  const searchRow = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    margin: '14px 0 18px',
  };

  const errorText = {
    color: '#B91C1C',
    fontSize: 13,
    marginBottom: 10,
  };

  const columns = [
    { key: 'name', header: 'Store Name' },
    { key: 'address', header: 'Address' },
    { key: 'overall', header: 'Overall Rating' },
    { key: 'your', header: 'Your Rating' },
    { key: 'actions', header: 'Action' },
  ];

  const data = stores.map((s) => ({
    name: s.name,
    address: s.address,
    overall: <RatingStars value={Math.round(s.overallRating || 0)} />,
    your: <RatingStars value={s.userRating || 0} />,
    actions: (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <select
          value={ratingDrafts[s.id] ?? s.userRating ?? ''}
          onChange={(e) => handleChangeRating(s.id, e.target.value)}
          style={{
            padding: '6px 8px',
            borderRadius: 8,
            border: '1px solid #D1D5DB',
            background: '#F9FAFB',
            fontSize: 13,
          }}
        >
          <option value="">Rate…</option>
          {[1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <Button
          disabled={!ratingDrafts[s.id] || savingStoreId === s.id}
          onClick={() => handleSaveRating(s.id)}
          style={{
            padding: '6px 10px',
            fontSize: 13,
            borderRadius: 8,
            background: '#2563EB',
            border: 'none',
          }}
        >
          {savingStoreId === s.id ? 'Saving…' : 'Save'}
        </Button>
      </div>
    ),
  }));

  return (
    <UserLayout>
      <div style={card}>
        <div style={titleRow}>
          <div>
            <div style={title}>Stores</div>
            <div style={subtitle}>Browse stores and submit your ratings.</div>
          </div>
        </div>

        <div style={searchRow}>
          <Input
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            placeholder="Search by address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button
            onClick={fetchStores}
            style={{
              padding: '9px 14px',
              background: '#2563EB',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
            }}
          >
            Search
          </Button>
        </div>

        {loading && <p style={{ fontSize: 13, color: '#6B7280' }}>Loading stores…</p>}
        {error && <p style={errorText}>{error}</p>}

        {!loading && stores.length === 0 ? (
          <p style={{ fontSize: 13, color: '#6B7280' }}>No stores found.</p>
        ) : (
          <Table columns={columns} data={data} />
        )}
      </div>
    </UserLayout>
  );
}
