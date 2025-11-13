import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import api from '../../api/client.js';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/signup', { name, email, address, password });
      setSuccess('Account created successfully. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  // --- shared layout style with login page ---
  const page = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F4F5FB',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#111827',
    padding: '24px 16px',
    boxSizing: 'border-box',
  };

  const iconCircle = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: 26,
    marginBottom: 18,
  };

  const heading = {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 4,
    textAlign: 'center',
  };

  const subheading = {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  };

  const card = {
    width: '100%',
    maxWidth: 420,
    background: '#FFFFFF',
    borderRadius: 18,
    padding: '24px 24px 22px',
    boxShadow: '0 16px 30px rgba(15,23,42,0.12)',
    boxSizing: 'border-box',
  };

  const label = {
    fontSize: 13,
    fontWeight: 500,
    color: '#111827',
    marginBottom: 6,
  };

  const fieldBlock = {
    marginBottom: 14,
  };

  const helperText = {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  };

  const pwWrapper = {
    position: 'relative',
  };

  const pwToggle = {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    color: '#6B7280',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const errorBox = {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(248,113,113,0.4)',
    color: '#B91C1C',
    fontSize: 12,
    padding: '8px 10px',
    borderRadius: 8,
    marginBottom: 12,
  };

  const successBox = {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(74,222,128,0.5)',
    color: '#15803D',
    fontSize: 12,
    padding: '8px 10px',
    borderRadius: 8,
    marginBottom: 12,
  };

  const bottomText = {
    marginTop: 18,
    fontSize: 13,
    color: '#6B7280',
  };

  const bottomLink = {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: 600,
    marginLeft: 4,
  };

  return (
    <div style={page}>

      <h1 style={heading}>Create Account</h1>
      <p style={subheading}>Sign up to start rating and managing stores.</p>

      <div style={card}>
        {error && <div style={errorBox}>{error}</div>}
        {success && <div style={successBox}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={fieldBlock}>
            <div style={label}>Full Name</div>
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={helperText}>Name must be 20–60 characters.</div>
          </div>

          {/* Email */}
          <div style={fieldBlock}>
            <div style={label}>Email</div>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Address */}
          <div style={fieldBlock}>
            <div style={label}>Address</div>
            <Input
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={fieldBlock}>
            <div style={label}>Password</div>
            <div style={pwWrapper}>
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 36 }}
              />
              <span
                style={pwToggle}
                onClick={() => setShowPw((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPw ? '🙈' : '👁️'}
              </span>
            </div>
            <div style={helperText}>
              8–16 chars, at least one uppercase letter and one special character.
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 6,
              padding: '11px 14px',
              borderRadius: 10,
              background: '#2563EB',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 14,
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>
      </div>

      <div style={bottomText}>
        Already have an account?
        <Link to="/login" style={bottomLink}>
          Log In
        </Link>
      </div>
    </div>
  );
}
