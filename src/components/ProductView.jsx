import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import album1 from '../images/album1.webp';
import album2 from '../images/album2.webp';
import album3 from '../images/album3.webp';
import album4 from '../images/album4.webp';
import cd1 from '../images/cd1.webp';
import camiseta1 from '../images/camiseta1.webp';
import cd2 from '../images/cd2.webp';
import cd3 from '../images/cd3.webp';
import cd4 from '../images/cd4.webp';
import logo from '../images/logo192.png';
import '../css/ProductView.css';

const sampleProducts = [
  {
    id: 1,
    name: 'Only They Could Have Made This Album LP - Importado',
    image: album1,
    description: "Este álbum es una obra maestra musical, con una producción impecable y melodías que te transportarán. Edición de vinilo importada con calidad premium de audio.",
    price: 152320,
    inStock: true,
    tracklist: [
      { side: "A", tracks: ["Canción 1", "Canción 2", "Canción 3"] },
      { side: "B", tracks: ["Canción 4", "Canción 5", "Canción 6"] }
    ]
  },
  {
    id: 2,
    name: 'Portishead 2LP (Reedición 2016) - Importado',
    image: album2,
    description: "Reedición especial del icónico álbum de Portishead. Incluye notas exclusivas y remasterización en vinilo de 180 gramos.",
    price: 240380,
    inStock: true,
  },
  {
    id: 3,
    name: 'VIRGIN GATEFOLD LP + TARJETA FIRMADA - Importado',
    image: album3,
    description: "Edición especial gatefold con tarjeta firmada por los artistas. Incluye póster exclusivo y booklet fotográfico.",
    price: 169000,
    inStock: true
  },
  {
    id: 4,
    name: 'Alligator Bites Never Heal Vinilo Blanco Exclusivo - Importado',
    image: album4,
    description: "Edición limitada en vinilo blanco de 180g. Incluye descarga digital y arte conceptual exclusivo.",
    price: 130900,
    inStock: false
  },
  {
    id: 5,
    name: 'Sincerely, CD + Art Card Firmada - Importado',
    image: cd1,
    description: "CD especial con tarjeta de arte firmada. Incluye 3 bonus tracks y libreta de letras.",
    price: 99960,
    inStock: true
  },
  {
    id: 6,
    name: 'Milagro Camiseta',
    image: camiseta1,
    description: "Camiseta 100% algodón con diseño exclusivo. Disponible en tallas S a XXL.",
    price: 142800,
    inStock: true
  },
  {
    id: 7,
    name: "Short n' Sweet (Deluxe) CD - Importado",
    image: cd2,
    description: "Edición deluxe con 3 bonus tracks y folleto fotográfico de 16 páginas.",
    price: 61900,
    inStock: true
  },
  {
    id: 8,
    name: 'Watch The Throne (CD Estándar) - Importado',
    image: cd3,
    description: "Edición estándar del aclamado álbum colaborativo. Incluye todas las canciones originales.",
    price: 60690,
    inStock: false
  },
  {
    id: 9,
    name: 'In Utero 30th Anniversary 2CD Deluxe - Importado',
    image: cd4,
    description: "Edición aniversario con remasterización, pistas inéditas y booklet retrospectivo.",
    price: 142800,
    inStock: true
  }
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(price).replace('COP', '$');
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, notification } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

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
    setLoading(true);
    setTimeout(() => {
      const foundProduct = sampleProducts.find(p => p.id === parseInt(id, 10));
      setProduct(foundProduct || sampleProducts[0]);
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando detalles del producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-text">Producto no disponible</div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo" className="breadcrumb-link">Catálogo</Link>
        <span>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-grid">
        <div className="image-section">
          <div className="image-container">
            <img 
              src={product.image} 
              alt={product.name}
              className="product-image"
            />
          </div>
        </div>

        <div className="info-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price">{formatPrice(product.price)}</div>

          <div className="action-buttons">
            <button 
              className={`add-to-cart ${!product.inStock ? 'disabled' : ''}`}
              onClick={() => product.inStock && addToCart(product)}
              disabled={!product.inStock}
            >
            
              {product.inStock ? 'Añadir al carrito' : 'Agotado'}
            </button>
            <Link to="/carrito" className="view-cart">
              Ver Carrito ({cartItems.length}/3)
            </Link>
            <button 
  className="back-button" 
  onClick={() => navigate('/catalogo')}
>
  Regresar
</button>
          
          </div>

          <div className="stock-status">
            <span className={`status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? 'Disponible en stock' : 'Agotado temporalmente'}
            </span>
          </div>

          <div className="description-section">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Descripción
              </button>
              {product.tracklist && (
                <button 
                  className={`tab ${activeTab === 'tracklist' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tracklist')}
                >
                  Lista de canciones
                </button>
              )}
            </div>

            <div className="tab-content">
              {activeTab === "description" && (
                <p className="product-description">{product.description}</p>
              )}

              {activeTab === "tracklist" && product.tracklist && (
                <div className="tracklist">
                  {product.tracklist.map((side, index) => (
                    <div key={index} className="side">
                      <h3>Lado {side.side}:</h3>
                      <ol>
                        {side.tracks.map((track, idx) => (
                          <li key={idx}>{track}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <a href="/user/main_page.html" className="home-logo"  rel="noopener noreferrer">
    <img src={logo} alt="Inicio" className="logo-image" />
    </a>
    </div>
  );
}