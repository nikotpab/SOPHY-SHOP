import React from "react";
import { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBRadio,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";


export default function App() {
  document.title='Pago'
  const [metodoPago, setMetodoPago] = useState("Tarjeta de crédito");
  const handleMetodoPagoChange = (e) => {
    const seleccionado = e.target.labels[0].innerText;
    setMetodoPago(seleccionado);
    if (seleccionado === "Tarjeta de débito") {
      window.location.href = "https://ui.pse.com.co/ui/";
    }
  };
  return (

    
    <MDBContainer className="py-5">
      <MDBRow>
        <MDBCol md="8" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <h5 className="mb-0">Detalles de facturación</h5>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="mb-4">
                <MDBCol>
                  <MDBInput label="Nombre" id="form1" type="text" />
                </MDBCol>

                <MDBCol>
                  <MDBInput label="Apellido" id="form2" type="text" />
                </MDBCol>
              </MDBRow>

              <MDBInput
                wrapperClass="mb-4"
                label="Dirección"
                id="form3"
                type="text"
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Correo electrónico"
                id="form4"
                type="email"
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Número de teléfono"
                id="form5"
                type="number"
              />

              <hr className="my-4" />

              <hr className="my-4" />

              <h5 className="mb-4">Payment</h5>

              <MDBRadio
                name="flexRadioDefault"
                id="credito"
                label="Tarjeta de crédito"
                checked={metodoPago === "Tarjeta de crédito"}
                onChange={handleMetodoPagoChange}
              />


<MDBRadio
                name="flexRadioDefault"
                id="debito"
                label="Tarjeta de débito"
                checked={metodoPago === "Tarjeta de débito"}
                onChange={handleMetodoPagoChange}
              />
             

              <MDBRow>
                <MDBCol>
                  <MDBInput
                    label="Titular de la tarjeta"
                    id="form6"
                    type="text"
                    wrapperClass="mb-4"
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    label="Titular de la tarjeta"
                    id="form7"
                    type="text"
                    wrapperClass="mb-4"
                  />
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md="3">
                  <MDBInput
                    label="Fecha de expiración"
                    id="form8"
                    type="text"
                    wrapperClass="mb-4"
                  />
                </MDBCol>
                <MDBCol md="3">
                  <MDBInput
                    label="CVV"
                    id="form8"
                    type="text"
                    wrapperClass="mb-4"
                  />
                </MDBCol>
              </MDBRow>

              <MDBBtn size="lg" block onClick={() => {
    alert("Pago procesado exitosamente.");
  }}> 
                Pagar
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
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Productos
                  <span>$53.98</span>
                </MDBListGroupItem>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Envío
                  <span>Gratis</span>
                </MDBListGroupItem>
                <hr className="my-2"></hr>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  <div>
                    <strong>Pago total (incluyendo IVA)</strong>
                  </div>
                  <span>
                    <strong>$53.98</strong>
                  </span>
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}