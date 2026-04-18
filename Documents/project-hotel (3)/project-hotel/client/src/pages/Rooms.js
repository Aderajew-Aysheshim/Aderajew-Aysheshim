import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRooms, bookRoom } from '../services/api';
import './Rooms.css';

function Rooms({ user }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [bookingDetails, setBookingDetails] = useState({
    check_in: '',
    check_out: '',
    guests: 2
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  const roomDetailsMap = {
    1: {
      id: 1,
      name: 'Deluxe Ocean Suite',
      longDescription: 'Wake up to the sound of waves in this spacious suite designed for ultimate comfort and elegance.',
      size: '65 m²',
      bedType: 'King Size Bed',
      view: 'Ocean View',
      floor: '5th-8th Floor',
      images: [
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', alt: 'Living Area', type: 'living' },
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733433?w=800', alt: 'Bedroom', type: 'bedroom' },
        { url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800', alt: 'Bathroom', type: 'bathroom' }
      ],
      amenities: [
        { name: 'Ocean View', icon: '🌊' }, { name: 'Private Balcony', icon: '🏖️' },
        { name: 'King Size Bed', icon: '🛏️' }, { name: 'Rain Shower', icon: '🚿' },
        { name: 'Jacuzzi Tub', icon: '🛁' }, { name: 'Smart TV', icon: '📺' },
        { name: 'Mini Bar', icon: '🍷' }, { name: 'Free WiFi', icon: '📶' }
      ]
    },
    2: {
      id: 2,
      name: 'Executive Suite',
      longDescription: 'Designed with the discerning traveler in mind, combining business functionality with luxury comfort.',
      size: '80 m²',
      bedType: 'King Size Bed + Sofa Bed',
      view: 'City View',
      floor: '10th-15th Floor',
      images: [
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733433?w=800', alt: 'Living Area', type: 'living' },
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', alt: 'Bedroom', type: 'bedroom' }
      ],
      amenities: [
        { name: 'City View', icon: '🌆' }, { name: 'Workspace', icon: '💼' },
        { name: 'King Size Bed', icon: '🛏️' }, { name: 'Smart TV', icon: '📺' },
        { name: 'Coffee Machine', icon: '☕' }, { name: 'Free WiFi', icon: '📶' }
      ]
    },
    3: {
      id: 3,
      name: 'Presidential Suite',
      longDescription: 'The ultimate in luxury accommodation with panoramic views and world-class amenities.',
      size: '150 m²',
      bedType: 'King Size Bed',
      view: 'Panoramic Ocean View',
      floor: 'Top Floor',
      images: [
        { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', alt: 'Living Room', type: 'living' },
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', alt: 'Bedroom', type: 'bedroom' }
      ],
      amenities: [
        { name: 'Panoramic View', icon: '🌅' }, { name: 'Private Pool', icon: '🏊' },
        { name: 'Butler Service', icon: '🛎️' }, { name: 'Jacuzzi', icon: '🛁' },
        { name: 'Smart TV', icon: '📺' }, { name: 'Spa Access', icon: '💆' }
      ]
    }
  };

  const getRoomDetails = (room) => {
    return roomDetailsMap[room.id] || {
      longDescription: room.description || 'A comfortable room for your stay.',
      size: '50 m²',
      bedType: 'Double Bed',
      view: 'Garden View',
      floor: '1st-5th Floor',
      images: [{ url: room.image_url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', alt: room.room_type || 'Room', type: 'room' }],
      amenities: [{ name: 'WiFi', icon: '📶' }, { name: 'TV', icon: '📺' }, { name: 'AC', icon: '❄️' }]
    };
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialIndexes = {};
    rooms.forEach(room => {
      initialIndexes[room.id] = 0;
    });
    setActiveImageIndex(initialIndexes);
  }, [rooms]);

  const nextImage = (roomId) => {
    const roomImages = getRoomImages(rooms.find(r => r.id === roomId));
    setActiveImageIndex(prev => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % roomImages.length
    }));
  };

  const prevImage = (roomId) => {
    const roomImages = getRoomImages(rooms.find(r => r.id === roomId));
    setActiveImageIndex(prev => ({
      ...prev,
      [roomId]: (prev[roomId] - 1 + roomImages.length) % roomImages.length
    }));
  };

  const selectImage = (roomId, index) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [roomId]: index
    }));
  };

  const getRoomImages = (room) => {
    const details = getRoomDetails(room);
    return details.images;
  };

  const openRoomModal = (room) => {
    setSelectedRoom(room);
    document.body.style.overflow = 'hidden';
  };

  const closeRoomModal = () => {
    setSelectedRoom(null);
    document.body.style.overflow = 'auto';
  };

  const openBookingModal = (room) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSelectedRoomForBooking(room);
    setShowBookingModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoomForBooking(null);
    document.body.style.overflow = 'auto';
  };

  const handleBooking = async () => {
    if (!bookingDetails.check_in || !bookingDetails.check_out) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      await bookRoom({
        user_id: user.id,
        room_id: selectedRoomForBooking.id,
        check_in: bookingDetails.check_in,
        check_out: bookingDetails.check_out,
        guests: bookingDetails.guests,
        total_price: totalPrice
      });
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
      closeBookingModal();
    } catch (err) {
      alert(err.message || 'Failed to book room. Please try again.');
    }
  };

  const calculateNights = () => {
    if (!bookingDetails.check_in || !bookingDetails.check_out) return 0;
    const start = new Date(bookingDetails.check_in);
    const end = new Date(bookingDetails.check_out);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const totalPrice = selectedRoomForBooking 
    ? selectedRoomForBooking.price * calculateNights() 
    : 0;

  if (loading) {
    return (
      <div className="rooms-page">
        <div className="text-center py-5">
          <div className="spinner-border text-gold" role="status"></div>
          <p className="mt-3">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rooms-page">
        <div className="alert alert-danger m-5">{error}</div>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <div className="rooms-hero">
        <div className="hero-overlay">
          <div className="container text-center text-white">
            <h1 className="hero-title">Luxury Accommodations</h1>
            <p className="hero-subtitle">Experience the finest rooms with breathtaking views</p>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="success-toast">
          <div className="success-icon">✓</div>
          <div className="success-message">
            <h4>Booking Confirmed!</h4>
            <p>Your room has been booked successfully.</p>
          </div>
        </div>
      )}

      <div className="search-bar-container">
        <div className="container">
          <div className="search-bar">
            <div className="search-field">
              <label>Check-in</label>
              <input
                type="date"
                className="form-control"
                value={bookingDetails.check_in}
                onChange={(e) => setBookingDetails({...bookingDetails, check_in: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="search-field">
              <label>Check-out</label>
              <input
                type="date"
                className="form-control"
                value={bookingDetails.check_out}
                onChange={(e) => setBookingDetails({...bookingDetails, check_out: e.target.value})}
                min={bookingDetails.check_in || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="search-field">
              <label>Guests</label>
              <select
                className="form-control"
                value={bookingDetails.guests}
                onChange={(e) => setBookingDetails({...bookingDetails, guests: parseInt(e.target.value)})}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
              </select>
            </div>
            <div className="search-field">
              <button className="btn btn-gold search-btn">Search Rooms</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container rooms-container">
        {rooms.map((room) => {
          const details = getRoomDetails(room);
          const roomImages = getRoomImages(room);
          const currentIndex = activeImageIndex[room.id] || 0;
          
          return (
            <div key={room.id} className="room-card-wrapper">
              <div className="room-card-horizontal">
                <div className="room-gallery">
                  <div className="main-image-container">
                    <img 
                      src={roomImages[currentIndex]?.url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'} 
                      alt={roomImages[currentIndex]?.alt || 'Room'}
                      className="main-room-image"
                    />
                    <button className="gallery-nav prev" onClick={() => prevImage(room.id)}>‹</button>
                    <button className="gallery-nav next" onClick={() => nextImage(room.id)}>›</button>
                    <div className="image-counter">
                      {currentIndex + 1} / {roomImages.length}
                    </div>
                  </div>
                  <div className="thumbnail-strip">
                    {roomImages.map((image, idx) => (
                      <div key={idx} className={`thumbnail ${currentIndex === idx ? 'active' : ''}`} onClick={() => selectImage(room.id, idx)}>
                        <img src={image.url} alt={image.alt} />
                        <div className="thumbnail-type">{image.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="room-info">
                  <div className="room-header">
                    <h2 className="room-name">{room.room_type}</h2>
                    <div className="room-price">
                      <span className="price">${room.price}</span>
                      <span className="per-night">/ night</span>
                    </div>
                  </div>

                  <div className="room-meta">
                    <span className="meta-item">📏 {details.size}</span>
                    <span className="meta-item">🛏️ {details.bedType}</span>
                    <span className="meta-item">👥 Up to {room.capacity} guests</span>
                    <span className="meta-item">👁️ {details.view}</span>
                    <span className="meta-item">📍 {details.floor}</span>
                  </div>

                  <p className="room-description">{room.description || details.longDescription}</p>

                  <div className="amenities-grid">
                    {details.amenities.slice(0, 8).map((amenity, idx) => (
                      <div key={idx} className="amenity-item">
                        <span className="amenity-icon">{amenity.icon}</span>
                        <span className="amenity-name">{amenity.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="room-actions">
                    <button className="btn btn-outline-gold" onClick={() => openRoomModal(room)}>View Details</button>
                    <button className="btn btn-gold" onClick={() => openBookingModal(room)}>Book Now</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRoom && (
        <div className="modal-overlay" onClick={closeRoomModal}>
          <div className="modal-content room-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeRoomModal}>×</button>
            <div className="modal-body">
              <h2 className="modal-title">{getRoomDetails(selectedRoom).name}</h2>
              <div className="modal-gallery">
                <div className="modal-main-image">
                  <img src={getRoomImages(selectedRoom)[0]?.url} alt="Room" />
                </div>
              </div>
              <div className="modal-details">
                <div className="details-section">
                  <h3>About this room</h3>
                  <p>{getRoomDetails(selectedRoom).longDescription}</p>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-gold btn-lg" onClick={() => { closeRoomModal(); openBookingModal(selectedRoom); }}>
                    Book This Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedRoomForBooking && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-content booking-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeBookingModal}>×</button>
            <h2 className="modal-title">Complete Your Booking</h2>
            <div className="booking-summary">
              <h3>{getRoomDetails(selectedRoomForBooking).name}</h3>
              <p>${selectedRoomForBooking.price} per night</p>
            </div>
            <div className="booking-dates">
              <div className="date-field">
                <label>Check-in</label>
                <input type="date" className="form-control" value={bookingDetails.check_in}
                  onChange={(e) => setBookingDetails({...bookingDetails, check_in: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="date-field">
                <label>Check-out</label>
                <input type="date" className="form-control" value={bookingDetails.check_out}
                  onChange={(e) => setBookingDetails({...bookingDetails, check_out: e.target.value})}
                  min={bookingDetails.check_in || new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="booking-total">
              <div className="total-row">
                <span>${selectedRoomForBooking.price} x {calculateNights()} nights</span>
                <span>${selectedRoomForBooking.price * calculateNights()}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            <button className="btn btn-gold btn-lg confirm-booking" onClick={handleBooking}>
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;