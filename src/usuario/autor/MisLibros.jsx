import React, { useState, useEffect } from 'react';
import Author from './Login';
// import './MisLibros.css'; // Asegúrate de tener un archivo CSS para estilos
import '../../style/libro.css'; // Asegúrate de tener un archivo CSS para estilos
import { Link } from 'react-router-dom';
import EditarLibros from './EditarLibros';
import './MisLibros.css'; // Asegúrate de tener un archivo CSS para estilos
const MisLibros = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  // libros
  const [libros, setLibros] = useState(null);
  //editar libros
  const [editLibroId, setEditLibroId] = useState(null);

  //hasta top en caso clic
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // comprobar si el usuario está autenticado
    const id = localStorage.getItem("userId");

    if (id) {
      setIsLoggedIn(true);
      setUserId(id);
      cargarLibros(id);
    }

    if(id){
      // Fetch libros del autor desde el backend
      fetch(`http://localhost:5001/misLibros/${id}`)
        .then(response => response.json())
        .then(data => {
          setLibros(data);
          console.log(data);
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

  }, []);

  //recargar libros
  const cargarLibros = (id) => {
  fetch(`http://localhost:5001/misLibros/${id}`)
    .then(res => res.json())
    .then(setLibros)
    .catch(console.error);
};
  //borrar los libros
  const handleEliminar = async (libroId) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este libro?");
    if (!confirm) return;

    await fetch(`http://localhost:5001/misLibros/libro/${libroId}`, {
      method: 'DELETE',
    });

    // Recargar libros
    cargarLibros(userId);
  };



  return (
    <>
      {isLoggedIn ? 
        editLibroId ? (
          <EditarLibros
            libroId={editLibroId}
            onCancel={() => setEditLibroId(null)}
            onSuccess={() => {
              setEditLibroId(null);
              cargarLibros(userId); // actualizar lista
            }}
          />
        ):
        (<div className="mis-libros-container">
          {/* Aquí puedes mostrar los libros del autor */}
          {libros && libros.length > 0 ? (
            libros.map((libro, index) => (
            <div className="libro-item" key={index}>
              <Link 
              className={libro.oculto ? "libro-oculto" : ""}
              to={`/MisLibros/${libro._id}`}>
                <img src={libro.img} alt={libro.titulo} />
                <h2>{libro.titulo}</h2>
                {/* <p>{libro.precio} €</p> */}
              </Link>
              <div className="libro-controles">
                <button onClick={() => handleEliminar(libro._id)} className={libro.oculto? 'btn-disabled':'btn-eliminar'}>Eliminar</button>
                <button onClick={() => setEditLibroId(libro._id)} className={libro.oculto? 'btn-disabled':'btn-editar'}>Editar</button>
              </div>
              {libro.motivo && (
                <h4 className="motivo-ocultacion">Motivo de ocultación: {libro.motivo}</h4>
              )}
            </div>

            ))
          ) : (
            <p>No tienes libros disponibles.</p>
          )}
        </div>
      ) : (
        <Author />
      )}
    </>
  );
}

export default MisLibros;

