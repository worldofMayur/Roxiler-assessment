import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminStoresPage from '../pages/admin/AdminStoresPage.jsx';

import UserStoresPage from '../pages/user/UserStoresPage.jsx';
import OwnerDashboardPage from '../pages/owner/OwnerDashboardPage.jsx';

import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminStoresPage />
          </ProtectedRoute>
        }
      />

      {/* User routes */}
      <Route
        path="/user/stores"
        element={
          <ProtectedRoute roles={['USER']}>
            <UserStoresPage />
          </ProtectedRoute>
        }
      />

      {/* Owner routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute roles={['OWNER']}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
