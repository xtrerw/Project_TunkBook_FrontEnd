import React, { useEffect, useState } from 'react';
import './GestionCategoria.css'; 
import { validateCategoria } from '../utils/validateCategoria';//introduce archivo para validar
import { useFormValidation } from '../utils/useFormValidation';
import Cargando from '../utils/Cargando';
const GestionCategoria = () => {
  
  const [loading, setLoading] = useState(false);
  //reiniciar funciones de validar
  const { errores, mensajeError, validar } = useFormValidation(validateCategoria);
 
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [colleccion, setColleccion] = useState('');
  // crear y actualizar
  const [editId, setEditId] = useState(null);
  const irACrear = () => {
  setEditId(null);
  setNombre('');
  setColleccion('');
};

//hasta top en caso clic
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, [editId]);

  // Obtener las categorías al cargar
  useEffect(() => {
    setLoading(true);
    fetchCategorias();
  }, []);

  // Función para obtener todas las categorías
  const fetchCategorias = () => {
    setLoading(true);
    fetch("http://localhost:5001/adminCategoria/categoria")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  // Crear o actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { nombre, colleccion };
    const hayError = validar(formData);
    if (hayError) return;
    
    const data = {
      nombre,
      colleccion: colleccion.split(',').map(c => c.trim()) // Dividir por comas
    };

    const url = editId
      ? `http://localhost:5001/adminCategoria/categoria/${editId}`
      : "http://localhost:5001/adminCategoria/categoria";

    const method = editId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Limpiar formulario
    setNombre('');
    setColleccion('');
    setEditId(null);
    fetchCategorias(); // Actualizar lista
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta categoria?");
    if (!confirmar) return; // Si el usuario cancela, no hacer nada
    setLoading(true);
     try {
      const res = await fetch(`http://localhost:5001/adminCategoria/categoria/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar la categoría.");
      }

      fetchCategorias(); // actualizar la lista
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos para editar
  const handleEdit = (cat) => {
    setNombre(cat.nombre);
    setColleccion(cat.colleccion.join(', '));
    setEditId(cat._id);
  };

  if(loading) return <Cargando/>
  
  return (
    <div className="gestion-categoria-container">
      <h2>Gestión de Categorías</h2>

      {/* Formulario para agregar o editar */}
      <form className="gestion-form" onSubmit={handleSubmit}>
        {/* devolver a crear */}
        < i className='bx  bx-chevron-left' 
        onClick={irACrear}
        style={{
          visibility:editId? "visible":"hidden"
        }}
        ></i> 
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
          className={errores.nombre ? 'input-error' : ''}
          required
        />
        {errores.nombre && <p className="error-msg">{mensajeError}</p>}

        <input
          value={colleccion}
          onChange={(e) => setColleccion(e.target.value)}
          placeholder="Subcategorías (separadas por coma)"
          className={errores.colleccion ? 'input-error' : ''}
          required
        />
        {errores.colleccion && <p className="error-msg">{mensajeError}</p>}

        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>

      {/* Lista de categorías */}
      <ul className="categoria-lista">
        {categorias.map(cat => (
          <li className="gestion-categoria-item" key={cat._id}>
            <span>{cat.nombre}</span>
            <div>
              <button onClick={() => handleEdit(cat)}>Editar</button>
              <button onClick={() => handleDelete(cat._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionCategoria;
