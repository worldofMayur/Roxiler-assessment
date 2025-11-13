import React from 'react';
import UserLayout from '../../components/Layout/UserLayout.jsx';

export default function UserStoresPage() {
  // TODO: Fetch /api/stores with search + current user rating
  return (
    <UserLayout>
      <h1>Stores</h1>
      <p>This is a skeleton. Next steps: call /api/stores and show list with ratings.</p>
    </UserLayout>
  );
}