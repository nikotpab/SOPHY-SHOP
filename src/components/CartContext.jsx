import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');

  const addToCart = (product) => {
    if (cartItems.length >= 3) {
      setNotification('¡Límite máximo de 3 productos en el carrito!');
      setTimeout(() => setNotification(''), 3000);
      return false;
    }
    
    if (cartItems.some(item => item.id === product.id)) {
      setNotification('Este producto ya está en el carrito');
      setTimeout(() => setNotification(''), 3000);
      return false;
    }

    // Asegurar que el precio sea un número
    const productWithPrice = {
      ...product,
      price: typeof product.price === 'string' ? 
             parseFloat(product.price) : 
             product.price
    };

    setCartItems([...cartItems, { ...productWithPrice, quantity: 1 }]);
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, // Función añadida
      updateQuantity, // Función útil para modificar cantidades
      notification,
      setNotification,
      setCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};