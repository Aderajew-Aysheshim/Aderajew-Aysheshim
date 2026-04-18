// client/src/services/api.js

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for fetch with error handling
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTH APIs ====================
export const register = (userData) => 
    fetchAPI('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

export const login = (credentials) => 
    fetchAPI('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });

// ==================== ROOM APIs ====================
export const getRooms = () => fetchAPI('/rooms');
export const getRoom = (id) => fetchAPI(`/rooms/${id}`);
export const bookRoom = (bookingData) => 
    fetchAPI('/book-room', {
        method: 'POST',
        body: JSON.stringify(bookingData)
    });
export const getMyBookings = (userId) => fetchAPI(`/my-bookings/${userId}`);

// ==================== MENU APIs ====================
export const getMenu = () => fetchAPI('/menu');
export const getMenuByCategory = (category) => fetchAPI(`/menu/category/${category}`);

// ==================== ORDER APIs ====================
export const placeOrder = (orderData) => 
    fetchAPI('/order-food', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
export const getMyOrders = (userId) => fetchAPI(`/my-orders/${userId}`);

// ==================== TRANSPORT APIs ====================
export const bookTransport = (transportData) => 
    fetchAPI('/book-transport', {
        method: 'POST',
        body: JSON.stringify(transportData)
    });
export const getMyTransport = (userId) => fetchAPI(`/my-transport/${userId}`);

// ==================== GYM APIs ====================
export const getGymSchedule = () => fetchAPI('/gym-schedule');
export const bookGym = (gymData) => 
    fetchAPI('/book-gym', {
        method: 'POST',
        body: JSON.stringify(gymData)
    });
export const getMyGymBookings = (userId) => fetchAPI(`/my-gym-bookings/${userId}`);

// ==================== ADMIN APIs ====================
export const adminGetUsers = () => fetchAPI('/admin/users');
export const adminGetBookings = () => fetchAPI('/admin/bookings');
export const adminUpdateBooking = (id, data) => 
    fetchAPI(`/admin/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
export const adminGetFoodOrders = () => fetchAPI('/admin/food-orders');
export const adminUpdateFoodOrder = (id, data) => 
    fetchAPI(`/admin/food-orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
export const adminGetTransport = () => fetchAPI('/admin/transport');
export const adminUpdateTransport = (id, data) => 
    fetchAPI(`/admin/transport/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
export const adminGetGymBookings = () => fetchAPI('/admin/gym-bookings');
export const adminGetStats = () => fetchAPI('/admin/stats');
export const adminAddRoom = (roomData) => 
    fetchAPI('/admin/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData)
    });
export const adminUpdateRoom = (id, roomData) => 
    fetchAPI(`/admin/rooms/${id}`, {
        method: 'PUT',
        body: JSON.stringify(roomData)
    });
export const adminDeleteRoom = (id) => 
    fetchAPI(`/admin/rooms/${id}`, {
        method: 'DELETE'
    });
export const adminAddMenuItem = (itemData) => 
    fetchAPI('/admin/menu', {
        method: 'POST',
        body: JSON.stringify(itemData)
    });
export const adminUpdateMenuItem = (id, itemData) => 
    fetchAPI(`/admin/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData)
    });
export const adminDeleteMenuItem = (id) => 
    fetchAPI(`/admin/menu/${id}`, {
        method: 'DELETE'
    });
