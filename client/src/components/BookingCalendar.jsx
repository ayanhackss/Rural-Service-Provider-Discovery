import { useEffect, useState, useRef } from 'react';
import { getServiceSlots } from '../api/bookings';

const SLOT_TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookingCalendar({ service, onSlotSelect, selectedDate, selectedSlot }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [daySlots, setDaySlots] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (service?._id) {
      getServiceSlots(service._id).then((res) => setBookedSlots(res.data.bookings));
    }
  }, [service?._id]);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      fullDayName: d.toLocaleDateString('en-US', { weekday: 'long' })
    };
  });

  const handleDateClick = (dateInfo) => {
    // Haptic feedback if supported
    if (navigator.vibrate) navigator.vibrate(20);

    const bookedOnDay = bookedSlots
      .filter((b) => b.date.startsWith(dateInfo.dateStr))
      .map((b) => b.timeSlot);

    const dayAvailability = service?.availability?.find((a) => a.day === dateInfo.fullDayName);
    const providerSlots = dayAvailability?.slots || SLOT_TIMES;

    const available = providerSlots.filter((s) => !bookedOnDay.includes(s));
    setDaySlots(available);
    onSlotSelect && onSlotSelect(dateInfo.dateStr, null);
  };

  const handleSlotClick = (slot) => {
    if (navigator.vibrate) navigator.vibrate(30);
    onSlotSelect && onSlotSelect(selectedDate, slot);
  };

  return (
    <div className="booking-calendar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontStyle: 'italic' }}>Select a Date</h3>
      </div>
      
      {/* Horizontal Date Scroller */}
      <div 
        ref={scrollRef}
        className="date-scroller"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        {dates.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => handleDateClick(d)}
              className="card fade-in-up"
              style={{
                flex: '0 0 auto',
                width: '72px',
                padding: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-1)',
                border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-rule)',
                background: isSelected ? 'oklch(72% 0.18 80 / 0.1)' : 'var(--color-paper-2)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span className="label" style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-muted)', fontSize: '10px' }}>
                {d.dayName}
              </span>
              <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', lineHeight: 1 }}>
                {d.dayNumber}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="fade-in-up" style={{ marginTop: 'var(--space-6)' }}>
          <p className="label" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-accent)' }}>
            Available slots — {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {daySlots.length === 0 ? (
            <p className="muted" style={{ fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>No available slots on this day.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 'var(--space-3)' }}>
              {daySlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotClick(slot)}
                    className="card"
                    style={{
                      padding: 'var(--space-3)',
                      fontFamily: 'var(--font-outlier)',
                      fontSize: 'var(--text-sm)',
                      background: isSelected ? 'var(--color-accent)' : 'var(--color-paper-3)',
                      color: isSelected ? 'oklch(13% 0.010 80)' : 'var(--color-ink)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-rule)',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(0.98)' : 'scale(1)'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
