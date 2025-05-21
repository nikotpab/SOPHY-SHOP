import React from 'react';
import { useCart } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';
import '../css/ShoppingCart.css';

const ShoppingCart = () => {
  const { cartItems, removeFromCart, notification } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {notification && (
        <div className="fixed top-4 right-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <button className='button-23' onClick={() => navigate(-1)}>
          Regresar
        </button>
      </div>

      <h2 className="carrito_msj">Tu Carrito ({cartItems.length}/3)</h2>
      
      {cartItems.length === 0 ? (
        <p className="vacio">El carrito está vacío</p>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="item-carrito">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <div>
                  <p className="total-item">{formatPrice(item.quantity * item.price)}</p>
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
          
          <button  onClick={() => navigate('/pago')}
            className="finalizar-compra"
            disabled={cartItems.length === 0}
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price).replace('COP', '$');
};

export default ShoppingCart;