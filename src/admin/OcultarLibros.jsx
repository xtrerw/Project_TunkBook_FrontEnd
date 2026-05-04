import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Cargando from '../utils/Cargando';
import './OcultarLibros.css'; // Asegúrate de tener un archivo CSS para los estilos
const OcultarLibros = () => {
    //conseguir id de autor
    const {id}= useParams();
    //conseguir los libros de un autor
    const [libros, setLibros] = useState([]);
    //cargando
    const [loading, setLoading] = useState(true);
    //Buscador de libros
    const [searchTerm, setSearchTerm] = useState("");


    // Realizar la petición a la API para obtener los libros del autor
    const fetchLibros = () => {
        setLoading(true);
        fetch(`http://localhost:5001/ocultarLibros/ocultarLibros/${id}`)
            .then(response => response.json())
            .then(data => {
                setLibros(data);
                // Desactivar el indicador de carga después de obtener los datos
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener los libros:", error);
            });
        }
    //conseguir los libros de un autor
    useEffect(() => {
       fetchLibros(); // Llamar a la función para obtener los libros
    }, [id]);
    //Ocultar libros
    // Función para ocultar o mostrar un libro
    const toggleOcultarLibro = (libroID, ocultar) => {
    let motivo = ""; // Variable para almacenar el motivo de ocultación
    if (ocultar) {
        // Preguntar por el motivo si se va a ocultar
        motivo = prompt("¿Por qué desea ocultar este libro?");
        if (!motivo) return; // Cancelado o vacío
    }
    // Hacer la solicitud al servidor para cambiar el estado de 'oculto'
    fetch(`http://localhost:5001/ocultarLibros/ocultar/${libroID}`, {
        method: "PUT", // Método HTTP PUT para actualizar
        headers: {
        "Content-Type": "application/json", // Indicamos que el cuerpo es JSON
        },
        body: JSON.stringify({ oculto: ocultar,motivo }), // Enviamos el nuevo estado: true o false
    })
        .then((res) => {
        // Verificar si la respuesta es exitosa
        if (!res.ok) {
            throw new Error("Error al actualizar el estado del libro.");
        }
        return res.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
        fetchLibros(); // Volver a cargar la lista de libros
        })
        .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un problema al actualizar el estado del libro.");
        });
    };
    // Si está cargando, mostrar un mensaje de carga
    if (loading) return <Cargando />;

  return (
    <div className='ocultar-libros-container'>
        <h1>Ocultar Libros</h1>
        {/* buscador */}
        <div className='buscador-ocultar'>
            <input type="text" 
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value.toLowerCase())}
            placeholder='Buscar por título'
            className="buscador-ocultar-input"
            />
            <i className="bx bx-search" id='icon-buscador'/>
        </div>
        {/* libros */}
         {libros.length > 0 ? (
        <div className="mis-libros-container">
          {libros
          .filter(libro =>
          {
            // Filtrar los libros que coinciden con el término de búsqueda
            const coincideBusqueda = libro.titulo.toLowerCase().includes(searchTerm) || ""

            //devolver el libro si coincide con el término de búsqueda
            //o si el autor coincide con el término de búsqueda
            return coincideBusqueda;
          })
          .map(libro => (
            <div className={libro.oculto? "libro-item libro-oculto" :"libro-item"} key={libro._id}>
                <img src={libro.img || "https://via.placeholder.com/300x300"} alt={libro.titulo} />
                <h2>{libro.titulo}</h2>
                <h3>Autor: {libro.autorID ? `${libro.autorID.nombre} ${libro.autorID.apellido}` : "Desconocido"}</h3>
                {/* <p>{libro.precio} €</p> */}
                {libro.oculto?
                    (<button type='button' onClick={()=>toggleOcultarLibro(libro._id, false)} className='mostrar'>Muestrar libro</button>):
                    (<button type='button' onClick={()=>toggleOcultarLibro(libro._id, true)} className='ocultar'>Ocultar libro</button>)}
                {/* motivo de ocultación */}
                {libro.oculto && <h4 className='motivo-ocultacion'>Motivo de ocultación: {libro.motivo}</h4>}
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron libros para este autor.</p>
      )}
    </div>
  )
}

export default OcultarLibros
