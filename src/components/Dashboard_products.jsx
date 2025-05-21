import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../useProducts';
import '../css/Dashboard_products.css';

const ProductAdmin = () => {
  document.title = "Administración de productos";
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', image: '' });
  const { products, addProduct } = useProducts();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.price && formData.image) {
      addProduct(formData);
      setFormData({ name: '', price: '', image: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>APane</h2>
        <nav>
          <ul>
            <li>
              <button
                className="admin-btn add-btn"
                onClick={() => setShowForm(!showForm)}
              >
                <span className="btn-icon">➕</span> Nuevo Producto
              </button>
            </li>
            <li>
              <Link to="/admin/dashboard" className="admin-btn back-btn">
                <span className="btn-icon">←</span> Volver al panel principal
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h1 className="page-title">Gestión de Productos</h1>
        
        {showForm && (
          <div className="admin-form-container">
            <div className="admin-form card">
              <h3>Agregar Nuevo Producto</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="form-group">
                  <label>Precio:</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>URL Imagen:</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    required
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Guardar Producto
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="products-list">
          {products.map(product => (
            <div key={product.id} className="product-item card">
              <div className="product-image-container">
                <img src={product.icon} alt={product.name} className="admin-product-image" />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-price">${parseFloat(product.price).toLocaleString('es-ES')}</p>
                <div className="product-actions">
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductAdmin;