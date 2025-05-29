import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductCatalog.css';
import logo from '../images/logo192.png';
import { useProducts } from './ProductContext';

const getDefaultImage = (idCategoria) => {

  const categoryImages = {
    1: 'https://via.placeholder.com/200x200?text=Categoría+1',
    2: 'https://via.placeholder.com/200x200?text=Categoría+2',
    3: 'https://via.placeholder.com/200x200?text=Categoría+3'
  };

  return categoryImages[idCategoria] || 'https://via.placeholder.com/200x200?text=Sin+Imagen';
};

const ProductCatalog = () => {
  const { productos } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = "Catálogo";
    document.body.style.backgroundColor = '#f3f2f2';
    
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8181/producto/getAll');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const productsWithImages = data.map(product => {
          const imageUrl = product.fotoProducto 
            ? product.fotoProducto.startsWith('http') 
              ? product.fotoProducto 
              : `http://localhost:8080/images/${product.fotoProducto}` 
            : getDefaultImage(product.idCategoria);

          return {
            ...product,
            imageUrl
          };
        });
        
        setProducts(productsWithImages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesName = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const price = product.precioVentaActual;
    const matchesMinPrice = minPrice === '' || price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || price <= parseFloat(maxPrice);
    
    return matchesName && matchesMinPrice && matchesMaxPrice;
  });

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">Error al cargar productos: {error}</div>;
  }

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
          <input
            type="number"
            placeholder="Precio máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
        </div>
      </div>
      <a href="/user/main_page.html" rel="noopener noreferrer">
        <img src={logo} alt="Inicio" className="logo" />
      </a>
      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link 
              to={`/producto/${product.id}`} 
              key={product.id} 
              className="product-card-link"
            >
              <div className="product-card">
                <img
                  src={product.imageUrl}
                  alt={product.nombre}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = getDefaultImage(product.idCategoria);
                  }}
                />
                <h3 className="product-name">{product.nombre}</h3>
                <p className="product-price">
                  ${product.precioVentaActual.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-products">No se encontraron productos que coincidan con los filtros</div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
