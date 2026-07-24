import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Lock, Save } from 'lucide-react';

export default function Profile() {
  const { login } = useAuth(); // to update context if needed
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    pinCode: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const user = res.data.user;
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          phone: user.phone || '',
          village: user.location?.village || '',
          pinCode: user.location?.pinCode || '',
        }));
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        location: { village: formData.village, pinCode: formData.pinCode }
      };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      const res = await updateMyProfile(payload);
      // optionally update the auth context user data
      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>My Profile</h1>
          
          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{success}</div>}

          <form onSubmit={handleSubmit} className="card">
            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <User size={20} className="muted" /> Personal Details
            </h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} />
            </div>

            <div style={{ margin: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)' }}></div>

            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={20} className="muted" /> Location
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label>Village</label>
                <input type="text" name="village" className="input" value={formData.village} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>PIN Code</label>
                <input type="text" name="pinCode" className="input" value={formData.pinCode} onChange={handleChange} />
              </div>
            </div>

            <div style={{ margin: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)' }}></div>

            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Lock size={20} className="muted" /> Change Password
            </h3>
            <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>Leave blank if you don't want to change it.</p>

            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" className="input" value={formData.currentPassword} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" className="input" value={formData.newPassword} onChange={handleChange} minLength="6" />
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
