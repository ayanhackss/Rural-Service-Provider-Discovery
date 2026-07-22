import { useEffect, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getServiceSlots } from '../api/bookings';

const SLOT_TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookingCalendar({ service, onSlotSelect, selectedDate, selectedSlot }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [daySlots, setDaySlots] = useState([]);

  useEffect(() => {
    if (service?._id) {
      getServiceSlots(service._id).then((res) => setBookedSlots(res.data.bookings));
    }
  }, [service?._id]);

  // Build events for calendar — highlight booked dates
  const events = bookedSlots.map((b) => ({
    date: b.date.split('T')[0],
    title: b.timeSlot,
    color: b.status === 'confirmed' ? 'var(--color-error)' : 'var(--color-pending)',
  }));

  // When user clicks a day, compute available slots
  const handleDateClick = useCallback((info) => {
    const dateStr = info.dateStr;
    const bookedOnDay = bookedSlots
      .filter((b) => b.date.startsWith(dateStr))
      .map((b) => b.timeSlot);

    // Get provider availability for that day
    const dayName = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = service?.availability?.find((a) => a.day === dayName);
    const providerSlots = dayAvailability?.slots || SLOT_TIMES;

    const available = providerSlots.filter((s) => !bookedOnDay.includes(s));
    setDaySlots(available);
    onSlotSelect && onSlotSelect(dateStr, null); // reset slot when date changes
  }, [bookedSlots, service, onSlotSelect]);

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        height="auto"
        validRange={{ start: new Date().toISOString().split('T')[0] }}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
      />

      {selectedDate && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <p className="label" style={{ marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>
            Available slots — {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {daySlots.length === 0 ? (
            <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>No available slots on this day.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {daySlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSlotSelect && onSlotSelect(selectedDate, slot)}
                  className={`btn btn-sm ${selectedSlot === slot ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontFamily: 'var(--font-outlier)' }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
