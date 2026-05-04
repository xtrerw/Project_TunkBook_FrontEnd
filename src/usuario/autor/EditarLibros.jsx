// Componente para editar un libro existente
import React, { useState, useEffect } from 'react';
// manejar tipo de docx,pdf,epub
import mammoth from 'mammoth';
// import ePub from 'epubjs';
import subirImgDefault from '../../img/subir-img-default.png';
// import * as pdfjsLib from 'pdfjs-dist';

// // usar CDN oficial para evitar error con Vite
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const EditarLibros = ({ libroId, onCancel, onSuccess }) => {

  const [selectedFile, setSelectedFile] = useState(null);

    //hasta top en caso clic
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
const [formData, setFormData] = useState({
  titulo: '',
  precio: '',
  contenido: '',
  img: '',
  categoriaSeleccionada: '',
  coleccionSeleccionada: '',
  tipoArchivo: '' // nuevo campo para que el backend sepa cómo guardar
});


  const [previewUrl, setPreviewUrl] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Cargar datos del libro y categorías al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const res = await fetch(`http://localhost:5001/misLibros/libro/${libroId}`);
      const data = await res.json();

      setFormData({
        titulo: data.titulo || '',
        precio: data.precio || '',
        contenido: data.contenido || '',
        img: data.img || '',
        categoriaSeleccionada: data.categoria?.[0]?.cateID || '',
        coleccionSeleccionada: data.categoria?.[0]?.colleccion?.[0] || ''
      });

      setPreviewUrl(data.img);

      const resCat = await fetch('http://localhost:5001/autor/categorias');
      const dataCat = await resCat.json();
      // Buscar la categoría "Imprescindibles" (nombre exacto en plural, según lo mostrado)
      const impCategoria = dataCat.find(c => c.nombre.toLowerCase() === "imprescindibles");

      // Filtrar la lista para excluir "Imprescindibles"
      const categoriasFiltradas = dataCat.filter(c => c.nombre.toLowerCase() !== "imprescindibles");

      // Guardar las categorías válidas en el estado
      setCategorias(Array.isArray(categoriasFiltradas) ? categoriasFiltradas : []);

      // Si la categoría actual seleccionada es "Imprescindibles", reiniciarla
      if (impCategoria && formData.categoriaSeleccionada === impCategoria._id) {
        setFormData(prev => ({
          ...prev,
          categoriaSeleccionada: "",
          coleccionSeleccionada: ""
        }));
      }
    };

    if (libroId) cargarDatos();
  }, [libroId]);

  // Manejar carga de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result });
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  Convertir archivo .docx a texto
 // Manejar carga de archivo (.docx, .pdf, .epub)
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop();

  setSelectedFile(file); // para subrir con handlesubmit

  try {
    if (extension === 'docx') {
      // DOCX: extraer texto y mostrar en contenido
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setFormData({
        ...formData,
        contenido: result.value,
        tipoArchivo: 'texto' // 
      });

    } else {
      // PDF、EPUB：no maneja, solo guardar archivo
      setFormData({
        ...formData,
        contenido: '',
        tipoArchivo: 'archivo'
      });
    }
  } catch (error) {
    console.error('Error al leer archivo:', error);
    alert('No se pudo procesar el archivo.');
  }
};




const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('titulo', formData.titulo);
  form.append('precio', formData.precio);
  form.append('img', formData.img);
  form.append('categoriaSeleccionada', formData.categoriaSeleccionada);
  form.append('coleccionSeleccionada', formData.coleccionSeleccionada);

  if (selectedFile) {
    form.append('file', selectedFile); // 
  }

  const res = await fetch(`http://localhost:5001/misLibros/libro/${libroId}`, {
    method: 'PUT',
    body: form
  });

  if (res.ok) {
    onSuccess();
  } else {
    alert('Error al guardar los cambios');
  }
};


  return (
      <div className='subir-libro-main'>
        <form onSubmit={handleSubmit} className="subir-libro-form">
          <div className='subir-libro-titulo'>
            <label htmlFor="img" className="preview-container">
            <img src={previewUrl || subirImgDefault} alt="Vista previa" className="preview-image" />
            <input id="img" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>

          <label className='subir-libro-titulo-libro'>Título:
            <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            required
            />
          </label>
          </div>
          
        <fieldset>

          <label>Contenido:
            <input type="file" accept=".docx,.pdf,.epub,.mobi" onChange={handleFileUpload} required/>
          </label>

          <label>Precio (€):
            <input
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
            />
          </label>

          <div className='select-categoria'>
              <label>Categoría:
              <select
              value={formData.categoriaSeleccionada}
              onChange={(e) => setFormData({ ...formData, categoriaSeleccionada: e.target.value })}
              required
              >
              <option value="">Seleccione una</option>
              {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
              ))}
              </select>
            </label>

            <label>Colección:
              <select
              value={formData.coleccionSeleccionada}
              onChange={(e) => setFormData({ ...formData, coleccionSeleccionada: e.target.value })}
              required
              >
              <option value="">Seleccione una</option>
              {categorias.find(c => c._id === formData.categoriaSeleccionada)?.colleccion?.map((col, idx) => (
              <option key={idx} value={col}>{col}</option>
              ))}
              </select>
            </label>
          </div>
          
        </fieldset>
       

        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onCancel} style={{background:"var(--color-error-text)",color:"var(--bg-color-default)"}}>Cancelar</button>

        </form>
    </div>
   
  );
};

export default EditarLibros;
