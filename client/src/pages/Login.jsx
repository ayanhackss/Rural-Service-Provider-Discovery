import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      login(data.token, data.user);
      const dest = data.user.role === 'provider'
        ? '/provider/listings'
        : data.user.role === 'admin'
        ? '/admin'
        : from === '/' ? '/services' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      const serverMsg = err.response?.data?.message 
        || (typeof err.response?.data === 'string' && err.response.data.trim() ? err.response.data.trim().slice(0, 120) : null);
      const statusInfo = err.response?.status ? `(Status: ${err.response.status})` : '';
      const fallbackMsg = err.message || 'Unable to connect to server';
      setError(`${serverMsg || fallbackMsg} ${statusInfo}`.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>Welcome back</p>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontStyle: 'italic' }}>Sign in to GraamSeva</h1>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--color-accent)' }}>Join free</Link>
          </p>
        </div>
      </main>
    </>
  );
}
