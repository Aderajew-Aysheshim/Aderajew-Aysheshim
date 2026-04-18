import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import * as api from '../services/api';

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [transportBookings, setTransportBookings] = useState([]);
  const [gymBookings, setGymBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    pendingOrders: 0,
    totalRooms: 0,
    availableRooms: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadAllData();
  }, [user, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, bookingsData, roomsData, menuData, usersData, foodOrdersData, transportData, gymData] = await Promise.all([
        api.adminGetStats(),
        api.adminGetBookings(),
        api.getRooms(),
        api.getMenu(),
        api.adminGetUsers(),
        api.adminGetFoodOrders(),
        api.adminGetTransport(),
        api.adminGetGymBookings()
      ]);

      setStats(statsData);
      setBookings(bookingsData);
      setRooms(roomsData);
      setMenuItems(menuData);
      setUsers(usersData);
      setFoodOrders(foodOrdersData);
      setTransportBookings(transportData);
      setGymBookings(gymData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await api.adminUpdateBooking(bookingId, { status: 'confirmed' });
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed' } : b
      ));
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await api.adminUpdateBooking(bookingId, { status: 'cancelled' });
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  const handleUpdateFoodOrder = async (orderId, status) => {
    try {
      await api.adminUpdateFoodOrder(orderId, { status });
      setFoodOrders(foodOrders.map(o => 
        o.id === orderId ? { ...o, status } : o
      ));
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const handleUpdateTransport = async (transportId, status) => {
    try {
      await api.adminUpdateTransport(transportId, { status });
      setTransportBookings(transportBookings.map(t => 
        t.id === transportId ? { ...t, status } : t
      ));
    } catch (err) {
      alert('Failed to update transport booking');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await api.adminDeleteRoom(roomId);
        setRooms(rooms.filter(r => r.id !== roomId));
      } catch (err) {
        alert('Failed to delete room');
      }
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await api.adminDeleteMenuItem(itemId);
        setMenuItems(menuItems.filter(i => i.id !== itemId));
      } catch (err) {
        alert('Failed to delete menu item');
      }
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.adminUpdateMenuItem(item.id, { 
        ...item, 
        is_available: !item.is_available 
      });
      setMenuItems(menuItems.map(i => 
        i.id === item.id ? { ...i, is_available: !i.is_available } : i
      ));
    } catch (err) {
      alert('Failed to update menu item');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomData = {
      room_number: formData.get('room_number'),
      room_type: formData.get('room_type'),
      price: parseFloat(formData.get('price')),
      capacity: parseInt(formData.get('capacity')),
      description: formData.get('description'),
      image_url: formData.get('image_url') || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
    };
    try {
      await api.adminAddRoom(roomData);
      setShowAddModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to add room');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const menuData = {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      image_url: formData.get('image_url') || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'
    };
    try {
      await api.adminAddMenuItem(menuData);
      setShowAddModal(false);
      loadAllData();
    } catch (err) {
      alert('Failed to add menu item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="alert alert-danger m-4">{error}</div>
        <button className="btn btn-gold m-4" onClick={loadAllData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="text-gold">Lucy Luxury</h2>
          <p>Admin Panel</p>
        </div>
        
        <div className="admin-profile">
          <div className="admin-avatar">👤</div>
          <div className="admin-info">
            <h5>{user?.name}</h5>
            <p>{user?.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            📅 Bookings {stats.pendingBookings > 0 && <span className="badge bg-warning">{stats.pendingBookings}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            🏨 Rooms
          </button>
          <button className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
            🍽️ Restaurant Menu
          </button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 Users
          </button>
          <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            🛵 Food Orders {stats.pendingOrders > 0 && <span className="badge bg-warning">{stats.pendingOrders}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'transport' ? 'active' : ''}`} onClick={() => setActiveTab('transport')}>
            🚗 Transport
          </button>
          <button className={`nav-item ${activeTab === 'gym' ? 'active' : ''}`} onClick={() => setActiveTab('gym')}>
            💪 Gym Bookings
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div className="admin-main">
        <div className="main-header">
          <h2>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'bookings' && 'Manage Bookings'}
            {activeTab === 'rooms' && 'Manage Rooms'}
            {activeTab === 'menu' && 'Restaurant Menu'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'orders' && 'Food Orders'}
            {activeTab === 'transport' && 'Transport Bookings'}
            {activeTab === 'gym' && 'Gym Bookings'}
          </h2>
          <div className="header-actions">
            {(activeTab === 'rooms' || activeTab === 'menu') && (
              <button className="btn btn-gold" onClick={() => setShowAddModal(true)}>+ Add New</button>
            )}
            <button className="btn btn-outline-gold ms-2" onClick={loadAllData}>🔄 Refresh</button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>{stats.totalBookings}</h3>
                    <p>Total Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>${stats.totalRevenue?.toLocaleString() || 0}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{stats.pendingBookings}</h3>
                    <p>Pending Bookings</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛵</div>
                  <div className="stat-info">
                    <h3>{stats.pendingOrders}</h3>
                    <p>Pending Orders</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏨</div>
                  <div className="stat-info">
                    <h3>{stats.availableRooms}/{stats.totalRooms}</h3>
                    <p>Available Rooms</p>
                  </div>
                </div>
              </div>

              <div className="recent-section">
                <h3>Recent Bookings</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Room</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{booking.user_name || booking.user_email}</td>
                        <td>{booking.room_type} - {booking.room_number}</td>
                        <td>{booking.check_in}</td>
                        <td>{booking.check_out}</td>
                        <td>${booking.total_price}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                        </td>
                        <td>
                          {booking.status === 'pending' && (
                            <>
                              <button className="btn-sm btn-success me-2" onClick={() => handleApproveBooking(booking.id)}>✓</button>
                              <button className="btn-sm btn-danger" onClick={() => handleRejectBooking(booking.id)}>✗</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Room</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.user_name || booking.user_email}</td>
                      <td>{booking.room_type} - {booking.room_number}</td>
                      <td>{booking.check_in}</td>
                      <td>{booking.check_out}</td>
                      <td>{booking.guests}</td>
                      <td>${booking.total_price}</td>
                      <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                      <td>
                        {booking.status === 'pending' && (
                          <>
                            <button className="btn-sm btn-success me-2" onClick={() => handleApproveBooking(booking.id)}>Approve</button>
                            <button className="btn-sm btn-danger" onClick={() => handleRejectBooking(booking.id)}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="rooms-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room #</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td>#{room.id}</td>
                      <td>{room.room_number}</td>
                      <td>{room.room_type}</td>
                      <td>${room.price}</td>
                      <td>{room.capacity}</td>
                      <td><span className={`status-badge ${room.is_available ? 'available' : 'unavailable'}`}>{room.is_available ? 'Available' : 'Unavailable'}</span></td>
                      <td>
                        <button className="btn-sm btn-danger" onClick={() => handleDeleteRoom(room.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="menu-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td><span className={`status-badge ${item.is_available ? 'available' : 'unavailable'}`}>{item.is_available ? 'Yes' : 'No'}</span></td>
                      <td>
                        <button className="btn-sm btn-warning me-2" onClick={() => handleToggleAvailability(item)}>
                          {item.is_available ? 'Disable' : 'Enable'}
                        </button>
                        <button className="btn-sm btn-danger" onClick={() => handleDeleteMenuItem(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td><span className={`status-badge ${u.role}`}>{u.role}</span></td>
                      <td>{u.created_at?.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Room</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foodOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user_name}</td>
                      <td>{order.room_number || 'Lobby'}</td>
                      <td>{order.items}</td>
                      <td>${order.total_amount}</td>
                      <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                      <td>
                        <select className="form-select form-select-sm d-inline-block w-auto" 
                          value={order.status} 
                          onChange={(e) => handleUpdateFoodOrder(order.id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'transport' && (
            <div className="transport-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Pickup</th>
                    <th>Dropoff</th>
                    <th>Time</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transportBookings.map(t => (
                    <tr key={t.id}>
                      <td>#{t.id}</td>
                      <td>{t.user_name}</td>
                      <td>{t.pickup_location}</td>
                      <td>{t.dropoff_location}</td>
                      <td>{t.pickup_time}</td>
                      <td>{t.vehicle_type}</td>
                      <td><span className={`status-badge ${t.status}`}>{t.status}</span></td>
                      <td>
                        <select className="form-select form-select-sm d-inline-block w-auto"
                          value={t.status}
                          onChange={(e) => handleUpdateTransport(t.id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'gym' && (
            <div className="gym-tab">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Time Slot</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gymBookings.map(g => (
                    <tr key={g.id}>
                      <td>#{g.id}</td>
                      <td>{g.user_name}</td>
                      <td>{g.time_slot} ({g.start_time}-{g.end_time})</td>
                      <td>{g.booking_date}</td>
                      <td><span className={`status-badge ${g.status}`}>{g.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New {activeTab === 'rooms' ? 'Room' : 'Menu Item'}</h3>
            {activeTab === 'rooms' ? (
              <form onSubmit={handleAddRoom}>
                <input type="text" name="room_number" placeholder="Room Number" required className="form-control mb-2" />
                <select name="room_type" className="form-control mb-2" required>
                  <option value="">Select Type</option>
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Family Room">Family Room</option>
                </select>
                <input type="number" name="price" placeholder="Price" step="0.01" required className="form-control mb-2" />
                <input type="number" name="capacity" placeholder="Capacity" required className="form-control mb-2" />
                <textarea name="description" placeholder="Description" className="form-control mb-2" />
                <input type="url" name="image_url" placeholder="Image URL (optional)" className="form-control mb-3" />
                <button type="submit" className="btn btn-gold me-2">Add Room</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </form>
            ) : (
              <form onSubmit={handleAddMenuItem}>
                <input type="text" name="name" placeholder="Item Name" required className="form-control mb-2" />
                <select name="category" className="form-control mb-2" required>
                  <option value="">Select Category</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Steaks">Steaks</option>
                  <option value="Starters">Starters</option>
                  <option value="Desserts">Desserts</option>
                </select>
                <textarea name="description" placeholder="Description" className="form-control mb-2" />
                <input type="number" name="price" placeholder="Price" step="0.01" required className="form-control mb-2" />
                <input type="url" name="image_url" placeholder="Image URL (optional)" className="form-control mb-3" />
                <button type="submit" className="btn btn-gold me-2">Add Item</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;