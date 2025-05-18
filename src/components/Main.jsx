import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer, MDBInput, MDBBtn, MDBModal,
  MDBModalDialog, MDBModalContent, MDBModalHeader,
  MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';

function Component() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
   
 
      <MDBInput wrapperClass='mb-4' label='Correo electrónico' id='form1' type='email' />
      <MDBInput wrapperClass='mb-4' label='Contraseña' id='form2' type='password' />
      <MDBBtn color="dark" className="mb-4" onClick={() => window.location.href = '/user/main_page.html'}>Iniciar sesión</MDBBtn>

      <div className="text-center">
        <p>
          ¿Desea registrarse?{' '}
          <button 
            className="btn btn-link p-0"
            style={{ textDecoration: 'underline', background: 'none', border: 'none', color:'#343a40'}}
            onClick={() => setShowModal(true)}
          >
            Registrarse
          </button>
        </p>
      </div>
   
      <MDBModal open={showModal} setOpen={setShowModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Registro</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setShowModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput className='mb-3' label='Nombre completo' type='text' />
              <MDBInput className='mb-3' label='Número de cédula' type='number' />
              <MDBInput className='mb-3' label='Dirección' type='text' />
              <MDBInput className='mb-3' label='Correo electrónico' type='email' />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn style={{ backgroundColor: '#969494', color: 'white' }} onClick={() => setShowModal(false)}>
                Cerrar
              </MDBBtn>
              <MDBBtn color='dark'>Registrarme</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}

export default Component;
