import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Dashboard_products.css';
import { useNavigate } from 'react-router-dom';

const ProductAdmin = () => {
  document.title = "Administración de productos";

  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    referencia: '',
    descripcion: '',
    existencia: 0,
    precioVentaActual: 0,
    precioVentaAnterior: 0,
    costoCompra: 0,
    tieneIva: false,
    stockMaximo: 0,
    fotoProducto: '',
    idCategoria: 1,
    estado: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const API_URL = 'http://localhost:8181/producto';
  const CATEGORIA_URL = 'http://localhost:8181/categoria';
  const navigate = useNavigate();

  // Función para generar UUID v4
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/getAll`),
          axios.get(`${CATEGORIA_URL}/getAll`)
        ]);
        
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
             (name === 'precioVentaActual' || name === 'precioVentaAnterior' || name === 'costoCompra') ? 
             parseFloat(value) || 0 : 
             (name === 'existencia' || name === 'stockMaximo' || name === 'idCategoria' || name === 'estado') ? 
             parseInt(value, 10) || 0 : 
             value
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      return "El nombre del producto es obligatorio";
    }
    if (formData.precioVentaActual <= 0) {
      return "El precio de venta debe ser mayor que cero";
    }
    if (formData.idCategoria <= 0) {
      return "Debe seleccionar una categoría válida";
    }
    return null;
  };

  const handleEdit = (product) => {
    setFormData({
      nombre: product.nombre || '',
      referencia: product.referencia || '', // Mantiene la referencia existente
      descripcion: product.descripcion || '',
      existencia: product.existencia || 0,
      precioVentaActual: product.precioVentaActual ? parseFloat(product.precioVentaActual) : 0,
      precioVentaAnterior: product.precioVentaAnterior ? parseFloat(product.precioVentaAnterior) : 0,
      costoCompra: product.costoCompra ? parseFloat(product.costoCompra) : 0,
      tieneIva: product.tieneIva === 1,
      stockMaximo: product.stockMaximo || 0,
      fotoProducto: product.fotoProducto || '',
      idCategoria: product.idCategoria || 1,
      estado: product.estado || 1
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        nombre: formData.nombre,
        referencia: formData.referencia,
        descripcion: formData.descripcion,
        existencia: formData.existencia,
        precioVentaActual: formData.precioVentaActual,
        precioVentaAnterior: formData.precioVentaAnterior,
        costoCompra: formData.costoCompra,
        tieneIva: formData.tieneIva ? 1 : 0,
        stockMaximo: formData.stockMaximo,
        fotoProducto: formData.fotoProducto,
        idCategoria: formData.idCategoria,
        estado: formData.estado
      };

      let res;
      if (editingId) {
        payload.id = editingId;
        res = await axios.post(`${API_URL}/saveProducto`, payload);
        setProducts(prev => prev.map(p => p.id === editingId ? res.data : p));
      } else {
        res = await axios.post(`${API_URL}/saveProducto`, payload);
        setProducts(prev => [...prev, res.data]);
      }
      
      setShowForm(false);
      setSuccessMessage(editingId ? "Producto actualizado correctamente" : "Producto guardado correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);
      resetForm();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert(`Error al guardar el producto: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      referencia: generateUUID(), // Genera nuevo UUID al resetear
      descripcion: '',
      existencia: 0,
      precioVentaActual: 0,
      precioVentaAnterior: 0,
      costoCompra: 0,
      tieneIva: false,
      stockMaximo: 0,
      fotoProducto: '',
      idCategoria: 1,
      estado: 1
    });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este producto?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/deleteProducto/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setSuccessMessage("Producto eliminado correctamente");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("Error al eliminar el producto. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-retry">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Administración de productos</h1>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="action-bar">
        <button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }} 
          className={`btn ${showForm ? 'btn-cancel' : 'btn-primary'}`}
        >
          {showForm ? "Cancelar" : "Nuevo Producto"}
        </button>
      </div>

      <div className="action-bar-2">
        <button 
          onClick={() => navigate(-1)}
          className={`btn ${'btn-primary'}`}
        >
          Volver
        </button>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información básica</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del producto *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Referencia</label>
                <input
                  type="text"
                  name="referencia"
                  value={formData.referencia}
                  readOnly
                  className="read-only-input"
                />
            
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Precios y costos</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Precio de venta actual *</label>
                <input
                  type="number"
                  name="precioVentaActual"
                  value={formData.precioVentaActual}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio de venta anterior</label>
                <input
                  type="number"
                  name="precioVentaAnterior"
                  value={formData.precioVentaAnterior}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Costo de compra</label>
              <input
                type="number"
                name="costoCompra"
                value={formData.costoCompra}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="tieneIva"
                  checked={formData.tieneIva}
                  onChange={handleChange}
                />
                Incluye IVA
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Inventario</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Existencia actual</label>
                <input
                  type="number"
                  name="existencia"
                  value={formData.existencia}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Stock máximo</label>
                <input
                  type="number"
                  name="stockMaximo"
                  value={formData.stockMaximo}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Imagen y estado</h3>
            <div className="form-group">
              <label>URL de la imagen</label>
              <input
                type="text"
                name="fotoProducto"
                value={formData.fotoProducto}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? "Guardando..." : editingId ? "Actualizar Producto" : "Guardar Producto"}
            </button>
          </div>
        </form>
      )}

      <div className="products-container">
        <h2>Listado de productos ({products.length})</h2>
        
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No hay productos registrados</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.fotoProducto || 'https://via.placeholder.com/150'}
                    alt={product.nombre}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <span className={`product-status ${product.estado === 1 ? 'active' : 'inactive'}`}>
                    {product.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.nombre}</h3>
                  <p className="product-reference">Ref: {product.referencia || 'N/A'}</p>
                  <p className="product-category">
                    Categoría: {categories.find(c => c.id === product.idCategoria)?.nombre || 'Desconocida'}
                  </p>
                  
                  <div className="product-price">
                    <span className="current-price">
                      ${product.precioVentaActual?.toFixed(2)}
                    </span>
                    {product.precioVentaAnterior > 0 && (
                      <span className="old-price">
                        ${product.precioVentaAnterior?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-stock">
                    <span>Disponibles: {product.existencia}</span>
                    {product.stockMaximo > 0 && (
                      <span className="max-stock">Máx: {product.stockMaximo}</span>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="btn btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdmin;