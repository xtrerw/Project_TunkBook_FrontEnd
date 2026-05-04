import React from 'react'
import { useUser } from '../../context/UserContext';
import Cargando from '../../utils/Cargando'
import { useEffect, useState } from 'react';
import './MisFavoritos.css';
import NotFound from "../NotFound";
import { Link } from 'react-router-dom';
const MisFavoritos = () => {
    //conseguir usuario
    const {user}=useUser()
    const userId = user?._id; // ID del usuario actual
    if (!userId) return <p>No se ha encontrado el usuario.</p>; // Verificar si hay un usuario

    const [favoritos, setFavoritos] = useState([]); // Lista de libros favoritos
    const [loading, setLoading] = useState(true); // Indicador de carga

     // Función para obtener la lista de favoritos del usuario desde la API (versión con then/catch)
    const fetchFavoritos = () => {
        setLoading(true); // Activar estado de carga
        fetch(`http://localhost:5001/favoritos/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setFavoritos(data.libros || []); // Guardar los libros obtenidos
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error al obtener favoritos:', err);
                setLoading(false);
            });
    };

    // Función para eliminar un libro de la lista de favoritos del usuario
   // Función para eliminar un libro de la lista de favoritos del usuario (versión con then/catch)
    const eliminarFavorito = (libroID) => {
        // Realizar petición DELETE al servidor
        fetch(`http://localhost:5001/favoritos/${userId}/${libroID}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if (res.ok) {
                // Si se elimina correctamente, actualizar la lista local eliminando ese libro
                setFavoritos((prev) => prev.filter((item) => item._id !== libroID));
            } else {
                console.error('No se pudo eliminar el favorito');
            }
        })
        .catch((err) => {
            // Capturar errores de red u otros
            console.error('Error al eliminar favorito:', err);
        });
    };

    // Al cargar el componente o cambiar el ID de usuario, obtener favoritos
    useEffect(() => {
    if (userId) fetchFavoritos();
    }, [userId]);

    if (loading) return <Cargando/>; // Indicador mientras carga
    
    return (
    <div>
        <h2>Mis Libros Favoritos</h2>
        <div className={favoritos.length > 0 ? 'favoritos-lista' : 'no-favoritos'}>
        {
            favoritos.length==0? (
                <div>
                    <h2>No tienes libros favoritos</h2>
                    <i className='bx  bx-book-heart'  ></i> 
                </div>
            ):
        favoritos.map((item) => (
            item? (
            <div key={item._id}>
                <h4>{item.titulo}</h4>
                <Link to={`/Libros/${item._id}`}  >
                <img src={item.img} alt={item.titulo} width={100} />
                </Link>
                {/* <p>{item.precio} €</p> */}
                <button onClick={() => eliminarFavorito(item._id)}>Eliminar</button>
            </div>
            ) : (<NotFound/>)
        ))}
        </div>
    </div>
    );
}

export default MisFavoritos
