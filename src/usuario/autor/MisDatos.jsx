import React, { useState, useEffect } from 'react';
import Author from './Login';
import './MisDatos.css';
import CambiarContrasena from './CambiarContrasena';
import EditarInformacion from './EditarInformacion';
import { useUser } from '../../context/UserContext';

const MisDatos = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Mi Tunk");

    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  // Función para obtener los datos del usuario desde la API
  const fetchUserData = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:5001/autor/${userId}`)
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error("Error al obtener los datos:", error));
    }
  };

  // Cargar datos al inicio
  const {id,setUser}=useUser();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    
    if (userId) {
      setIsRegistered(true);
      fetchUserData();
    }
  }, [userId]);

  return (
    <>
      {isRegistered && userData ? (
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
                localStorage.removeItem("userId");
                setIsRegistered(false);
                setUser(null);
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
                  <span className="info-value">{userData.nombre} {userData.apellido}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Género:</span>
                  <span className="info-value">{userData.genero || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">La Fecha Nacimiento:</span>
                  {/* para guardar la fecha sin horario */}
                  <span className="info-value"> {userData.fechaNacimiento?.split("T")[0]}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nacionalidad:</span>
                  <span className="info-value">{userData.nacionalidad || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Correo Electrónico:</span>
                  <span className="info-value">{userData.email}</span>
                </div>
              </section>
            )}

            {selectedTab === "Dirección" && (
              <section className="info-section">
                <h1>Dirección</h1>
                <div className="info-item">
                  <span className="info-label">País:</span>
                  <span className="info-value">{userData.pais || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Provincia:</span>
                  <span className="info-value">{userData.provincia || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dirección:</span>
                  <span className="info-value">{userData.direccion || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Código Postal:</span>
                  <span className="info-value">{userData.codigoPostal || "No especificado"}</span>
                </div>
              </section>
            )}

            {selectedTab === "Editar Información" && <EditarInformacion 
              tipoUsuario={userData.tipo}
              onSuccess={() => {
                fetchUserData(); //conseguir los datos actualizados
                setSelectedTab("Mi Tunk");//pasar a la pestaña de "Mi Tunk"
              }}
            />}
            {selectedTab === "Cambiar Contraseña" && <CambiarContrasena />}
          </div>
        </div>
      ) : (
        <Author />
      )}
    </>
  );
};

export default MisDatos;
