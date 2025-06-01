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
              price: response.data.precioVentaActual
            };
          })
        );
        if (
          JSON.stringify(updatedItems.map(i => i.price)) !==
          JSON.stringify(cartItems.map(i => i.price))
        ) {
          setCartItems(updatedItems);
        }
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
    <div className="max-w-4xl mx-auto p-6">
      {notification && (
        <div className="fixed top-4 right-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <button className="button-23" onClick={() => navigate(-1)}>
          Regresar
        </button>
      </div>

      <h2 className="carrito_msj">
        Tu Carrito ({cartItems.length}/3)
      </h2>

      {cartItems.length === 0 ? (
        <p className="vacio">El carrito está vacío</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="item-carrito">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <div>
                  <p className="total-item">
                    {formatPrice(item.quantity * item.price)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="eliminar-item"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="total-general">
            <span>Total General:</span>
            <span>{formatPrice(calculateTotal())}</span>
          </div>

          <button
            onClick={handleFinalizePurchase}
            className="finalizar-compra"
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