import React, { useState, useEffect } from "react";
import { useCart } from './CartContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBRadio,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBBadge
} from "mdb-react-ui-kit";

export default function PaymentPage() {
  const navigate = useNavigate();
  document.title = 'Pago';
  const { cartItems, clearCart } = useCart();
  const [metodoPago, setMetodoPago] = useState("TARJETA_CREDITO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [codigoPromocional, setCodigoPromocional] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [codigoValido, setCodigoValido] = useState(false);
  const [mostrarInputCodigo, setMostrarInputCodigo] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    email: '',
    telefono: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  });

  // Códigos promocionales válidos (en una app real, esto vendría de una API)
  const codigosValidos = {
    "DESCUENTO10": 0.1,   // 10% de descuento
    "VERANO20": 0.2,      // 20% de descuento
    "CLIENTE5": 0.05      // 5% de descuento
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearCart();
        navigate('/catalogo');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearCart, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMetodoPagoChange = (e) => {
    const seleccionado = e.target.labels[0].innerText;
    const tipoPago = seleccionado === "Tarjeta de crédito" ? "TARJETA_CREDITO" : "TARJETA_DEBITO";
    setMetodoPago(tipoPago);
    if (tipoPago === "TARJETA_DEBITO") {
      window.location.href = "https://ui.pse.com.co/ui/";
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateIVA = () =>
    calculateSubtotal() * 0.19;

  const calculateDescuento = () => {
    const subtotal = calculateSubtotal();
    return subtotal * descuentoAplicado;
  };

  const calculateTotal = () =>
    calculateSubtotal() + calculateIVA() - calculateDescuento();

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price).replace('COP', '$');

  const aplicarCodigoPromocional = () => {
    const codigo = codigoPromocional.trim().toUpperCase();
    
    if (codigosValidos[codigo]) {
      setDescuentoAplicado(codigosValidos[codigo]);
      setCodigoValido(true);
      setError(null);
    } else {
      setError('Código promocional no válido');
      setDescuentoAplicado(0);
      setCodigoValido(false);
    }
  };

  const removerCodigoPromocional = () => {
    setCodigoPromocional("");
    setDescuentoAplicado(0);
    setCodigoValido(false);
    setMostrarInputCodigo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (metodoPago === "TARJETA_CREDITO" && 
        (!formData.numeroTarjeta || !formData.fechaExpiracion || !formData.cvv)) {
      setError('Por favor complete todos los datos de la tarjeta');
      setLoading(false);
      return;
    }

    try {
      const pagoPayload = {
        descripcion: `Pago con ${metodoPago}`,
        estado: 1,
        tipo: metodoPago,
        nombreTitular: formData.nombre || "Anónimo",
        numeroTarjeta: formData.numeroTarjeta,
        fechaExpiracion: formData.fechaExpiracion,
        monto: calculateTotal(),
        descuentoAplicado: calculateDescuento(),
        codigoPromocional: codigoValido ? codigoPromocional : null
      };

      const pagoResp = await axios.post(
        'http://localhost:8181/metodoPago/saveMetodoPago',
        pagoPayload
      );

      const idVentaGenerada = pagoResp.data["12.5-id"];

      const detallePromises = cartItems.map(item => {
        const detallePayload = {
          idVenta: idVentaGenerada,
          idProducto: item.id,
          cantComp: item.quantity,
          valorUnit: item.price,
          valorIva: item.price * item.quantity * 0.19,
          valorDscto: item.price * item.quantity * descuentoAplicado,
          clienteId: 1,
        };
        return axios.post(
          'http://localhost:8181/detalleVenta/saveDetalleVenta',
          detallePayload
        );
      });

      await Promise.all(detallePromises);

      setSuccess(true);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al procesar el pago. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="py-5">
      {error && !success && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          />
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          ¡Pago y detalles guardados con éxito! Redirigiendo al catálogo...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <MDBRow>
          <MDBCol md="8" className="mb-4">
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <h5 className="mb-0">Detalles de facturación</h5>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBRow className="mb-4">
                  <MDBCol>
                    <MDBInput 
                      label="Nombre" 
                      id="nombre" 
                      type="text"
                      value={formData.nombre} 
                      onChange={handleInputChange} 
                      required
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput 
                      label="Apellido" 
                      id="apellido" 
                      type="text"
                      value={formData.apellido} 
                      onChange={handleInputChange} 
                      required
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput 
                  wrapperClass="mb-4" 
                  label="Dirección" 
                  id="direccion" 
                  type="text"
                  value={formData.direccion} 
                  onChange={handleInputChange} 
                  required
                />
                <MDBInput 
                  wrapperClass="mb-4" 
                  label="Correo electrónico" 
                  id="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required
                />
                <MDBInput 
                  wrapperClass="mb-4" 
                  label="Número de teléfono" 
                  id="telefono" 
                  type="tel"
                  value={formData.telefono} 
                  onChange={handleInputChange} 
                  required
                />

                <hr className="my-4"/>
                
                {/* Sección de código promocional */}
                <div className="mb-4">
                  {!mostrarInputCodigo ? (
                    <MDBBtn 
                      color="link" 
                      onClick={() => setMostrarInputCodigo(true)}
                      className="p-0 text-decoration-none"
                    >
                      ¿Tienes un código promocional?
                    </MDBBtn>
                  ) : (
                    <div className="d-flex align-items-center">
                      <MDBInput 
                        label="Código promocional" 
                        id="codigoPromocional" 
                        type="text"
                        wrapperClass="me-2 flex-grow-1"
                        value={codigoPromocional} 
                        onChange={(e) => setCodigoPromocional(e.target.value)}
                      />
                      <MDBBtn 
                        color="success" 
                        size="sm" 
                        onClick={aplicarCodigoPromocional}
                        disabled={!codigoPromocional.trim()}
                      >
                        Aplicar
                      </MDBBtn>
                      {codigoValido && (
                        <MDBBtn 
                          color="danger" 
                          size="sm" 
                          className="ms-2" 
                          onClick={removerCodigoPromocional}
                        >
                          Remover
                        </MDBBtn>
                      )}
                    </div>
                  )}
                  {codigoValido && (
                    <div className="mt-2">
                      <MDBBadge color="success" pill>
                        Descuento del {(descuentoAplicado * 100)}% aplicado
                      </MDBBadge>
                    </div>
                  )}
                </div>

                <h5 className="mb-4">Método de pago</h5>
                <MDBRadio 
                  name="flexRadioDefault" 
                  id="credito" 
                  label="Tarjeta de crédito"
                  checked={metodoPago === "TARJETA_CREDITO"} 
                  onChange={handleMetodoPagoChange}
                />
                <MDBRadio 
                  name="flexRadioDefault" 
                  id="debito" 
                  label="Tarjeta de débito"
                  checked={metodoPago === "TARJETA_DEBITO"} 
                  onChange={handleMetodoPagoChange}
                />

                {metodoPago === "TARJETA_CREDITO" && (
                  <>
                    <MDBRow className="mt-4">
                      <MDBCol>
                        <MDBInput 
                          label="Número de tarjeta" 
                          id="numeroTarjeta" 
                          type="text"
                          wrapperClass="mb-4"
                          value={formData.numeroTarjeta} 
                          onChange={handleInputChange} 
                          required
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput 
                          label="Fecha de expiración (MM/AA)" 
                          id="fechaExpiracion" 
                          type="text"
                          wrapperClass="mb-4"
                          value={formData.fechaExpiracion} 
                          onChange={handleInputChange} 
                          required
                        />
                      </MDBCol>
                      <MDBCol md="6">
                        <MDBInput 
                          label="CVV" 
                          id="cvv" 
                          type="text"
                          wrapperClass="mb-4"
                          value={formData.cvv} 
                          onChange={handleInputChange} 
                          required
                        />
                      </MDBCol>
                    </MDBRow>
                  </>
                )}

                <MDBBtn 
                  type="submit" 
                  size="lg" 
                  block 
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : `Pagar ${formatPrice(calculateTotal())}`}
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="4" className="mb-4">
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <h5 className="mb-0">Resumen de la compra</h5>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBListGroup flush>
                  {cartItems.map((item, i) => (
                    <MDBListGroupItem key={i}
                      className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      <div>
                        <strong>{item.name}</strong><br/>
                        <small>{item.quantity} x {formatPrice(item.price)}</small>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </MDBListGroupItem>
                  ))}
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Subtotal<span>{formatPrice(calculateSubtotal())}</span>
                  </MDBListGroupItem>
                  {descuentoAplicado > 0 && (
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Descuento ({descuentoAplicado * 100}%)
                      <span className="text-danger">-{formatPrice(calculateDescuento())}</span>
                    </MDBListGroupItem>
                  )}
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    IVA (19%)<span>{formatPrice(calculateIVA())}</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Envío<span>Gratis</span>
                  </MDBListGroupItem>
                  <hr className="my-2"/>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    <strong>Total a pagar</strong>
                    <span><strong>{formatPrice(calculateTotal())}</strong></span>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </form>
    </MDBContainer>
  );
}