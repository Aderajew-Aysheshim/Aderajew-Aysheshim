'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kidus_cart');
    const savedOrders = localStorage.getItem('kidus_orders');
    const savedEnrollments = localStorage.getItem('kidus_enrollments');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedEnrollments) setEnrollments(JSON.parse(savedEnrollments));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('kidus_cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('kidus_orders', JSON.stringify(orders));
  }, [orders]);

  // Save enrollments to localStorage
  useEffect(() => {
    localStorage.setItem('kidus_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1, cartItemId: Date.now() }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'confirmed'
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const addEnrollment = (enrollment) => {
    const newEnrollment = {
      ...enrollment,
      id: Date.now().toString(),
      enrollDate: new Date().toISOString(),
      status: 'enrolled'
    };
    setEnrollments(prevEnrollments => [newEnrollment, ...prevEnrollments]);
    return newEnrollment;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      addOrder,
      enrollments,
      addEnrollment
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
