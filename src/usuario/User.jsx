import { Routes, Route, Link, useLocation } from "react-router-dom";
import Reader from "./reader/Reader";
import Login from "./autor/Login";
import Contenido from "./reader/Contenido";
import ContenidoAutor from "./autor/ContenidoAutor";
import { useState,useEffect } from "react";
import "./User.css";
import "../style/responsive.css"
import Categoria from "./reader/Categoria";
import tunkIcon from "../img/tunk-icon.jpg";
import EscribirOnline from "./autor/EscribirOnline";
import SubirLibro from "./autor/SubirLibro";
import MisLibros from "./autor/MisLibros";
import MisDatos from "./autor/MisDatos";
import MisVentas from "./autor/MisVentas";
import HistorialCompras from "./autor/HistorialCompras";
import PerfilReader from "./reader/PerfilReader";
import NotFound from "./NotFound";
import { useUser } from "../context/UserContext";



// Componente principal
const User = () => {
  // Estado de categorías
  const [categorias, setCategorias] = useState([]);
  // Obtener las categorías del backend
  useEffect(() => {
    fetch("http://localhost:8080/categories")
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
  // controlar la visibilidad del menú (ocultar en login)
  const [menuVisible, setMenuVisible] = useState(true);
  // Obtener la ubicación actual para determinar si estamos en la página de login
  const location=useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
    {menuVisible? (
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
              onMouseEnter={() => {
                setActiveCategory(categoria.id)
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
                <div className="dropdown" key={categoria.id} 
                onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="dropdown-item">
                    {categoria.subCategoriesList.map(subitem => (
                    <Link key={subitem.id} 
                    to={`/${categoria.categoryName}/${subitem.subcategoryName}`} 
                    onMouseEnter={() => setActiveSub(subitem.id)}
                    onClick={() => setMenuOpen(false)}>
                      {subitem.subcategoryName}
                    </Link>
                  ))}
                  </div>
                  {/* Imagen decorativa del dropdown */}
                  {activeSub? (
                    <div className="dropdown-imagen"
                      style={{ backgroundImage: `url(http://localhost:8080${categoria.subCategoriesList.find((s) => s.id === activeSub)?.subcategoryImg})` }}
                    ></div>
                  ) : (
                    <div className="dropdown-imagen" style={{ backgroundImage: 'url("http://localhost:8080/uploads/img/default.png")' }}></div>
                  )}
                </div>
              )
          )}
        </nav>

        {/* Botón de login o saludo al usuario */}
        <div onClick={() => setMenuVisible(false)}>
          <button className="dancing-script btn-login">
              {user ? <Link to={'/Author/Modelo de Escribir/Subir Mi Libro Completo'}>Publicar Libros</Link> : <Link to="/login" >Publicar Libros</Link>}
          </button>
           <button className="dancing-script btn-login">
              {user ? <Link to="/Perfil de lector">Bienvenido, {user.username}</Link> : <Link to="/login" >Iniciar Sesión</Link>}
          </button>
        </div>
       
      </header>):
      <Link to="/" onClick={() => setMenuVisible(true)}>
        <img src={tunkIcon} className="tunk-icon" />
      </Link>}

      <main className="main-content" style={{
          WebkitFilter: activeCategory ? 'blur(5px)' : 'none',
          filter: activeCategory ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease, -webkit-filter 0.3s ease',
      }}>
        {/* Rutas de navegación */}
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/" element={<Reader />} />
          <Route path="/Author/Mis Datos/*" element={<MisDatos />} />
          <Route path="/Author/Mis Libros" element={<MisLibros />} />
          <Route path="/Author/Ventas/Mis Ventas" element={<MisVentas />} />
          <Route path="/Author/Ventas/Historial de Compras" element={<HistorialCompras />} />
          <Route path="/Author/Modelo de Escribir/Subir Mi Libro Completo" element={<SubirLibro />} />
          <Route path="/Author/Modelo de Escribir/Escribir Online" element={<EscribirOnline />} />
          <Route path="/Libros/:id" element={<Contenido />} />
          <Route path="/MisLibros/:id" element={<ContenidoAutor />} />
          <Route path="/:categoriaId/:subcategoriaId" element={<Categoria />} />
          <Route path="/Perfil de lector" element={<PerfilReader />} /> 
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
