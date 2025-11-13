import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/UI/Input.jsx';
import Button from '../../components/UI/Button.jsx';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(user, token);

      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'USER') navigate('/user/stores');
      else navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  // --- Styles for layout matching reference ---
  const page = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F4F5FB', // light grey
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
    marginBottom: 16,
  };

  const smallLink = {
    fontSize: 12,
    color: '#2563EB',
    textDecoration: 'none',
  };

  const forgotRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
      {/* Top icon */}
   

      <h1 style={heading}>Welcome Back!</h1>
      <p style={subheading}>Log in to Your Account</p>

      <div style={card}>
        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email / username */}
          <div style={fieldBlock}>
            <div style={label}>Email or Username</div>
            <Input
              type="email"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={fieldBlock}>
            <div style={forgotRow}>
              <span style={label}>Password</span>
              <a href="#!" style={smallLink}>
                Forgot Password?
              </a>
            </div>
            <div style={pwWrapper}>
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
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
            {loading ? 'Logging in…' : 'Log In'}
          </Button>
        </form>
      </div>

      <div style={bottomText}>
        Don&apos;t have an account?
        <Link to="/signup" style={bottomLink}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
