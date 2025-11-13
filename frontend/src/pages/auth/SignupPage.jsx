import React, { useState } from 'react';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import api from '../../api/client.js';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // TODO: Wire this to your backend /api/auth/signup (for normal user)
      await api.post('/auth/signup', { name, email, address, password });
      setSuccess('Signup successful. You can now log in.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#e5e7eb' }}>
      <form onSubmit={handleSubmit} style={{ width: 360, padding: 24, borderRadius: 12, background: '#020617', border: '1px solid #1f2937' }}>
        <h2 style={{ marginBottom: 16 }}>Signup</h2>
        {error && <p style={{ color: '#f87171', marginBottom: 8 }}>{error}</p>}
        {success && <p style={{ color: '#4ade80', marginBottom: 8 }}>{success}</p>}
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Address</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" style={{ width: '100%', marginTop: 8 }}>Create account</Button>
      </form>
    </div>
  );
}