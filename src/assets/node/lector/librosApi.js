import {Router} from 'express';
import ServerModel from '../server.js';


const router = Router();

//libros que presentan en front-end
  router.get('/libros', async (req, res) => {
      //conseguir los libros y su autor
      const libros = await ServerModel.Libro.find({}).populate('autorID','nombre apellido');
      
      res.status(200).json(libros);
  });
  //contenido
  router.get('/libros/:id', async (req, res) => {
    const { id } = req.params; // conseguir id
  
    try {
      // Buscar por el campo libroID, no por _id
      const contenidos = await ServerModel.Contenido.find({ libroID: id });
  
      if (!contenidos || contenidos.length === 0) {
        return res.status(404).json({ message: 'Contenido no encontrado' });
      }
  
      res.status(200).json(contenidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el contenido: ' + error });
    }
  });
  //categoria
  
  router.get('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params; // conseguir id
        const categorias = await ServerModel.Categoria.findOne({ nombre: id }); // Usa `findOne` en vez de `find`
        
        if (!categorias) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        //según categoria conseguir los libros y su autor
        const libros = await ServerModel.Libro.find({ 'categoria.cateID': categorias._id }).populate("autorID");
  
        res.status(200).json({ categoria: categorias, libros: libros }); // Solo una respuesta
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", detalle: error.message });
    }
  });

  export default router;