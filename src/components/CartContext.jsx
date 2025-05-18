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

    setCartItems([...cartItems, { ...product, quantity: 1 }]);
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      notification,
      setNotification
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);