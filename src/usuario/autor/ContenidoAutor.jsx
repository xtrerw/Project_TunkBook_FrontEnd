import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../../style/contenido.css' // Asegúrate de tener un archivo CSS para estilos
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from 'gsap/all';
import { useNavigate } from 'react-router-dom';
const ContenidoAutor = () => {
    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const {id}=useParams()
    
    const [contenidos,setContenidos]=useState([])
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
            onClick={() => navigate('/Author/Mis Libros')}
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
        </div>
      ))}
    </div>
  )
}

export default ContenidoAutor