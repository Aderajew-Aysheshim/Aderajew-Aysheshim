import React, { useState } from 'react';
import './Gym.css';

function Gym() {
  const [bookingDate, setBookingDate] = useState('');

  // Mock data for gym schedule
  const schedule = [
    {
      id: 1,
      time_slot: 'Morning',
      start_time: '06:00',
      end_time: '08:00',
      max_capacity: 20,
      current_bookings: 5
    },
    {
      id: 2,
      time_slot: 'Late Morning',
      start_time: '08:00',
      end_time: '10:00',
      max_capacity: 20,
      current_bookings: 8
    },
    {
      id: 3,
      time_slot: 'Afternoon',
      start_time: '12:00',
      end_time: '14:00',
      max_capacity: 20,
      current_bookings: 12
    },
    {
      id: 4,
      time_slot: 'Evening',
      start_time: '16:00',
      end_time: '18:00',
      max_capacity: 20,
      current_bookings: 15
    },
    {
      id: 5,
      time_slot: 'Night',
      start_time: '18:00',
      end_time: '20:00',
      max_capacity: 20,
      current_bookings: 10
    }
  ];

  const handleBooking = (slot) => {
    if (!bookingDate) {
      alert('Please select a date');
      return;
    }
    alert(`Gym session booked for ${bookingDate} at ${slot.time_slot}`);
  };

  return (
    <div className="gym-page container my-5">
      <h2 className="text-center mb-4">Gym & Wellness Center</h2>
      <p className="text-center mb-5">State-of-the-art facilities with professional trainers</p>

      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="row">
        {schedule.map(slot => (
          <div className="col-md-4 mb-4" key={slot.id}>
            <div className="card gym-card">
              <div className="card-body">
                <h5 className="card-title">{slot.time_slot} Session</h5>
                <p className="card-text">
                  <strong>Time:</strong> {slot.start_time} - {slot.end_time}
                </p>
                <p className="card-text">
                  <strong>Available Spots:</strong> {slot.max_capacity - slot.current_bookings} / {slot.max_capacity}
                </p>
                
                {slot.current_bookings < slot.max_capacity ? (
                  <button 
                    className="btn btn-gold w-100"
                    onClick={() => handleBooking(slot)}
                    disabled={!bookingDate}
                  >
                    Book Session
                  </button>
                ) : (
                  <button className="btn btn-secondary w-100" disabled>
                    Full
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Luxury Amenities */}
      <div className="amenities-section mt-5">
        <h3 className="text-center mb-4">Luxury Amenities</h3>
        <div className="row">
          <div className="col-md-3 col-6 mb-3">
            <div className="amenity-item text-center">
              <div className="amenity-icon">🧖‍♂️</div>
              <p>Steam Room</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="amenity-item text-center">
              <div className="amenity-icon">🏊‍♂️</div>
              <p>Infinity Pool</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="amenity-item text-center">
              <div className="amenity-icon">🧘‍♀️</div>
              <p>Yoga Studio</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="amenity-item text-center">
              <div className="amenity-icon">💆‍♀️</div>
              <p>Spa Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gym;
