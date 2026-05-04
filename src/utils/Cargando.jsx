import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import './Cargando.css';
import "../style/responsive.css"

const Cargando = () => {

  const titulo= 'Cargando';

  gsap.registerPlugin(ScrollTrigger);
  // Animación de las letras del título "Cargando"
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ".cargando-container",
      start: "top center",
      end: "top center",
      markers: true,
      animation: gsap.timeline()
        .fromTo(".cargando-letra", {
          scaleX: 0.5,
          opacity: 0,
          fontWeight: "lighter",
        }, {
          scaleX: 1,
          opacity: 1,
          color: "var(--text-color)",
          fontWeight: "bolder",
          ease: "back.inOut",
          stagger: 0.1,
          duration: 0.3,
          repeat: -1,
          yoyo: true
        })
    });
  }, []);

  return (
    <div className="cargando-container">
     {titulo.split('').map((char, index) => (
        <span key={index} className="cargando-letra">
          {char}
        </span>
      ))}
    </div>
  );
};

export default Cargando;
