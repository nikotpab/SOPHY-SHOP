import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmpresaAdmin = () => {
  const [empresa, setEmpresa] = useState({
    razonSocial: '',
    direccion: '',
    correoElectronico: '',
    telefono: '',
    estado: 1
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const API_URL = 'http://localhost:8181/empresa';
const navigate = useNavigate();

  useEffect(() => {
    document.title='Administrar empresa'
    cargarEmpresa();
  }, []);

  const cargarEmpresa = async () => {
    try {
      setCargando(true);
      const response = await axios.get(`${API_URL}/getAll`);

      if (response.data && response.data.length > 0) {
        const empresaData = response.data[0];
        setEmpresa({
          id: empresaData.id,
          razonSocial: empresaData.razonSocial || '',
          direccion: empresaData.direccion || '',
          correoElectronico: empresaData.correoElectronico || '',
          telefono: empresaData.telefono || '',
          estado: empresaData.estado === 1 ? 1 : 0
        });
      }
    } catch (err) {
      console.error('Error al cargar empresa:', err);
      setError('Error al cargar los datos de la empresa');
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresa({
      ...empresa,
      [name]: name === 'estado' ? parseInt(value) : value
    });
  };

  const validarFormulario = () => {
    const errores = [];

    if (!empresa.razonSocial.trim()) errores.push('La razón social es obligatoria');
    if (!empresa.direccion.trim()) errores.push('La dirección es obligatoria');
    if (!empresa.correoElectronico.trim()) errores.push('El correo electrónico es obligatorio');
    if (!empresa.telefono.trim()) errores.push('El teléfono es obligatorio');

    if (empresa.correoElectronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.correoElectronico)) {
      errores.push('El formato del correo electrónico no es válido');
    }

    return errores;
  };

  const guardarEmpresa = async () => {
    try {
      setError('');
      setMensaje('');

      const erroresValidacion = validarFormulario();
      if (erroresValidacion.length > 0) {
        throw new Error(erroresValidacion.join('\n'));
      }

      const datosParaEnviar = {
        razonSocial: empresa.razonSocial,
        direccion: empresa.direccion,
        correoElectronico: empresa.correoElectronico,
        telefono: empresa.telefono,
        estado: empresa.estado
      };

      if (empresa.id) {
        datosParaEnviar.id = empresa.id;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const response = await axios.post(`${API_URL}/saveEmpresa`, datosParaEnviar, config);

      if (response.status === 200 || response.status === 201) {
        setMensaje('Empresa guardada correctamente');
        setEmpresa({
          ...response.data,
          estado: response.data.estado === 1 ? 1 : 0
        });
      }
    } catch (err) {
      console.error('Error completo al guardar empresa:', err);

      let mensajeError = 'Error al guardar la empresa';

      if (err.response) {
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            mensajeError = err.response.data;
          } else if (err.response.data.message) {
            mensajeError = err.response.data.message;
          } else if (err.response.data.error) {
            mensajeError = err.response.data.error;
          }
        }

        if (err.response.status === 500) {
          mensajeError = mensajeError || 'Error interno del servidor. Por favor, intente nuevamente.';
        }
      } else if (err.message) {
        mensajeError = err.message;
      }

      setError(mensajeError);
    }
  };

  if (cargando) {
    return <div className="container mt-4">Cargando datos de la empresa...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Administración de Empresa</h2>

      {mensaje && (
        <div className="alert alert-success alert-dismissible fade show">
          {mensaje}
          <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" style={{ whiteSpace: 'pre-line' }}>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">Datos de la Empresa</div>
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); guardarEmpresa(); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Razón Social *</label>
                <input
                  type="text"
                  className="form-control"
                  name="razonSocial"
                  value={empresa.razonSocial}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Dirección *</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={empresa.direccion}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Correo Electrónico *</label>
                <input
                  type="email"
                  className="form-control"
                  name="correoElectronico"
                  value={empresa.correoElectronico}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telefono"
                  value={empresa.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  name="estado"
                  value={empresa.estado}
                  onChange={handleInputChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                {empresa.id ? 'Actualizar Empresa' : 'Guardar Empresa'}
              </button>

              <button className="btn btn-primary" onClick={() => navigate(-1)}>
  ← Volver
</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmpresaAdmin;
