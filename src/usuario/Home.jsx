// Importaciones necesarias de React, Router y contexto de usuario
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState,useEffect,useLayoutEffect,useRef } from "react";
import { useUser } from "../context/UserContext";
// Importación gsap
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
// Importación estilos
import "./Home.css";
import "../style/responsive.css"
// Importación de componentes de páginas
import MainHomePage from "./Main";
import Login from "./Login";
import Contenido from "./perfil/Contenido";
import ContenidoAutor from "./autor/ContenidoAutor";
import Categoria from "./Categoria";
import tunkIcon from "../img/tunk-icon.jpg";
import EscribirOnline from "./autor/EscribirOnline";
import SubirLibro from "./autor/SubirLibro";
import MisLibros from "./autor/MisLibros";
import MisVentas from "./autor/MisVentas";
import HistorialCompras from "./autor/HistorialCompras";
import Perfil from "./perfil/Perfil";
import NotFound from "./NotFound";



// Componente principal
const User = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  // Estado de categorías
  const [categorias, setCategorias] = useState([]);
  // Obtener las categorías del backend
  useEffect(() => {
    fetch(`${apiUrl}/categories`)
      .then((response) => response.json())
      .then((categorias) => {
        setCategorias(categorias.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  // Obtener el usuario actual
  const {user}=useUser();
  //  categoría activa para mostrar el dropdown
  const [activeCategory, setActiveCategory] = useState(null);
  // Estado del menú responsive (abierto/cerrado)
  const [menuOpen, setMenuOpen] = useState(false);
  // Subcategoría activa para mostrar la imagen del dropdown
  const [activeSub, setActiveSub] = useState(null);
  // Obtener la ubicación actual para determinar si estamos en la página de login
  const location=useLocation();
  const isLoginPage = location.pathname === "/login";

  // Animación para abrir/cerrar el dropdown menu
  const dropdownRef = useRef(null);
  const textDropdownRefs = useRef([]);
  const imgDefaultDropdownRef = useRef(null);
  const imgDropdownRef = useRef(null);
  gsap.registerPlugin(ScrollTrigger)
  useGSAP(() => {
  gsap.timeline()
    .fromTo(
      dropdownRef.current,
      {
        opacity: 1,
        height: "0px",
      },
      {
        opacity: 1,
        height: "400px",
        duration: 0.5,
        ease: "expo.inOut",
      }
    )
    .fromTo(
      [
        textDropdownRefs.current.filter(Boolean),
        imgDropdownRef.current || imgDefaultDropdownRef.current,
      ],
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.inOut",
      },
      "<"
    );
}, { dependencies: [activeCategory] });

  return (
    <>
    {!isLoginPage? (
      <header>
        {/* icono de inicio */}
        <div className="tunk-icon-responsive">
          <Link to="/">
            <img src={tunkIcon} className="tunk-icon" />
          </Link> 
          {/* Botón de menú para móviles */}
          <i className="bx bx-menu" onClick={() => setMenuOpen(!menuOpen)}>
          </i>
        </div>

        {/* Menú principal, dependiendo del tipo de usuario */}
        <nav className={`menu ${menuOpen ? 'open' : ''}`} >
          {/* Items del menú: Categorías */}
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="menu-item"
              onClick={() => {
                setActiveCategory(activeCategory === categoria.id ? null : categoria.id)
                // Reiniciar subcategoría activa
                setActiveSub(null) 
              }}
            >
              {/* Nombre de categoría principal */}
              <div>{categoria.categoryName}</div>
            </div>
          ))}
          {/* Subcategorías desplegables */}
          {categorias.map((categoria) => 
              // Mostrar el dropdown solo para la categoría activa
              activeCategory === categoria.id && (
                <div className="dropdown" 
                key={categoria.id}
                ref={dropdownRef}
                >
                  <div className="dropdown-item" >
                    {categoria.subCategoriesList.map(subitem => (
                    <Link 
                    key={subitem.id} 
                    to={`/${categoria.categoryName}/${subitem.subcategoryName}`} 
                    ref={(el) => textDropdownRefs.current[subitem.id] = el}
                    onMouseEnter={() => setActiveSub(subitem.id)}
                    onClick={() =>{
                      setMenuOpen(false)
                      setActiveCategory(null) 
                    }}>
                      {subitem.subcategoryName}
                    </Link>
                  ))}
                  </div>
                  {/* Imagen decorativa del dropdown */}
                  {activeSub? (
                    <div className="dropdown-imagen"
                    ref={imgDropdownRef}
                      style={{ backgroundImage: `url(http://localhost:8080${categoria.subCategoriesList.find((s) => s.id === activeSub)?.subcategoryImg})` }}
                    ></div>
                  ) : (
                    <div className="dropdown-imagen" 
                    ref={imgDefaultDropdownRef}
                    style={{ backgroundImage: 'url("http://localhost:8080/uploads/img/subcate/default.png")' }}></div>
                  )}
                </div>
              )
          )}
        </nav>

        {/* Botón de login o saludo al usuario */}
        <div 
        // Al hacer hover en esta sección, se cierra cualquier dropdown abierto
        onMouseEnter={() => {
                setActiveCategory(null)
                // Reiniciar subcategoría activa
                setActiveSub(null)}}>
          <button className="btn-login btn-public">
              {user ? <Link to={'/Author/Modelo de Escribir/Subir Mi Libro Completo'}>Publicar Libros</Link> : <Link to="/login" >Publicar Libros</Link>}
          </button>
           <button className="btn-login">
              {user ? <Link to="/perfil">Bienvenido, {user.username}</Link> : <Link to="/login" >Iniciar Sesión</Link>}
          </button>
        </div>
       
      </header>):
      <Link to="/">
        <img src={tunkIcon} className="tunk-icon" />
      </Link>}

      <main className="main-content" style={{
          WebkitFilter: activeCategory ? 'blur(5px)' : 'none',
          filter: activeCategory ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease, -webkit-filter 0.3s ease',
      }}
      onClick={() => setActiveCategory(null)}
      >
        {/* Rutas de navegación */}
        <Routes>
          <Route path="/login" element={<Login />}/> 
          <Route path="/" element={<MainHomePage />} />
          <Route path="/perfil" element={<Perfil />} /> 
          <Route path="/Author/Mis Libros" element={<MisLibros />} />
          <Route path="/Author/Ventas/Mis Ventas" element={<MisVentas />} />
          <Route path="/Author/Ventas/Historial de Compras" element={<HistorialCompras />} />
          <Route path="/Author/Modelo de Escribir/Subir Mi Libro Completo" element={<SubirLibro />} />
          <Route path="/Author/Modelo de Escribir/Escribir Online" element={<EscribirOnline />} />
          <Route path="/Libros/:id" element={<Contenido />} />
          <Route path="/MisLibros/:id" element={<ContenidoAutor />} />
          <Route path="/:categoriaName/:subcategoriaName" element={<Categoria />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
      <div className="footer-categories">
        <div className="categories-grid">
          {categorias.map((categoria, index) => (
            <div key={index} className="category-column">
              <h4>{categoria.categoryName}</h4>
              {categoria.subCategoriesList.map((subitem, subIndex) => (
                <Link 
                key={subIndex} 
                to={`/${categoria.categoryName}/${subitem.subcategoryName}`} 
                className="category-link"
                >
                  {subitem.subcategoryName}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>COPYRIGHT © 2024 TunkBooks. Todos los derechos reservados.</p>

        <div className="footer-links">
          <Link to="/aviso-legal">Aviso Legal</Link> | 
          <Link to="/politica-privacidad">Política de Privacidad</Link> | 
          <Link to="/cookies">Cookies</Link>
        </div>

        <div className="footer-social">
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384065.png" alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384062.png" alt="LinkedIn" />
            </a>
            <a href="https://youtube.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="Youtube" />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default User;
