import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      // TODO: Wire this to your backend /api/auth/login
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(user, token);

      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'USER') navigate('/user/stores');
      else if (user.role === 'OWNER') navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#e5e7eb' }}>
      <form onSubmit={handleSubmit} style={{ width: 320, padding: 24, borderRadius: 12, background: '#020617', border: '1px solid #1f2937' }}>
        <h2 style={{ marginBottom: 16 }}>Login</h2>
        {error && <p style={{ color: '#f87171', marginBottom: 8 }}>{error}</p>}
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" style={{ width: '100%', marginTop: 8 }}>Sign in</Button>
      </form>
    </div>
  );
}