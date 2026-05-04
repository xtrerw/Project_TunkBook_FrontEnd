import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './GestionCuenta.css'
import Cargando from '../utils/Cargando'; // Importar el componente de carga
import BuscadorCuenta from './BuscadorCuenta';
const GestionLector = () => {

  const [loading, setLoading] = useState(false);
  //conseguir la lista de usuarios
  const [usuarios, setUsuarios] = useState([])
  //conseguir la lista de usuarios
   const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5001/usuario/listado")
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data)
        console.log(data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Desactivar el indicador de carga después de obtener los datos
      });
  }, []);
  //actualizar el estado de un usuario
  const handleChange = (id, newActivo) => {
    setUsuarios((preUsers) =>
      preUsers.map((user) => {
        if (user._id === id) {
          return { ...user, activo: newActivo };
        }
        return user;
      })
    );
  }
  //activar o desactivar usuario
  const handleSubmit = (e,usuario) => {
    setLoading(true);
    //prevenir el comportamiento por defecto del formulario
    e.preventDefault()
    fetch(`http://localhost:5001/admin/actualizarLector/${usuario._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({activo: usuario.activo}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      })
      .finally(() => {
        setLoading(false); // Desactivar el indicador de carga después de la actualización
      });
  }
  //eliminar lector
  const handleDelete = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este lector?");
    if (!confirmar) return; // Si el usuario cancela, no hacer nada

    setLoading(true);// Activar el indicador de carga antes de la eliminación
    fetch(`http://localhost:5001/admin/eliminarLector/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Actualizar la lista de usuarios después de eliminar
        setUsuarios((prevUsers) => prevUsers.filter((user) => user._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      })
      .finally(() => {
        setLoading(false); // Desactivar el indicador de carga después de la eliminación
      });
  }
  if (loading) return <Cargando/>; // Indicador de carga

  // Filtrar usuarios según el término de búsqueda
  const usuariosFiltrados = usuarios.filter((user) =>
    `${user.nombre} ${user.apellido} ${user.usernombre}`.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  return (
    <div className="contenedor-cards">

       <BuscadorCuenta
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar lector por nombre o usuario..."
      />

      <div className='grid-layout'>
      {/* conseguir todos usuarios */}
        {usuariosFiltrados.map((usuario) => (
          <form key={usuario._id} onSubmit={(e)=>handleSubmit(e,usuario)} className='card-usuario' >
            <h2>{usuario.nombre} {usuario.apellido}</h2>
            <p>usuario: {usuario.usernombre}</p>
            <select name="activo" id="" 
            value={usuario.activo}
            // 
            onChange={(e) => 
              handleChange(
                usuario._id, 
              //convertir el valor a booleano
              e.target.value=== "true"
              )}>
              <option value="true">activo</option>
              <option value="false">inactivo</option>
            </select>
            <button type="submit">actualizar</button>
            {/* btn eliminar */}
            <button className='btn-eliminar' onClick={()=>handleDelete(usuario._id)}>Eliminar</button>
          </form>
        ))}
      </div>
     
    </div>
  )
}

export default GestionLector
