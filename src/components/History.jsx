import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConsultaVentasPorCorreo = () => {
      document.title = "Historial de ventas";
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
   
    const fetchVentas = async () => {
        
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8181/venta/getAll');
        if (!response.ok) {
          throw new Error('Error al obtener las ventas');
        }
        const data = await response.json();
        console.log('Ventas recibidas:', data);
        setVentas(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ventas:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor ingrese un correo electrónico');
      return;
    }

    console.log('Buscando email:', email);
    console.log('Ventas disponibles:', ventas);

   const filtered = ventas.filter(venta =>
  venta.correoCliente?.toLowerCase().trim().includes(email.toLowerCase().trim())
);


    console.log('Ventas filtradas:', filtered);

   

    setFilteredVentas(filtered);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Consultar compras</h2>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Correo Electrónico del Cliente</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="email"
              placeholder="Ingrese el correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button variant="primary" type="submit" className="ms-2">
              Buscar
            </Button>
          </div>
        </Form.Group>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : filteredVentas.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Valor Venta</th>
              <th>Valor IVA</th>
                <th>Valor Descuento</th>
              <th>Estado</th>
            </tr>
          </thead>
         <tbody>
  {filteredVentas.map((venta) => (
    <tr key={venta.id}>
      <td>{venta.id}</td>
      <td>{venta.fechaVenta}</td>
      <td>{venta.usernameCliente}</td>
      <td>{venta.correoCliente}</td>
      <td>{formatCurrency(venta.valorVenta)}</td>
      <td>{formatCurrency(venta.valorIva)}</td>
      <td>{formatCurrency(venta.valorDscto)}</td>
      <td>
        <span className={`badge ${venta.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
          {venta.estado === 1 ? 'Activo' : 'Inactivo'}
        </span>
      </td>
    </tr>
  ))}
</tbody>

        </Table>
      ) : (
        !error && <Alert variant="info">Ingrese un correo electrónico para buscar ventas</Alert>
      )}
                 <div className="position-absolute bottom-0 end-0 m-3">
      <button 
  onClick={() => navigate(-1)}
  className="btn btn-primary position-absolute bottom-0 end-0 m-3"
>
  Volver
</button>

</div>
    </Container>
    
  );
};

export default ConsultaVentasPorCorreo;