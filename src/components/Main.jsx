import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer, MDBInput, MDBBtn, MDBModal,
  MDBModalDialog, MDBModalContent, MDBModalHeader,
  MDBModalTitle, MDBModalBody, MDBModalFooter
} from 'mdb-react-ui-kit';

function Component() {

  const [showModal, setShowModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotData, setForgotData] = useState({ username: '', email: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    id_tipo_usuario: 2
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = "http://localhost:8181/usuario";

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correoUsuario: loginData.email,
          clave: loginData.password
        })
      });
  
      const data = await response.text();
  
      if (response.ok) {
        localStorage.setItem('userEmail', loginData.email);
        if (
          loginData.email === 'rojaswilson@unbosque.edu.co' &&
          loginData.password === 'Admin123'
        ) {
          navigate('/admin/dashboard'); 
        } else {
          window.location.href = "/user/main_page.html"; 
        }
      } else {
        setError(data);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleForgotPassword = async () => {
    try {
      console.log(`Salida del sistema: ${forgotData.username} ${forgotData.email}`);
      const url = `${API_URL}/mailPassword?username=${encodeURIComponent(forgotData.username)}&mail=${encodeURIComponent(forgotData.email)}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const responseText = await response.text();

      if (response.ok) {
        setShowForgotModal(false);
        setError('');
        alert('Se ha enviado un correo para recuperar su contraseña.');
      } else {
        setError(responseText);
      }
    } catch (err) {
      setError('Error al intentar enviar el correo.');
    }
  };



  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/saveUsuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: registerData.username,
          correoUsuario: registerData.email,
          clave: registerData.password,
          id_tipo_usuario: registerData.id_tipo_usuario
        })
      });

      if (response.ok) {
        setShowModal(false);
        setError('');
        alert('¡Registro exitoso! Por favor inicia sesión');
      } else {
        const errorData = await response.text();
        setError(errorData);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <MDBInput 
        wrapperClass='mb-4' 
        label='Correo electrónico' 
        type='email'
        value={loginData.email}
        onChange={e => setLoginData({...loginData, email: e.target.value})}
      />
      <MDBInput 
        wrapperClass='mb-4' 
        label='Contraseña' 
        type='password'
        value={loginData.password}
        onChange={e => setLoginData({...loginData, password: e.target.value})}
      />
      
      <MDBBtn color="dark" className="mb-4" onClick={handleLogin}>
        Iniciar sesión
      </MDBBtn>

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
        <p>
          ¿Olvidó su contraseña?{' '}
          <button
              className="btn btn-link p-0"
              style={{ textDecoration: 'underline', background: 'none', border: 'none', color:'#343a40'}}
              onClick={() => setShowForgotModal(true)}
          >
            Recuperar acceso
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
              <MDBInput 
                className='mb-3' 
                label='Nombre de usuario' 
                type='text'
                value={registerData.username}
                onChange={e => setRegisterData({...registerData, username: e.target.value})}
              />
              <MDBInput 
                className='mb-3' 
                label='Correo electrónico' 
                type='email'
                value={registerData.email}
                onChange={e => setRegisterData({...registerData, email: e.target.value})}
              />
              <MDBInput 
                className='mb-3' 
                label='Contraseña' 
                type='password'
                value={registerData.password}
                onChange={e => setRegisterData({...registerData, password: e.target.value})}
              />
              <MDBInput 
                className='mb-3' 
                label='Confirmar Contraseña' 
                type='password'
                value={registerData.confirmPassword}
                onChange={e => setRegisterData({...registerData, confirmPassword: e.target.value})}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn style={{ backgroundColor: '#969494', color: 'white' }} onClick={() => setShowModal(false)}>
                Cerrar
              </MDBBtn>
              <MDBBtn color='dark' onClick={handleRegister}>
                Registrarme
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal open={showForgotModal} setOpen={setShowForgotModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Recuperar Contraseña</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setShowForgotModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                  className='mb-3'
                  label='Nombre de usuario'
                  type='text'
                  value={forgotData.username}
                  onChange={e => setForgotData({...forgotData, username: e.target.value})}
              />
              <MDBInput
                  className='mb-3'
                  label='Correo electrónico'
                  type='email'
                  value={forgotData.email}
                  onChange={e => setForgotData({...forgotData, email: e.target.value})}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn style={{ backgroundColor: '#969494', color: 'white' }} onClick={() => setShowForgotModal(false)}>
                Cerrar
              </MDBBtn>
              <MDBBtn color='dark' onClick={handleForgotPassword}>
                Enviar solicitud
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

    </MDBContainer>
  );
}

export default Component;
