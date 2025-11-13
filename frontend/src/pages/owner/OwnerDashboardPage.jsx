import React, { useEffect, useState } from 'react';
import OwnerLayout from '../../components/Layout/OwnerLayout.jsx';
import Table from '../../components/UI/Table.jsx';
import RatingStars from '../../components/UI/RatingStars.jsx';
import Button from '../../components/UI/Button.jsx';
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

  async function fetchStores() {
    if (!token) return;
    setLoadingStores(true);
    setError('');
    try {
      const res = await api.get('/owner/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data.stores || []);
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
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

  const columns = [
    { key: 'name', header: 'Store' },
    { key: 'address', header: 'Address' },
    { key: 'rating', header: 'Average Rating' },
    { key: 'count', header: 'Total Ratings' },
    { key: 'actions', header: 'Details' },
  ];

  const data = stores.map((s) => ({
    name: s.name,
    address: s.address,
    rating: <RatingStars value={Math.round(s.averageRating || 0)} />,
    count: s.ratingsCount,
    actions: (
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
              {stats.averageRating.toFixed ? stats.averageRating.toFixed(1) : stats.averageRating}
            </div>
          </div>
        </div>
      </div>

      {error && <p style={errorText}>{error}</p>}

      {/* Stores + raters grid */}
      <div style={grid}>
        {/* Stores list */}
        <div style={card}>
          <div style={sectionTitle}>Your Stores</div>
          <div style={sectionSubtitle}>
            Each store with its average rating and number of ratings.
          </div>

          {loadingStores && (
            <p style={{ fontSize: 13, color: '#6B7280' }}>Loading stores…</p>
          )}

          {stores.length === 0 && !loadingStores ? (
            <p style={{ fontSize: 13, color: '#6B7280' }}>
              You don&apos;t own any stores yet.
            </p>
          ) : (
            <Table columns={columns} data={data} />
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
              No ratings yet for <strong>{selectedStoreDetails.store.name}</strong>.
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
