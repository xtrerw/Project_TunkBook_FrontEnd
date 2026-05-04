import { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import "./Reader.css"
import "../../style/libro.css"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
function Reader() {
  //hasta top en caso clic
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);
    
  const [libros, setLibros] = useState([]);

  useEffect(() => {
   fetch('http://localhost:5001/libros/libros')
    .then(response=>response.json())
    .then(libro=>{
      setLibros(libro)
    })
  }, []);

    // animacion del titulo de parte titulo
    gsap.registerPlugin(ScrollTrigger)
    useGSAP(()=>{
      ScrollTrigger.create({
        trigger: "header",
        animation:
        gsap.timeline().fromTo(".titulo",{
          opacity:0,
          y:10,
          x:10,
        },{
          opacity:1,
          duration: 1,
          ease: "expo.inOut",
          y:0,
          x:0,
        }, "<")
        .fromTo(".titulo2",{
          opacity:0,
          y:10,
        },{
          opacity:1,
          duration: 1,
          ease: "expo.inOut",
          y:0,
        },"<")
        .fromTo(".btn-comenzar",{
          opacity:0,
          y:10,
        },{
          opacity:1,
          duration: 1,
          ease: "expo.inOut",
          y:0,
        },"<")
        .fromTo(".link-login",{
          opacity:0,
          y:10,
        },{
          opacity:1,
          duration: 1,
          ease: "expo.inOut",
          y:0,
        },"<")
      })
    })
  // animacion del titulo de parte TOP VENTAS
  useGSAP(()=>{
    ScrollTrigger.create({
      trigger: ".parte-top-ventas",
      markers:false,
      start:"0 60%",
      end:"100% 100%",
      toggleActions:"play none none reverse",
      scrub:false,
      animation:
      gsap.timeline().fromTo(".titulo-top-ventas",{
        opacity:0,
        y:30,
      },{
        
        opacity:1,
        duration: 2,
        ease: "expo.inOut",
        y:0,
      },"<")
    })
  })

  // carousel
const desplazamientoTxt=useRef()
const carouselRef = useRef(); 
// Animación de desplazamiento del texto
const titulosTexto = "Nuestros libros · Historias que conectan · Para lectores y escritores · Historias sin fronteras · Donde nacen las ideas · ";
const titulos=Array(20).fill(titulosTexto)//repetir el texto 5 veces
useGSAP(() => {
  if (!desplazamientoTxt.current) return;

  gsap.fromTo(
    desplazamientoTxt.current,
    { x: 0 },
    {
      x: "-50%",
      duration: 100,
      ease: "linear",
      repeat: -1
    }
  );
}, []);

  return (
    <div>
      <div className='parte-titulo'>
        <div className='parte-primero'>
          <h1 className='titulo dancing-script'>No dejes que tus historias se pierdan en el silencio</h1>
          <h2 className='titulo2'>Lee, escribe y conecta con personas que aman las historias como tú</h2>
          <button className='btn-comenzar'>Explorar historias</button>
          <Link to="/login" className='link-login'>
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
      <div className='parte-segunda'>
        <div className="desplazamiento-wrapper">
          <div className="desplazamiento-texto" ref={desplazamientoTxt}>
            {titulos.map((titulo, index) => (
              <span key={index} className="titulo-desplazamiento">{titulo}</span>
            ))}
          </div>
        </div>

        {/* titulo */}
        <div className='parte-segundo-titulos'>
          {/* {[...titulo2].map((letra, index) => (
            <span key={index} className='parte-segundo-titulo'>{letra}</span>
          ))} */}
          {/* <span className='parte-segundo-titulo'>Convierte tu historia en el próximo gran libro.</span> */}
        </div>
        
        {/* libros */}
        <div className="carousel-container">
          <div className="carousel-track" ref={carouselRef}>
            {libros.map((libro, index) => (
             <div key={index} className="carousel-slide">
                <Link to={`/Libros/${libro._id}`} className="libro-item">
                  <img src={libro.img} alt={libro.titulo} />
                  <h2>{libro.titulo}</h2>
                  <h3>{libro.autorID?.nombre} {libro.autorID?.apellido}</h3>
                  {/* <p>{libro.precio} €</p> */}
                </Link>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reader; 