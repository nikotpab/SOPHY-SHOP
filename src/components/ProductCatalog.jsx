import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductCatalog.css';
import logo from '../images/logo192.png';

const getDefaultImage = (idCategoria) => {
  const categoryImages = {
    1: 'https://via.placeholder.com/200x200?text=Categoría+1',
    2: 'https://via.placeholder.com/200x200?text=Categoría+2',
    3: 'https://via.placeholder.com/200x200?text=Categoría+3'
  };
  return categoryImages[idCategoria] || 'https://via.placeholder.com/200x200?text=Sin+Imagen';
};

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    document.title = "Catálogo de Productos";
    document.body.style.backgroundColor = '#f3f2f2';

    const fetchProductsAndCategories = async () => {
      try {
        const [respProductos, respCategorias] = await Promise.all([
          fetch('http://localhost:8181/producto/getAll'),
          fetch('http://localhost:8181/categoria/getAll')
        ]);

        if (!respProductos.ok || !respCategorias.ok) {
          throw new Error('Error al cargar los datos');
        }

        const dataProductos = await respProductos.json();
        const dataCategorias = await respCategorias.json();

        const mapaCategorias = {};
        dataCategorias.forEach(cat => {
          mapaCategorias[cat.id] = cat.nombre;
        });

        const productosConDetalle = dataProductos.map(product => {
          const imageUrl = product.fotoProducto
            ? (product.fotoProducto.startsWith('http')
                ? product.fotoProducto
                : `http://localhost:8181/images/${product.fotoProducto}`)
            : getDefaultImage(product.idCategoria);

          const categoryName = mapaCategorias[product.idCategoria] || 'Sin Categoría';

          return {
            ...product,
            imageUrl,
            categoryName
          };
        });

        setProducts(productosConDetalle);
        setCategories(dataCategorias);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesName = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const price = product.precioVentaActual;
    const matchesMinPrice = minPrice === '' || price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || price <= parseFloat(maxPrice);
    const matchesStock = !inStockOnly || product.existencia > 0;
    const matchesCategory = selectedCategory === '' || product.idCategoria === parseInt(selectedCategory);
    return matchesName && matchesMinPrice && matchesMaxPrice && matchesStock && matchesCategory;
  });

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">Error al cargar productos: {error}</div>;

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
          <input
            type="number"
            placeholder="Precio máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
        </div>

        <div className="stock-filter">
          <label>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            Solo productos disponibles
          </label>
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <a href="/user/main_page.html">
        <img src={logo} alt="Inicio" className="logo" />
      </a>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link to={`/producto/${product.id}`} key={product.id} className="product-card-link">
              <div className="product-card">
                <img
                  src={product.imageUrl}
                  alt={product.nombre}
                  className="product-image"
                  onError={(e) => { e.target.src = getDefaultImage(product.idCategoria); }}
                />
                <h3 className="product-name">{product.nombre}</h3>
                <p className="product-reference">Referencia: {product.referencia}</p>
                <p className="product-category">{product.categoryName}</p>
                <p className="product-price">
                  ${product.precioVentaActual.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <div className="stock-info">
                  <span>Disponibles: </span>
                  <span className={`stock-value ${product.existencia > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.existencia}
                  </span>
                </div>
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
