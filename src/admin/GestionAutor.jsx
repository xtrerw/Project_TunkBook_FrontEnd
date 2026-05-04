import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './GestionCuenta.css'
import Cargando from '../utils/Cargando'; // Importar el componente de carga
import { Link } from 'react-router-dom';
import BuscadorCuenta from './BuscadorCuenta';
const GestionAutor = () => {
  const [loading, setLoading] = useState(false);
  //conseguir la lista de autores
  const [autores, setAutores] = useState([])
  //conseguir la lista de autores
  //buscador de autores

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5001/autor/listado")
      .then((response) => response.json())
      .then((data) => {
        setAutores(data)
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Desactivar el indicador de carga después de obtener los datos
      });
  }, []);
  //buscador de autores
  const autoresFiltrados = autores.filter((autor) =>
    `${autor.nombre} ${autor.apellido} ${autor.usernombre}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //actualizar el estado de un autor
  const handleChange = (id, newActivo) => {
    setAutores((preAutor) =>
      preAutor.map((autor) => {
        if (autor._id === id) {
          return { ...autor, activo: newActivo };
        }
        return autor;
      })
    );
  }
  //activar o desactivar autor
  const handleSubmit = (e,autor) => {
    setLoading(true);
    e.preventDefault()
    fetch(`http://localhost:5001/admin/actualizarAutor/${autor._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({activo: autor.activo}),
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
  //eliminar autor
  const handleDelete = (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este autor?");
    if (!confirmar) return; // Si el usuario cancela, no hacer nada
    setLoading(true);
    fetch(`http://localhost:5001/admin/eliminarAutor/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Actualizar la lista de autores después de eliminar
        setAutores((prevAutores) => prevAutores.filter((autor) => autor._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      })
      .finally(() => {
        setLoading(false); // Desactivar el indicador de carga después de la eliminación
      });
  }
    
  if (loading) return <Cargando/>; // Indicador mientras carga

  return (
    <div className="contenedor-cards">
      {/* Buscador */}
      <BuscadorCuenta
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar autor..."
      />
      <div className='grid-layout'>
        {autoresFiltrados.map((autor) => (
        <form key={autor._id} onSubmit={(e)=>handleSubmit(e,autor)} className="card-usuario" >
          <h2>{autor.nombre} {autor.apellido}</h2>
          <p>usuario: {autor.usernombre}</p>
          <select name="activo" id="" 
          value={autor.activo}
          // 
          onChange={(e) => 
            handleChange(
              autor._id,
              e.target.value === "true"
            )
          }>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
          {/* actualizar cuenta */}
          <button type='submit'>Actualizar</button>
          {/* eliminar cuenta */}
          <button type='button' onClick={() => handleDelete(autor._id)} className='btn-eliminar'>Eliminar</button>
          {/* ocultar los libros de autores */}
          <Link to={`/paginaAdmin/autores/ocultar-libros/${autor._id}`}>
            <button type="button" className='btn-ocultar'>Ocultar libros</button>
          </Link>
          
        </form>
      ))}
      </div>
      
    </div>
  )
}

export default GestionAutor
