import { useState } from 'react'
import mammoth from 'mammoth';
import './SubirLibro.css'
import { useEffect } from 'react';
import subirImgDefault from '../../img/subir-img-default.png'
import { useNavigate } from 'react-router-dom';
import Author from './Login';
const SubirLibro = () => {
    //useNavigate para redirigir al usuario
    const navigate = useNavigate();
    //conseguir el id del autor
    const id = localStorage.getItem("userId");
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState(0); // precio inicial
    const [img, setImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

      //hasta top en caso clic
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);
    //conseguir el precio
    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setPrice(value);
        }
    };
    //conseguir la vista previa de la imagen
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
     // Función para manejar la carga de archivos
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();

      // Si es archivo .docx, extraer texto
      if (extension === "docx") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          setContent(result.value);
        } catch (error) {
          console.error("Error al leer el archivo Word:", error);
          alert("No se pudo leer el archivo Word. ¿Está dañado?");
        }
      } else {
        // Otros formatos no se procesan aquí
        setContent("");
      }
    }
  };
 // Función para publicar el libro
  const handlePublish = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!title || !price || !categoriaSeleccionada || !coleccionSeleccionada) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    const fileInput = document.getElementById("archivo");
    const file = fileInput.files[0];

    if (!file) {
      alert("Por favor selecciona un archivo del libro.");
      return;
    }

    // Crear el FormData para envío multipart
    const formData = new FormData();

    formData.append("file", file); // Archivo principal

    // Si hay imagen, convertir a base64
    if (img) {
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
      const base64Img = await toBase64(img);
      formData.append("img", base64Img);
    } else {
      formData.append("img", ""); // Dejar vacío si no hay imagen
    }

    // Agregar campos de texto
    formData.append("title", title);
    formData.append("id", id);
    formData.append("price", price);
    formData.append("categoriaSeleccionada", categoriaSeleccionada);
    formData.append("coleccionSeleccionada", coleccionSeleccionada);
    formData.append("content", content); // contenido extraído si es docx

    try {
      const response = await fetch("http://localhost:5001/autor/publish", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/Author/Mis Libros");
        console.log("Libro subido correctamente:", data);
      } else {
        alert("Error al subir libro: " + data.message);
      }
    } catch (error) {
      console.error("Error al publicar el libro:", error);
    }
  };
    
    //conseguir categorias
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
            const response = await fetch('http://localhost:5001/autor/categorias');
            // Obtener datos del servidor
            const data = await response.json();

            // Buscar la categoría llamada "Imprescindibles" (en plural, como aparece en la UI)
            const impCategoria = data.find(c => c.nombre.toLowerCase() === "imprescindibles");

            // Filtrar las categorías, excluyendo "Imprescindibles"
            const categoriasFiltradas = data.filter(c => c.nombre.toLowerCase() !== "imprescindibles");

            // Guardar las categorías filtradas en el estado
            setCategorias(Array.isArray(categoriasFiltradas) ? categoriasFiltradas : []);

            // Si la categoría seleccionada es "Imprescindibles", reiniciar la selección
            if (impCategoria && categoriaSeleccionada === impCategoria._id) {
              setCategoriaSeleccionada("");
            }

            } catch (error) {
            console.error('Error fetching categories:', error);
            }
        };
        fetchCategorias();
    }, []);

    //conseguir colecciones seleccionadas
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [coleccionSeleccionada, setColeccionSeleccionada] = useState("");
    //conseguir las colecciones según la categoria seleccionada
    const categoriaObj = Array.isArray(categorias)
    ? categorias.find(c => c._id === categoriaSeleccionada)
    : null;

    
  return (
    <div className='subir-libro-main'>
    {id? (
      <form onSubmit={handlePublish} className="subir-libro-form">
          <div className='subir-libro-titulo'>
          <label htmlFor="img" className="preview-container">
            {/* muestra la imagen subida */}
            
            <img src={previewUrl || subirImgDefault} alt="Vista previa" className="preview-image" />

            {/* subir img */}
            <input
            id="img"
            accept="image/*" 
            type="file"
            name="img"
            onChange={handleImageUpload}
            hidden
            />
           
          </label>
        
          <label htmlFor="titulo" className='subir-libro-titulo-libro'>
              Titulo:
              <input
                  id="titulo"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
          </label>
        </div>
        <fieldset>
          
        
        <label htmlFor="archivo">
            Contenido:
            <input
            id="archivo"
            type="file"
            accept=".docx,.pdf,.epub,.mobi"
            onChange={handleFileUpload}
            required
            />
        </label>
        <label htmlFor="precio" className='input-precio'>
            Precio (€):
            <input
                id="precio"
                type="number"
                placeholder="Precio en euros"
                value={price}
                onChange={handlePriceChange}
                required
            />
            {/* <p className="currency-symbol">€</p> */}
        </label>
        <div className='select-categoria'>
            <div>
                <label htmlFor="">Categoria:</label>
                <select name="categoria" id="" 
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                required>
                    <option value="" disabled>Selecciona la categoría de tu libro</option>
                    {categorias.map((categoria) => (
                        <option key={categoria._id} value={categoria._id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="colecciones">Colecciones:</label>
                <select id="colecciones" name="colecciones" 
                value={coleccionSeleccionada}
                onChange={(e) => setColeccionSeleccionada(e.target.value)}
                required>
                    <option value="" disabled>Selecciona una colección</option>
                    {categoriaObj?.colleccion?.map((c,index) => (
                        <option key={index} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        </fieldset>
        <button style={{
          boxShadow:"0 0 1px 2px var(--bg-color-default)"
        }} type="submit">Subir</button>
        
    </form>
    )
    : (
        <Author />
    )}
    </div>
  )
}

export default SubirLibro