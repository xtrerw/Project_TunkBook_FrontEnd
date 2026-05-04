import {Router} from 'express';
import ServerModel from '../server.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';

const router = Router();


//mis libros
router.get('/:id',async (req,res)=>{
    const id = req.params.id;
    try {
        const libros = await ServerModel.Libro.find({autorID:id});
        res.status(200).json(libros);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
// Eliminar un libro por ID
router.delete('/libro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await ServerModel.Libro.findByIdAndDelete(id);
    res.status(200).json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Conseguir los libros que quiere editar
router.get('/libro/:id', async (req, res) => {
  try {
    const libro = await ServerModel.Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(libro);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libro' });
  }
});

//Editar los libros
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Editar libros
router.put('/libro/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    precio,
    img,
    categoriaSeleccionada,
    coleccionSeleccionada
  } = req.body;
  const file = req.file;

  if (!titulo || !precio || !categoriaSeleccionada) {
    return res.status(400).json({ message: "Campos obligatorios faltantes." });
  }

  try {
    // preparar categorías
    const categorias = [
      {
        cateID: categoriaSeleccionada,
        colleccion: [coleccionSeleccionada]
      }
    ];
    const categoriaDefault = await ServerModel.Categoria.findOne({ nombre: 'Imprescindibles' });
    if (categoriaDefault) {
      categorias.push({
        cateID: categoriaDefault._id,
        colleccion: ["Todos los libros"]
      });
    }

    // actualizar datos principales del libro
    const libroActualizado = await ServerModel.Libro.findByIdAndUpdate(id, {
      titulo,
      precio,
      img,
      categoria: categorias
    }, { new: true });

    if (!libroActualizado) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // actualizar contenido
    let contenidoTexto = null;
    let archivo = null;

    if (file) {
      const extension = file.originalname.split('.').pop().toLowerCase();

      if (extension === 'docx') {
        const buffer = fs.readFileSync(file.path);
        const result = await mammoth.extractRawText({ buffer });
        contenidoTexto = result.value;
      } else {
        archivo = file.filename;
      }

      // Verificar si ya existe contenido
      const contenidoExistente = await ServerModel.Contenido.findOne({ libroID: id });
      if (contenidoExistente) {
        contenidoExistente.contenido = contenidoTexto || '';
        contenidoExistente.archivo = archivo || '';
        await contenidoExistente.save();
      } else {
        const nuevoContenido = new ServerModel.Contenido({
          contenido: contenidoTexto || '',
          archivo: archivo || '',
          libroID: id
        });
        await nuevoContenido.save();
      }
    }

    res.status(200).json({ message: "Libro actualizado con éxito", libro: libroActualizado });

  } catch (error) {
    console.error("Error al actualizar libro:", error.message);
    res.status(500).json({ error: error.message });
  }
});


export default router;