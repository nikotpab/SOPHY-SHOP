import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Category.css';

const Audit = () => {
  document.title = 'Auditoría';

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:8181/logs/recent')
      if (!response.ok) {
        throw new Error('Error al obtener registros de auditoría');
      }
      const data = await response.json();
      setLogs(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando registros de auditoría...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <Link to="/admin/dashboard" className="back-button">
        ← Volver al Dashboard
      </Link>

      <h1 className="page-title">Registros de Auditoría</h1>

      {logs.length === 0 ? (
        <div className="empty-state">
          No hay registros de auditoría
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{new Date(log.fecha).toLocaleString()}</td>
                <td>{log.usuario}</td>
                <td>{log.accion}</td>
                <td>{log.detalles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Audit;
