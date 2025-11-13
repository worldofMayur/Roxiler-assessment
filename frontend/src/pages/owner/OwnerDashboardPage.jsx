import React from 'react';
import OwnerLayout from '../../components/Layout/OwnerLayout.jsx';

export default function OwnerDashboardPage() {
  // TODO: Fetch /api/owner/dashboard and show who rated the store + average rating
  return (
    <OwnerLayout>
      <h1>Owner Dashboard</h1>
      <p>This is a skeleton. Next steps: call /api/owner/dashboard and render rating data.</p>
    </OwnerLayout>
  );
}