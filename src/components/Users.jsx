import React, { useEffect, useState } from "react";
import "../css/Users.css";
import { useNavigate } from "react-router";

const TablaUsuarios = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Administración de usuarios";
    fetch("http://localhost:8181/usuario/getAll")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener usuarios");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  const handleRegresar = () => {
    navigate(-1);
  };

  const handleDelete = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;

    fetch(`http://localhost:8181/usuario/deleteUsuario/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar el usuario");
        }

        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="tabla-container">
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Último Cambio de Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.login}</td>
                <td>{user.correoUsuario}</td>
                <td>
                  <span className={`estado ${user.estado === 0 ? "activo" : "inactivo"}`}>
                    {user.estado === 0 ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>{new Date(user.fchaUltmaClave).toLocaleDateString()}</td>
                <td>
                  <button className="btn-eliminar" onClick={() => handleDelete(user.id)}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
      </div>

      <button className="btn-regresar" onClick={handleRegresar}>
        ← Regresar
      </button>
    </div>
  );
};

export default TablaUsuarios;
