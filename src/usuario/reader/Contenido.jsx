import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../../style/contenido.css' // Asegúrate de tener un archivo CSS para estilos
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/all';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'
import { useLocation } from 'react-router-dom';
const Contenido = () => {
    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    // agregar favorito
    const { user } = useUser(); // usuario registrado
    const [favoritos, setFavoritos] = useState([]);

    const {id}=useParams()
    
    const [contenidos,setContenidos]=useState([])

    const location = useLocation();
    const { categoriaId, subcategoriaId } = location.state || {};
      //navegacion
    const navigate = useNavigate();
    //conseguir los contenidos de los libros
    useEffect(()=>{
        fetch(`http://localhost:5001/libros/libros/${id}`)
        .then(response=>response.json())
        .then(resulta=>{
            if (!Array.isArray(resulta)) {
            navigate("/not-found"); // estructura inesperada
            return;
          }
        setContenidos(resulta);
        })
        .catch(error => {navigate("/not-found")}); 
    },[id])

    useEffect(() => {
  if (user?._id) {
    fetch(`http://localhost:5001/favoritos/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.libros)) {
          const ids = data.libros.map((item) => item._id || item.libroID);
          setFavoritos(ids);
        }
      })
      .catch(err => console.error("Error al obtener favoritos:", err));
  }
}, [user]);

const handleAgregarFavorito = () => {
  if (!user || !user._id || user.tipo !== 'lector') {
    navigate("/login", { state: { from: `/Libros/${id}` } }); // 登录后返回原页
    return;
  }

  fetch(`http://localhost:5001/favoritos/${user._id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ libroID: id }),
  })
    .then(res => {
      if (res.ok) {
        setFavoritos(prev => [...prev, id]);
      }
    })
    .catch(err => console.error("Error al añadir favorito:", err));
};


    gsap.registerPlugin(ScrollTrigger);
    // animacion del contenido
    useGSAP(() => {
      ScrollTrigger.create({
        trigger: ".contenido-item", 
        markers: false,
        start: "0% 100%", 
        end: "0% 100%",
        animation: 
        gsap.timeline()
          .fromTo(".contenido-texto", {
            opacity: 0.3,
            fontWeight: "lighter",
          }, {
            opacity: 1,
            fontWeight: "bolder",
            ease: "circ",
            stagger: 0.001,
          }) 
      });
    },[contenidos]); // Dependencia para que se ejecute cuando cambie el contenido
      
    
    if (!contenidos || contenidos.length === 0) return <p>Cargando...</p>;

  return (
        <div className="contenido-container">
          <div
             onClick={() => {
                if (categoriaId && subcategoriaId) {
                  navigate(`/${categoriaId}/${subcategoriaId}`);
                } else {
                  navigate('/404'); // 
                }
              }}
            className="btn-volver"
          >
            < i className='bx  bx-chevron-left'  ></i> 
          </div>
      {contenidos.map((contenido, index) => (
        <div key={index} className="contenido-item">
          <h1 className="contenido-titulo">{contenido.titulo}</h1>

          {/* Mostrar contenido si es texto */}
          {typeof contenido.contenido === "string" && contenido.contenido.trim().length > 0 ? (
            <div className="contenido-texto">
              {contenido.contenido.split("").map((item, idx) => (
                <span key={idx} className="contenido-texto">{item}</span>
              ))}
            </div>
          ) : contenido.archivo ? (
            // Si no hay texto pero sí archivo, ofrecer descarga
            <div className="contenido-descarga">
              <p>Este libro está disponible como archivo:</p>
              <a
                href={`http://localhost:5001/uploads/${contenido.archivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-descarga"
              >
                Descargar archivo
              </a>
            </div>
          ) : (
            <p>No hay contenido disponible.</p>
          )}

        {/* agregar favorito */}
        {!user || user.tipo !== "lector" ? (
            <Link to="/login">
              <button className='btn-acceso-iniciar'>
                Iniciar sesión para añadir a favoritos
              </button>
            </Link>
          ) : favoritos.includes(id) ? (
            <i className='bx bxs-heart-circle'></i>
          ) : (
            <button onClick={handleAgregarFavorito} className="btn-add-favorito">
              Añadir a favoritos ❤️
            </button>
          )}

        </div>
      ))}
    
    </div>
  )
}

export default Contenido