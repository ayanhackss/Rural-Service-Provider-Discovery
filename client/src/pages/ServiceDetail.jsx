import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '../api/services';
import { createBooking } from '../api/bookings';
import { getServiceReviews } from '../api/reviews';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import BookingCalendar from '../components/BookingCalendar';
import StarRating from '../components/StarRating';
import Skeleton from '../components/Skeleton';
import Avatar from '../components/Avatar';
import { MapPin, Phone, MessageSquare, CheckCircle, User, Star } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Promise.all([getService(id), getServiceReviews(id)])
      .then(([sRes, rRes]) => {
        setService(sRes.data.service);
        setReviews(rRes.data.reviews);
      })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSlotSelect = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
  };

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!selectedDate || !selectedSlot) return toast.error('Please select a date and time slot.');

    if (navigator.vibrate) navigator.vibrate(50);
    setBookingLoading(true);
    try {
      await createBooking({ serviceId: id, date: selectedDate, timeSlot: selectedSlot, notes: bookingNotes });
      toast.success('Booking request sent! The provider will confirm shortly.', { duration: 4000 });
      setSelectedDate(null);
      setSelectedSlot(null);
      setBookingNotes('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReview = (e) => {
    e.preventDefault();
    toast('To leave a review, go to My Bookings and review a completed booking.', { icon: 'ℹ️' });
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <Skeleton height="300px" style={{ marginBottom: 'var(--space-6)' }} />
        <Skeleton height="400px" />
      </div>
    </>
  );

  const provider = service.providerId;

  return (
    <>
      <Navbar />
      <main>
        {/* ── HERO SECTION ── */}
        <section className="section" style={{ background: 'var(--color-paper-2)', borderBottom: '1px solid var(--color-rule)', paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-12)' }}>
          <div className="container">
            <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '900px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span className="badge" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-paper)', border: 'none' }}>{service.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-ink-dim)', fontSize: 'var(--text-sm)' }}>
                  <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                  {service.averageRating ? service.averageRating.toFixed(1) : 'New'} 
                  {service.totalReviews > 0 && ` (${service.totalReviews} reviews)`}
                </span>
              </div>
              
              <h1 className="display" style={{ marginBottom: 'var(--space-2)' }}>{service.title}</h1>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-4xl)', color: 'var(--color-accent)', lineHeight: 1 }}>
                  ₹{service.priceRange?.min} – ₹{service.priceRange?.max}
                </span>
                <span className="label" style={{ color: 'var(--color-muted)', paddingBottom: '4px' }}>Estimated cost</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT GRID ── */}
        <section className="section" style={{ paddingTop: 'var(--space-12)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-12)', alignItems: 'start' }}>
              
              {/* Left — Details & Reviews */}
              <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                
                {/* About Provider Profile Card */}
                <div className="card" style={{ marginBottom: 'var(--space-10)', display: 'flex', gap: 'var(--space-6)', alignItems: 'center', background: 'var(--color-paper)', padding: 'var(--space-6)', border: '1px solid var(--color-rule)' }}>
                  <Avatar name={provider?.name} size={80} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>{provider?.name}</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-ink-dim)', fontSize: 'var(--text-sm)' }}>
                        <MapPin size={16} />
                        {provider?.location?.village} {provider?.location?.pinCode && `(${provider.location.pinCode})`}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-ink-dim)', fontSize: 'var(--text-sm)' }}>
                        <Phone size={16} />
                        +91 {provider?.phone}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', paddingLeft: 'var(--space-6)', borderLeft: '1px solid var(--color-rule)' }}>
                    <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', lineHeight: 1 }}>
                      {provider?.totalBookings || 0}
                    </div>
                    <div className="label" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>Jobs done</div>
                  </div>
                </div>

                {/* Service Description */}
                <h2 style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)' }}>Service Description</h2>
                <p style={{ lineHeight: 1.8, color: 'var(--color-ink-dim)', marginBottom: 'var(--space-12)', fontSize: 'var(--text-md)', maxWidth: 'var(--max-prose)' }}>
                  {service.description}
                </p>

                <hr className="rule" style={{ marginBottom: 'var(--space-10)' }} />

                {/* Reviews */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
                    <h2 style={{ fontStyle: 'italic' }}>Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>
                    {user?.role === 'resident' && (
                      <button className="btn btn-ghost btn-sm" onClick={handleReview}>Write a review</button>
                    )}
                  </div>

                  {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-muted)' }}>
                      <MessageSquare size={40} strokeWidth={1} style={{ marginBottom: 'var(--space-4)', opacity: 0.5, margin: '0 auto' }} />
                      <p style={{ fontStyle: 'italic' }}>No reviews yet. Be the first after booking!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      {reviews.map((r) => (
                        <div key={r._id} className="card hover-lift" style={{ padding: 'var(--space-6)', border: '1px solid var(--color-rule)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                              <Avatar name={r.residentId?.name} size={32} />
                              <span style={{ fontWeight: 500 }}>{r.residentId?.name || 'Resident'}</span>
                            </div>
                            <StarRating rating={r.rating} size="sm" />
                          </div>
                          {r.comment && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-dim)', lineHeight: 1.6, marginTop: 'var(--space-3)' }}>{r.comment}</p>}
                          <p style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)', color: 'var(--color-neutral)', marginTop: 'var(--space-4)' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right — Sticky Booking Panel */}
              <div className="fade-in-up" style={{ position: 'sticky', top: 'calc(65px + var(--space-6))', animationDelay: '0.4s' }}>
                <div className="card" style={{ padding: 'var(--space-6)', border: '1px solid var(--color-rule)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>Book this service</h2>

                  {(user?.role === 'provider' || user?.role === 'admin') && (
                    <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
                      {user.role === 'provider' ? 'Providers cannot book services.' : 'Admins cannot book services.'}
                    </div>
                  )}

                  {(!user || user.role === 'resident') && (
                    <>
                      <BookingCalendar
                        service={service}
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        onSlotSelect={handleSlotSelect}
                      />

                      {selectedDate && selectedSlot && (
                        <div className="fade-in-up" style={{ marginTop: 'var(--space-5)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-accent)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 500, background: 'var(--color-paper-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                            <CheckCircle size={18} />
                            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {selectedSlot}
                          </div>

                          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label" htmlFor="booking-notes">Notes for provider (optional)</label>
                            <textarea
                              id="booking-notes"
                              className="form-textarea"
                              value={bookingNotes}
                              onChange={(e) => setBookingNotes(e.target.value)}
                              placeholder="Describe your issue…"
                              rows={3}
                            />
                          </div>

                          <button className="btn btn-primary btn-full" onClick={handleBook} disabled={bookingLoading} style={{ height: '48px', fontSize: 'var(--text-md)' }}>
                            {bookingLoading ? 'Sending request…' : user ? 'Request booking' : 'Sign in to book'}
                          </button>
                          
                          <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-3)' }}>
                            You won't be charged yet.
                          </p>
                        </div>
                      )}

                      {!selectedDate && (
                        <p className="muted" style={{ textAlign: 'center', fontSize: 'var(--text-sm)', marginTop: 'var(--space-6)' }}>
                          Click a date on the calendar to see available slots
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
