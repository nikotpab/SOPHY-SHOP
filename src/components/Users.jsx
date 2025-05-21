import React from "react";
import "../css/Users.css";
import { useNavigate } from "react-router";

const users = [
  {
    id: 1,
    nombre: "Juan Pérez",
    usuario: "jperez",
    correo: "juan.perez@example.com",
    estado: "Activo",
    ultimaClave: "2025-05-10",
  },
  {
    id: 2,
    nombre: "María García",
    usuario: "mgarcia",
    correo: "maria.garcia@example.com",
    estado: "Inactivo",
    ultimaClave: "2025-04-15",
  },
  {
    id: 3,
    nombre: "Carlos López",
    usuario: "clopez",
    correo: "carlos.lopez@example.com",
    estado: "Activo",
    ultimaClave: "2025-05-18",
  },
];

const TablaUsuarios = () => {
    document.title='Administración de usuarios'
    const navigate = useNavigate();
    const handleRegresar = () => {
        navigate(-1); 
      };
  
  return (
    <div className="tabla-container">
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Último Cambio de Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.usuario}</td>
                <td>{user.correo}</td>
                <td>
                  <span className={`estado ${user.estado.toLowerCase()}`}>
                    {user.estado}
                  </span>
                </td>
                <td>{user.ultimaClave}</td>
              </tr>
            ))}
          </tbody>
        </table>
<br/>
    
      </div>

      <button className="btn-regresar" onClick={handleRegresar}> 
  ← Regresar
</button>

    </div>

    
  );
};

export default TablaUsuarios;
