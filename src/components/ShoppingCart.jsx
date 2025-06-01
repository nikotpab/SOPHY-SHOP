import React, { useEffect } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ShoppingCart.css';

const ShoppingCart = () => {
  const { cartItems, setCartItems, removeFromCart, notification, setNotification } = useCart();
  const navigate = useNavigate();

 useEffect(() => {
  const fetchProductPrices = async () => {
    try {
      const updatedItems = await Promise.all(
        cartItems.map(async (item) => {
          const response = await axios.get(
            `http://localhost:8181/producto/findRecord/${item.id}`
          );
          return {
            ...item,
            price: response.data.precioVentaActual,
            name: response.data.nombre // ⬅️ Añade el nombre aquí
          };
        })
      );
      setCartItems(updatedItems); // ya no compares, actualízalo directamente
    } catch (error) {
      console.error('Error fetching product prices:', error);
      setNotification('Error al obtener precios actualizados');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  if (cartItems.length > 0) {
    fetchProductPrices();
  }
}, [cartItems, setCartItems, setNotification]);

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    return parseFloat(total.toFixed(2));
  };

  const handleFinalizePurchase = () => {
    if (cartItems.length > 3) {
      setNotification('¡Límite máximo de 3 productos en el carrito!');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    navigate('/pago');
  };

  return (
    <div className="shopping-cart-container">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* Header con botón de regreso y título */}
      <div className="shopping-cart-header">
        <button className="button-back" onClick={() => navigate(-1)}>
          ← Regresar
        </button>
        <h2 className="shopping-cart-title">
          Tu Carrito ({cartItems.length}/3)
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-message">El carrito está vacío</p>
      ) : (
        <>
          {/* Lista de ítems */}
          <div className="items-list">
            {cartItems.map(item => (
              <div key={item.id} className="item-carrito">
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-qty-price">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="item-actions">
                  <p className="item-subtotal">
                    {formatPrice(item.quantity * item.price)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="button-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="total-container">
            <span className="total-label">Total General:</span>
            <span className="total-value">{formatPrice(calculateTotal())}</span>
          </div>

          {/* Botón Finalizar Compra */}
          <button
            onClick={handleFinalizePurchase}
            className="button-finalize"
            disabled={cartItems.length === 0}
          >
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  );
};

const formatPrice = (price) => {
  const number = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })
    .format(number)
    .replace('COP', '$');
};

export default ShoppingCart;
