import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./Categoria.css"
import '../../style/libro.css' // Asegúrate de tener un archivo CSS para estilos
import '../../style/responsive.css'
import NotFound from '../NotFound'
import Cargando from '../../utils/Cargando'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ChevronUp, ChevronDown, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
const Categoria = () => {
  
  //conseguir las categorias de libros
  const { categoriaName, subcategoriaName } = useParams();
  console.log(categoriaName, subcategoriaName)
  //set categoria
  const [categoria, setCategorias] =useState(null)
  //set libros
  const [libros,setLibros] = useState(null)
  //sidebar de libros
  const [showRating, setShowRating] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  // conseguir usuario
  const {user}=useUser();
  //buscador
  const [searchTerm, setSearchTerm] = useState("");
  //fitro por estrellas
  const [selectedRatings, setSelectedRatings] = useState([]);
  // Estado: guardar las etiquetas seleccionadas de precios
  const [selectedPrices, setSelectedPrices] = useState([]);
  //navegacion
  const navigate = useNavigate();
  //favorito libros agregados
  const [favoritos, setFavoritos] = useState([]);
  //si usuario no iniciar
  const [faltaUser,setFaltaUser]=useState(false)

  // Lista de rangos de precio
  const priceRanges = [
    { label: '0€ - 8€', min: 0, max: 8 },
    { label: '8€ - 14€', min: 8, max: 14 },
    { label: '14€ - 19€', min: 14, max: 19 },
    { label: '19€ - 25€', min: 19, max: 25 },
    { label: '25€ - 50€', min: 25, max: 50 },
  ];

  // formato de los libros
  const [librosConFormato, setLibrosConFormato] = useState({});
  //filtro formato
  const [formatoSeleccionado, setFormatoSeleccionado] = useState([]); // "pdf", "no-pdf"

const [showFormato, setShowFormato] = useState(true);
    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [categoriaName, subcategoriaName]);

  //conseguir las categorias desde mango db
  useEffect(()=>{
    fetch(`http://localhost:8080/categories/${categoriaName}/${subcategoriaName}`)
    .then(response=>response.json())
    .then(resulta=>{
      if (!resulta.data || resulta.data.length === 0) {
        navigate("/404"); // Redirigir si no hay categoría válida
      } else {
        setLibros(resulta.data);
  }
    })
    .catch(error => {
      navigate("/NotFound");
    });
  },[categoriaName])

  // Reiniciar filtros al cambiar subcategoría
  useEffect(() => {
    setSearchTerm("");
    setSelectedRatings([]);
    setSelectedPrices([]);
  }, [subcategoriaName]);

  //conseguir los formatos
  useEffect(() => {
    if (!libros) return; // 

    libros.forEach(libro => {
      fetch(`http://localhost:5001/libros/libros/${libro._id}`)
        .then(res => res.json())
        .then(data => {
          const tienePDF = Array.isArray(data) && data.some(c => c.archivo);
          setLibrosConFormato(prev => ({ ...prev, [libro._id]: tienePDF }));
        });
    });
  }, [libros]);



  //funcion para agregar libros a favoritos
  const handleAgregarFavorito = (libro) => {
    if (!user || !user._id) {
      return setFaltaUser(true)
    }
    fetch(`http://localhost:5001/favoritos/${user._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        libroID: libro._id
      })
    })
    .then((res) => {
     if (res.ok) {
        setFavoritos((prev) => [...prev, libro._id]); // Añadir localmente
      }
    })
    .catch((err) => {
      console.error("Error al añadir favorito:", err);
    });
};
//conseguir los favoritos
useEffect(() => {
  if (user?._id) {
    fetch(`http://localhost:5001/favoritos/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.libros)) {
          const ids = data.data.map((item) => item._id || item.libroID); // asegúrate del formato
          setFavoritos(ids);
        }
      })
      .catch((err) => console.error("Error al obtener favoritos:", err));
  }
}, [user]);

//

//referencia de titulo y libros  
const tituloRef = useRef();
const librosRef = useRef();
const libroRefs=useRef([])
//registro de ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
//titulo
useGSAP(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  if (!tituloRef.current || !librosRef.current || !libroRefs.current.length) return;

  //titulos
  ScrollTrigger.create({
    trigger: tituloRef.current,
    animation: gsap.timeline()
      .fromTo(tituloRef.current,{
        backgroundImage:"linear-gradient(to right bottom,#0f0c29, #302b63)"
      },{
        backgroundImage:"linear-gradient(to right bottom,#0f0c2900, #302b6300)",
        duration: 1, 
        ease: "sine.inOut"
      },"<")
      .fromTo(tituloRef.current.querySelector("h1"), {
        x: -100, opacity: 0
      }, {
        x: 0, opacity: 1, duration: 1, ease: "power1.inOut"
      })
      .fromTo(tituloRef.current.querySelector("p"), {
        y: 100, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 1, ease: "power1.inOut"
      },"<")
      .fromTo(tituloRef.current.querySelector("hr"),{
        width:"0%",opacity:0
      },{
        width:"80%",opacity:1, duration: 1, ease: "power1.inOut"
      },"<")
  });
  //libros
  ScrollTrigger.create({
    trigger:tituloRef.current,
    markers:false,
    scrub:2,
    start:"0% top",
    end:"60% top",
    animation:gsap.timeline()
    .fromTo(librosRef.current,{
      scale:0.8,
      borderRadius:"30px"
    },{
      scale:1,
      borderRadius:"0"
    })
    .fromTo(librosRef.current.querySelector("aside"),{
      y:30
    },{
      y:0,
    },"<")
    .fromTo(libroRefs.current.filter(Boolean),{
      y:300,
      opacity:0
    },{
      y:0,
      opacity:1,
      stagger:0.2
    },"<")
  })
}, { dependencies: [libros, subcategoriaName]});


  //registro de usuario
  if (!libros) return <Cargando />;

  return (
    <>
    <div style={{
      display:"flex",
      justifyContent:"center"
    }} className='categoria-libros' ref={librosRef}>
      {/* fitro de libros */}
     <aside>
          {/* Buscador */}
          <div className='filtro-buscador'>
            <h3>Buscador</h3>
            <div className='filtro-buscador-contenedor'>
              <input type="text" 
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value.toLowerCase())}
              />
              <i className="bx bx-search-alt" id='icon-buscador'/>
            </div>
          </div>
          {/* Puntuación */}
          <div className="filtro-bloque">
            <div className="filtro-header" onClick={() => setShowRating(!showRating)}>
              <h3>Puntuación</h3>
              {showRating ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {showRating && (
              <ul>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <li key={stars}>
                    <input type="checkbox" id={`rating-${stars}`} 
                    //fitro libros segun los estrellas elegido
                    checked={selectedRatings.includes(stars)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedRatings(prev =>
                        isChecked ? [...prev, stars] : prev.filter(r => r !== stars)
                      );
                    }}
                    />
                    <label htmlFor={`rating-${stars}`}>
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} size={15} style={{ color: '#facc15', marginRight: '2px' }} />
                      ))}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>


{/* Formato */}
<div className="filtro-bloque">
  <div className="filtro-header" onClick={() => setShowFormato(!showFormato)}>
    <h3>Formato</h3>
    {showFormato ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </div>

  {showFormato && (
    <ul>
      <li>
        <input
          type="checkbox"
          id="formato-pdf"
          checked={formatoSeleccionado.includes("pdf")}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setFormatoSeleccionado(prev =>
              isChecked ? [...prev, "pdf"] : prev.filter(f => f !== "pdf")
            );
          }}
        />
        <label htmlFor="formato-pdf">PDF</label>
      </li>
      <li>
        <input
          type="checkbox"
          id="formato-no-pdf"
          checked={formatoSeleccionado.includes("no-pdf")}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setFormatoSeleccionado(prev =>
              isChecked ? [...prev, "no-pdf"] : prev.filter(f => f !== "no-pdf")
            );
          }}
        />
        <label htmlFor="formato-no-pdf">Leer en linea</label>
      </li>
    </ul>
  )}
</div>



          {/* Precio */}
          {/* <div className="filtro-bloque">
            <div className="filtro-header" onClick={() => setShowPrice(!showPrice)}>
              <h3>Precio</h3>
              {showPrice ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {showPrice && (
              <ul>
                {priceRanges.map((range, i) => (
                  <li key={i}>
                    <input
                      type="checkbox"
                      id={`price-${i}`}
                      checked={selectedPrices.includes(range.label)} // Ver si está seleccionado
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        // Agregar o quitar el rango seleccionado
                        setSelectedPrices((prev) =>
                          isChecked
                            ? [...prev, range.label]
                            : prev.filter((label) => label !== range.label)
                        );
                      }}
                    />
                    <label htmlFor={`price-${i}`}>{range.label}</label>
                  </li>
                ))}
                
              </ul>
            )}
          </div> */}
      </aside>

      {/* libros */}
      <div>
        {
        libros.length===0?(
          <NotFound message="No hay libros disponibles en esta categoría." />
        ):
        (libros
        //filtrar todos los libros que cumple con las condiciones
         .filter(libro =>
            {
              const tienePDF = librosConFormato[libro.id] === true;

              const coincideFormato =
                formatoSeleccionado.length === 0 || // se muestra todos sin selecciona
                (tienePDF && formatoSeleccionado.includes("pdf")) ||
                (!tienePDF && formatoSeleccionado.includes("no-pdf"));
                //verificar las categorias y subcategorias de libros si esta coincide a las categorias y subcategorias de url
              const coincideSubcategoria = libro.subCategoriesList?.some(subcategory => subcategory.subcategoryName === subcategoriaName);
              if (!coincideSubcategoria) return false; // Si no coincide la categoría o subcategoría, no lo mostramos
              //verificar los texto insertados si esta coincide al nombre de libros,"" es para evitar fallback de undefine
              const coincideBusqueda = 
              libro.bookName.toLowerCase().includes(searchTerm) || 
              libro.writersList?.some(writer =>
                writer?.user?.username?.toLowerCase().includes(searchTerm)
              )
              //verificar las estrellas de fitro si está coincide a la cantidad de estrellas de libros
              const coincideRating =
                selectedRatings.length === 0 || selectedRatings.some(rating => libro.estrella >= rating && libro.estrella < rating+1);
              //verificar los precios si está coincide a los precios de libros
              const coincidePrecio = selectedPrices.length === 0 ||
              priceRanges.some((range) =>
                selectedPrices.includes(range.label) &&
                libro.precio >= range.min &&
                libro.precio <= range.max 
              );
               
              //verificar si esta libro oculto
              const libroOculto = libro.oculto
              // Devolver el libro si coincide con todos los filtros y no está oculto 
              if (libroOculto) return false; // Si el libro está oculto, no lo mostramos

              return coincideBusqueda && coincideRating && coincidePrecio&&coincideFormato;
            }
          )
        .map((libro, index) => (
            <div key={index} ref={el => libroRefs.current[index] = el} className='categoria-libro'>
              <Link to={`/Libros/${libro.id}`} state={{categoriaName, subcategoriaName}} className='libro-item'>
              {librosConFormato[libro.id] && (
                <div className="etiqueta-pdf">PDF</div>
              )}

                <img src={`http://localhost:8080${libro.cover}`} alt={libro.titulo} />
                {/* mostrar título */}
                <h2>{libro.bookName}</h2>
                {/* mostrar autores */}
                {libro.writersList?.map((writer) => (
                  <div key={writer.user?.id}>
                    <h3>{writer.user?.username}</h3>
                  </div>
                ))}
                {/* mostrar estrellas */}
                <p>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={i < libro.stars ? "bx bxs-star" : "bx bx-star"}
                      style={{ color: "#facc15" }}
                    />
                  ))}
                </p>
                
                {/* <p>{libro.precio} €</p> */}
              </Link>
              <div className='categoria-libro-cantidad'>
              {user && user.tipo === "lector" ? (
                <div
                  className={`bx bx-heart-circle ${favoritos.includes(libro._id) ? "favorito-activo" : ""}`}
                  onClick={() => handleAgregarFavorito(libro)}
                ></div>
              ) : null}

                
              </div>
              <p className={`${faltaUser? "error":"sinError"}`}>Debes iniciar sesión para añadir favoritos</p>
            </div>)))}
      </div>
    </div> 
      
      
    </>
  )
}

export default Categoria