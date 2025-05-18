import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductCatalog.css';
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

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    document.title = "Catálogo";
    document.body.style.backgroundColor = '#f3f2f2';
  }, []);

  const products = [
    { icon: album1, id: 1, name: 'Only They Could Have Made This Album LP - Importado', price: 152320 },
    { icon: album2, id: 2, name: 'Portishead 2LP (Reedición 2016) - Importado', price: 240380 },
    { icon: album3, id: 3, name: 'VIRGIN GATEFOLD LP + TARJETA FIRMADA - Importado', price: 169000 },
    { icon: album4, id: 4, name: 'Alligator Bites Never Heal Vinilo Blanco Exclusivo - Importado', price: 130900 },
    { icon: cd1, id: 5, name: 'Sincerely, CD + Art Card Firmada - Importado', price: 99960 },
    { icon: camiseta1, id: 6, name: 'Milagro Camiseta', price: 142800 },
    { icon: cd2, id: 7, name: "Short n' Sweet (Deluxe) CD - Importado", price: 61900 },
    { icon: cd3, id: 8, name: 'Watch The Throne (CD Estándar) - Importado', price: 60690 },
    { icon: cd4, id: 9, name: 'In Utero 30th Anniversary 2CD Deluxe - Importado', price: 142800 },
  ];

  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
    
    return matchesName && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="product-catalog">
      <h1>Nuestros Productos</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <div className="price-filter">
          <input
            type="number"
            placeholder="Precio mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />
          <br/>
          <br/>
          <span className="price-separator"></span>
          <input
            type="number"
            placeholder="Precio máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
        </div>
      </div>
      <a href="/user/main_page.html"  rel="noopener noreferrer">
    <img src={logo} alt="Inicio" className="logo" />
    </a>
      <div className="products-container">
        {filteredProducts.map((product) => (
          <Link 
            to={`/producto/${product.id}`} 
            key={product.id} 
            className="product-card-link"
          >
            <div className="product-card">
              {product.icon && (
                <img src={product.icon} alt={product.name} className="product-image" />
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;