import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import '../css/ProductView.css';
import logo from '../images/logo192.png';

const getDefaultImage = (idCategoria) => {
  const categoryImages = {
    1: 'https://via.placeholder.com/300x300?text=Categoría+1',
    2: 'https://via.placeholder.com/300x300?text=Categoría+2',
    3: 'https://via.placeholder.com/300x300?text=Categoría+3'
  };
  return categoryImages[idCategoria] || 'https://via.placeholder.com/300x300?text=Sin+Imagen';
};

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  })
    .format(price)
    .replace('COP', '$');

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, notification } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8181';

  useEffect(() => {
    document.title = "Detalles del Producto";
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.fontFamily = 'Playfair Display';

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.fontFamily = '';
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${API_BASE}/producto/findRecord/${id}`);
        if (!resp.ok) throw new Error(`Error ${resp.status}`);
        const json = await resp.json();
        setProduct(json);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Cargando detalles del producto...</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!product) return <div className="error">Producto no encontrado.</div>;

  const imageUrl = product.fotoProducto
    ? (product.fotoProducto.startsWith('http')
        ? product.fotoProducto
        : `${API_BASE}/images/${product.fotoProducto}`)
    : getDefaultImage(product.idCategoria);

  return (
    <div className="product-detail-container">
      {notification && <div className="notification">{notification}</div>}

      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo" className="breadcrumb-link">Catálogo</Link>
        <span>/</span>
        <span className="breadcrumb-current">{product.nombre}</span>
      </nav>

      <div className="product-grid">
        <div className="image-section">
          <img
            src={imageUrl}
            alt={product.nombre}
            className="product-image"
            onError={e => { e.target.src = getDefaultImage(product.idCategoria); }}
          />
        </div>

        <div className="info-section">
          <h1 className="product-title">{product.nombre}</h1>
          <div className="product-price">{formatPrice(product.precioVentaActual)}</div>
          <div className="stock-status">
            <span className={`status ${product.existencia > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.existencia > 0 ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <div className="action-buttons">
            <button
              className={`add-to-cart ${product.existencia === 0 ? 'disabled' : ''}`}
              onClick={() => product.existencia > 0 && addToCart(product)}
              disabled={product.existencia === 0}
            >
              {product.existencia > 0 ? 'Añadir al carrito' : 'Agotado'}
            </button>
            <Link to="/carrito" className="view-cart">
              Ver Carrito ({cartItems.length}/3)
            </Link>
            <button className="back-button" onClick={() => navigate('/catalogo')}>
              Regresar
            </button>
          </div>

          <h2>Detalles del Producto</h2>
          <table className="product-details-table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{product.id}</td>
              </tr>
              <tr>
                <th>Categoría</th>
                <td>{product.idCategoria}</td>
              </tr>
              <tr>
                <th>Referencia</th>
                <td>{product.referencia}</td>
              </tr>
              <tr>
                <th>Descripción</th>
                <td>{product.descripcion}</td>
              </tr>
              <tr>
                <th>Existencia</th>
                <td>{product.existencia}</td>
              </tr>
              <tr>
                <th>¿Tiene IVA?</th>
                <td>{product.tieneIva === 1 ? 'Sí' : 'No'}</td>
              </tr>

              <tr>
                <th>Estado</th>
                <td>{product.estado === 1 ? 'Activo' : 'Inactivo'}</td>
              </tr>
            
            </tbody>
          </table>
        </div>
      </div>

      <a href="/user/main_page.html" className="home-logo" rel="noopener noreferrer">
        <img src={logo} alt="Inicio" className="logo-image" />
      </a>
    </div>
  );
}
