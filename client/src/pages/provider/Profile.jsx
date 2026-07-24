import { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { User, MapPin, AlignLeft, Save } from 'lucide-react';

export default function ProviderProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    pinCode: '',
    bio: '',
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
          bio: user.bio || '',
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
      await updateMyProfile({
        name: formData.name,
        phone: formData.phone,
        location: { village: formData.village, pinCode: formData.pinCode },
        bio: formData.bio,
      });
      setSuccess('Profile updated successfully!');
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
          <div className="page-header">
            <p className="page-header__eyebrow">Provider</p>
            <h1 style={{ fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>My Profile</h1>
          </div>
          
          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{success}</div>}

          <form onSubmit={handleSubmit} className="card">
            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <User size={20} className="muted" /> Basic Information
            </h3>
            
            <div className="form-group">
              <label>Full Name / Business Name</label>
              <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><AlignLeft size={16} className="muted" /> About You / Bio</label>
              <textarea 
                name="bio" 
                className="input" 
                rows="4" 
                value={formData.bio} 
                onChange={handleChange}
                placeholder="Tell customers about your experience, skills, and the quality of your work..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ margin: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)' }}></div>

            <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={20} className="muted" /> Service Area (Location)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label>Village / Town</label>
                <input type="text" name="village" className="input" value={formData.village} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>PIN Code</label>
                <input type="text" name="pinCode" className="input" value={formData.pinCode} onChange={handleChange} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
