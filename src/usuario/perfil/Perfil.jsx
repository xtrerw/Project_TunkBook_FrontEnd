// 
import React from 'react'
import { useState,useEffect } from 'react'
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//css
import './Perfil.css'
//componentes
import Login from '../Login'
import CambiarContrasena from '../autor/CambiarContrasena';
import EditarInformacion from './EditarInformacion';
import MisFavoritos from './MisFavoritos';
import EditableInput from '../../componentes/EditableInput';

const PerfilReader = () => {
    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
  //funcion de navegacion
  const navigate = useNavigate();
  // seleccionar la pestaña activa
  const [selectedTab, setSelectedTab] = useState("Mi Tunk");
  //btn descripcion
  const [isAddDescp,addDescp]=useState(false)
  //conseguir los datos de usuario
  const {user, setUser, loadingUser}=useUser();
  //
  const apiUrl=import.meta.env.VITE_API_URL;
  useEffect(()=>{
    console.log("infor user",user);
  },[user])
  //muestrar informacion
 useEffect(() => {
  if (loadingUser || (user && user.email&&user.dateBirth)) return; // 
  //send cookie a Backend
   axios.get(`${apiUrl}/users/info`, {
    withCredentials: true
  })
  //get infor de user
  .then((res) => setUser(res.data.data))
  .catch((err) => console.error("Error al obtener info del usuario", err));
}, [loadingUser, user]);

  // UPDATE los datos del usuario
  const fetchUserData = () => {
    const userId=user.id;
    if (userId) {
      fetch(`${apiUrl}users/${userId}/update`)
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error("Error al obtener los datos:", error));
    }
  };
  //LOGOUT 
  const logout=async()=>{
    try{
      await axios.post(`${apiUrl}/logout`, null, {
        withCredentials: true
      })
      setUser(null);
      navigate("/")
    }catch(e){
      console.error(e)
    }
  }
  //
  if (!user) {
    return <Login />;
  }
  return (
    <div className="profile-container">
      {/* titulo */}
      <div className='profile-header'>
        <img src={`${apiUrl}${user.imgPerfil}`} alt="" />
        <h1 className="info-value">hola {user.username} 😁</h1>
      </div>
      
      {/* Header de informacion */}
      <div className="profile-navbar">
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
          className={selectedTab === "Favoritos" ? "active-tab" : ""}
          onClick={() => setSelectedTab("Favoritos")}
        >
          Favoritos
        </h2>
        <h2
          className="logout"
          onClick={logout}
        >
          Cerrar Sesión
        </h2>
      </div>

      {/* Parte derecha */}
      <div className="profile-content">
        {selectedTab === "Mi Tunk" && (
          <section className='info-section-edit'>
              <div className='info-desc'>
                <h1>Descripción</h1>
                {isAddDescp==false?(
                <div>
                  <span className="info-label">Para que los demás te conozcan mejor</span>
                  <div className='info-btn-desc' onClick={()=>addDescp(!isAddDescp)}>
                    <span>agregar descripción</span>
                  </div>
                </div>
                ):(
                  <div>
                    <EditableInput/>
                    <div className='info-btn-desc' onClick={()=>addDescp(!isAddDescp)}>
                      <span>Confirma</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="info-section">
                <h1>Perfil</h1>
                <div className='info-form-edit'>
                    <div className='info-item'>
                      <span className="info-label">nombre de usuario:</span>
                      <span className="info-value">{user.username}</span>
                    </div>
                    <div className='info-btn-change'>
                      <span> cambiar </span>
                    </div>
                </div>
                <hr />
                <div className="info-item">
                  <span className="info-label">Correo Electrónico:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <hr />
                <div className="info-item">
                  <span className="info-label">Fecha Nacimiento:</span>
                  {/* para guardar la fecha sin horario */}
                  <span className="info-value"> {user.dateBirth?.split("T")[0]}</span>
                </div>
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
        {selectedTab === "Favoritos" && <MisFavoritos/>}
      </div>
    </div>
  )
}

export default PerfilReader
