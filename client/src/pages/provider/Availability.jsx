import { useState, useEffect } from 'react';
import { getMyServices } from '../../api/services';
import { updateAvailability } from '../../api/me';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { Clock, Save } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ALL_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export default function Availability() {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchServices = async () => {
    try {
      const res = await getMyServices();
      setServices(res.data.services);
      if (res.data.services.length > 0) {
        selectService(res.data.services[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const selectService = (service) => {
    setActiveService(service);
    setAvailability(service.availability || []);
    setMsg({ type: '', text: '' });
  };

  const toggleDay = (day) => {
    const exists = availability.find((a) => a.day === day);
    if (exists) {
      setAvailability(availability.filter((a) => a.day !== day));
    } else {
      setAvailability([...availability, { day, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] }]);
    }
  };

  const toggleSlot = (day, slot) => {
    setAvailability(availability.map(a => {
      if (a.day === day) {
        const slots = a.slots.includes(slot) 
          ? a.slots.filter(s => s !== slot)
          : [...a.slots, slot].sort();
        return { ...a, slots };
      }
      return a;
    }));
  };

  const handleSave = async () => {
    if (!activeService) return;
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      await updateAvailability(activeService._id, availability);
      setMsg({ type: 'success', text: 'Availability updated successfully!' });
      // Update local state to match saved data
      setServices(services.map(s => s._id === activeService._id ? { ...s, availability } : s));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save availability' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Navbar /><Loader fullPage /></>;

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          <div className="page-header">
            <p className="page-header__eyebrow">Provider</p>
            <h1 style={{ fontStyle: 'italic' }}>Availability Manager</h1>
          </div>

          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
              <Clock size={48} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
              <h2 className="empty-state__title">No services found</h2>
              <p style={{ fontStyle: 'italic' }}>Create a service listing first to manage its availability.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
              {/* Sidebar: Service Selection */}
              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Your Services</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {services.map(s => (
                    <button 
                      key={s._id}
                      onClick={() => selectService(s)}
                      className={`btn ${activeService?._id === s._id ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main: Slot Editor */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-rule)' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic' }}>Editing: {activeService?.title}</h2>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                {msg.text && (
                  <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: 'var(--space-6)' }}>
                    {msg.text}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  {DAYS.map((day) => {
                    const dayData = availability.find(a => a.day === day);
                    const isActive = !!dayData;

                    return (
                      <div key={day} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                        <div style={{ width: '120px' }}>
                          <button 
                            className={`btn btn-sm btn-full ${isActive ? 'btn-outline' : 'btn-ghost'}`}
                            onClick={() => toggleDay(day)}
                            style={{ borderColor: isActive ? 'var(--color-accent)' : 'transparent', color: isActive ? 'var(--color-text)' : 'var(--color-muted)' }}
                          >
                            {day}
                          </button>
                        </div>
                        
                        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                          {isActive ? (
                            ALL_SLOTS.map(slot => {
                              const isSlotActive = dayData.slots.includes(slot);
                              return (
                                <button
                                  key={slot}
                                  className={`btn btn-sm ${isSlotActive ? 'btn-primary' : 'btn-outline'}`}
                                  onClick={() => toggleSlot(day, slot)}
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                  {slot}
                                </button>
                              );
                            })
                          ) : (
                            <div className="muted" style={{ fontSize: 'var(--text-sm)', padding: '6px 0', fontStyle: 'italic' }}>
                              Not available
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
