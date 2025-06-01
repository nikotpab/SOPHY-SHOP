import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Category.css';

const Category = () => {
  document.title = 'Gestión de Categorías';

  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [newCategory, setNewCategory] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProductCounts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8181/categoria/getAll');
      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchProductCounts = async () => {
    try {
      const response = await fetch('http://localhost:8181/producto/getAll');
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      const products = await response.json();

      const counts = products.reduce((acc, product) => {
        const categoryId = product.idCategoria;
        acc[categoryId] = (acc[categoryId] || 0) + 1;
        return acc;
      }, {});

      setProductCounts(counts);
    } catch (err) {
      console.error('Error al obtener conteo de productos:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8181/categoria/saveCategoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }

      setSuccessMessage('Categoría creada exitosamente');
      setNewCategory({ nombre: '', descripcion: '' });
      fetchCategories();
      fetchProductCounts();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (productCounts[id] > 0) {
      alert('No se puede eliminar una categoría que tiene productos asociados');
      return;
    }

    if (!window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8181/categoria/deleteCategoria/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      setSuccessMessage('Categoría eliminada exitosamente');
      fetchCategories();
      fetchProductCounts();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <Link to="/admin/dashboard" className="back-button">
        ← Volver al Dashboard
      </Link>

      <h1 className="page-title">Gestión de Categorías</h1>

      <div className="form-container">
        <h2 className="section-title">Nueva Categoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={newCategory.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={newCategory.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Crear Categoría
            </button>
          </div>
        </form>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <h2 className="section-title">Categorías Existentes</h2>
      {categories.length === 0 ? (
        <div className="empty-state">
          No hay categorías registradas
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.nombre}</td>
                <td>{category.descripcion}</td>
                <td>{productCounts[category.id] || 0}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(category.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Category;