import React, { useState } from 'react';
import './Transport.css';

function Transport() {
  const [transportDetails, setTransportDetails] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_time: '',
    vehicle_type: 'luxury_sedan'
  });

  const vehicleTypes = [
    { id: 'luxury_sedan', name: 'Luxury Sedan', icon: '🚗' },
    { id: 'suv', name: 'Premium SUV', icon: '🚙' },
    { id: 'limousine', name: 'Limousine', icon: '🚘' },
    { id: 'sprinter', name: 'Sprinter Van', icon: '🚐' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Transport booked successfully! Our driver will contact you shortly.');
    setTransportDetails({
      pickup_location: '',
      dropoff_location: '',
      pickup_time: '',
      vehicle_type: 'luxury_sedan'
    });
  };

  return (
    <div className="transport-page container my-5">
      <h2 className="text-center mb-4">Luxury Transport Service</h2>
      <p className="text-center mb-5">Complimentary pickup for our guests</p>

      <div className="row">
        <div className="col-md-6">
          <div className="transport-info-card p-4">
            <h4 className="mb-3">Why Choose Our Transport?</h4>
            <ul className="list-unstyled">
              <li className="mb-3">✓ Professional chauffeurs</li>
              <li className="mb-3">✓ Luxury vehicle fleet</li>
              <li className="mb-3">✓ Real-time tracking</li>
              <li className="mb-3">✓ Complimentary WiFi</li>
              <li className="mb-3">✓ Refreshments included</li>
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="booking-form-card p-4">
            <h4 className="mb-4">Book Your Transfer</h4>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Pickup Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your current location"
                  value={transportDetails.pickup_location}
                  onChange={(e) => setTransportDetails({...transportDetails, pickup_location: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Dropoff Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Lucy Luxury Resort"
                  value={transportDetails.dropoff_location}
                  onChange={(e) => setTransportDetails({...transportDetails, dropoff_location: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Pickup Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={transportDetails.pickup_time}
                  onChange={(e) => setTransportDetails({...transportDetails, pickup_time: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Vehicle Type</label>
                <div className="row">
                  {vehicleTypes.map(vehicle => (
                    <div className="col-6 mb-2" key={vehicle.id}>
                      <div 
                        className={`vehicle-option p-2 text-center ${transportDetails.vehicle_type === vehicle.id ? 'selected' : ''}`}
                        onClick={() => setTransportDetails({...transportDetails, vehicle_type: vehicle.id})}
                      >
                        <span className="vehicle-icon">{vehicle.icon}</span>
                        <div>{vehicle.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-gold w-100">
                Book Transport
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transport;
