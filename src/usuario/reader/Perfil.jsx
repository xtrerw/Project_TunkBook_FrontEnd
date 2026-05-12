import React from 'react'
import { useState,useEffect } from 'react'
import { useUser } from '../../context/UserContext';
import NotFound from '../NotFound';
import { useNavigate } from 'react-router-dom';
import CambiarContrasena from '../autor/CambiarContrasena';
import EditarInformacionLector from './EditarInformacionLector';
import MisFavoritos from './MisFavoritos';
const PerfilReader = () => {
    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
  //funcion de navegacion
  const navigate = useNavigate();
  // seleccionar la pestaña activa
  const [selectedTab, setSelectedTab] = useState("Mi Tunk");
  //conseguir los datos de usuario
  const {user, setUser}=useUser();
  
  // actualizar los datos del usuario
  const fetchUserData = () => {
    const userId=user._id;
    if (userId) {
      fetch(`http://localhost:5001/autor/${userId}`)
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error("Error al obtener los datos:", error));
    }
  };
  //
  if (!user) {
    return <NotFound />;
  }
  return (
    <div className="profile-container">
          {/* Parte izquierda */}
          <aside className="profile-sidebar">
            <h2 
              className={selectedTab === "Mi Tunk" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Mi Tunk")}
            >
              Mi Tunk
            </h2>
            <h2 
              className={selectedTab === "Dirección" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Dirección")}
            >
              Dirección
            </h2>
            <h2
              className={selectedTab === "Mis Favoritos" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Mis Favoritos")}
            >
              Mis Favoritos
            </h2>
            <h2 
              className={selectedTab === "Editar Información" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Editar Información")}
            >
              Editar Información
            </h2>
            <h2 
              className={selectedTab === "Cambiar Contraseña" ? "active-tab" : ""}
              onClick={() => setSelectedTab("Cambiar Contraseña")}
            >
              Cambiar Contraseña
            </h2>
            <h2
              className="logout"
              onClick={() => {
                setUser(null);
                navigate("/"); // Redirigir a la página de inicio
              }}
            >
              Cerrar Sesión
            </h2>
          </aside>

          {/* Parte derecha */}
          <div className="profile-content">

            {selectedTab === "Mi Tunk" && (
              <section className="info-section">
                <h1>Información Personal</h1>
                <div className="info-item">
                  <span className="info-label">Nombre:</span>
                  <span className="info-value">{user.nombre} {user.apellido}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Género:</span>
                  <span className="info-value">{user.genero || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">La Fecha Nacimiento:</span>
                  {/* para guardar la fecha sin horario */}
                  <span className="info-value"> {user.fechaNacimiento?.split("T")[0]}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nacionalidad:</span>
                  <span className="info-value">{user.nacionalidad || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Correo Electrónico:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teléfono:</span>
                  <span className="info-value">{user.telefono || "No especificado"}</span>
                </div>
              </section>
            )}

            {selectedTab === "Dirección" && (
              <section className="info-section">
                <h1>Dirección</h1>
                <div className="info-item">
                  <span className="info-label">País:</span>
                  <span className="info-value">{user.pais || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Provincia:</span>
                  <span className="info-value">{user.provincia || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dirección:</span>
                  <span className="info-value">{user.direccion || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Código Postal:</span>
                  <span className="info-value">{user.codigoPostal || "No especificado"}</span>
                </div>
              </section>
            )}

            {selectedTab === "Editar Información" && <EditarInformacionLector 
              onSuccess={() => {
                fetchUserData(); // Actualizar los datos del usuario
                setSelectedTab("Mi Tunk");//pasar a la pestaña de "Mi Tunk"
              }}
            />}
            {selectedTab === "Mis Favoritos" && <MisFavoritos/>}
            {selectedTab === "Cambiar Contraseña" && <CambiarContrasena />}
          </div>
        </div>
  )
}

export default PerfilReader
