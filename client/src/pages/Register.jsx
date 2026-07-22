import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ROLES = [
  { value: 'resident', label: 'Resident', desc: 'Find and book local services' },
  { value: 'provider', label: 'Service Provider', desc: 'List your services and accept bookings' },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'resident', phone: '',
    location: { village: '', pinCode: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await registerApi(form);
      login(data.token, data.user);
      if (data.user.role === 'provider') {
        navigate('/provider/listings');
      } else {
        navigate('/services');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setLocation = (field, value) => setForm((f) => ({ ...f, location: { ...f.location, [field]: value } }));

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>Create account</p>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontStyle: 'italic' }}>Join GraamSeva</h1>
          </div>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set('role', r.value)}
                style={{
                  padding: 'var(--space-4)',
                  border: `1px solid ${form.role === r.value ? 'var(--color-accent)' : 'var(--color-rule)'}`,
                  borderRadius: 'var(--radius-sm)',
                  background: form.role === r.value ? 'oklch(72% 0.18 80 / 0.10)' : 'var(--color-paper-2)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 500, color: form.role === r.value ? 'var(--color-accent)' : 'var(--color-ink)', marginBottom: 'var(--space-1)' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{r.desc}</div>
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>{error}</div>}

          {form.role === 'provider' && (
            <div className="alert alert-info" style={{ marginBottom: 'var(--space-5)' }}>
              Provider accounts require admin approval before your listings go live.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" type="text" className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" className="form-input" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} autoComplete="new-password" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone number</label>
              <input id="phone" type="tel" className="form-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="village">Village / Town</label>
                <input id="village" type="text" className="form-input" value={form.location.village} onChange={(e) => setLocation('village', e.target.value)} placeholder="Ramnagar" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pincode">PIN code</label>
                <input id="pincode" type="text" className="form-input" value={form.location.pinCode} onChange={(e) => setLocation('pinCode', e.target.value)} placeholder="110001" maxLength={6} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
