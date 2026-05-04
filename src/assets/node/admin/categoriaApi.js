import express from 'express';
import ServerModel from "../server.js";

const router = express.Router();

// Obtener todas las categorías
router.get('/categoria', async (req, res) => {
  try {
    const categorias = await ServerModel.Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

// Crear nueva categoría
router.post('/categoria', async (req, res) => {
  const { nombre, colleccion } = req.body;

  try {
    const nuevaCategoria = new ServerModel.Categoria({ nombre, colleccion });
    await nuevaCategoria.save();
    res.json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la categoría' });
  }
});

// Actualizar una categoría existente por ID
router.put('/categoria/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, colleccion } = req.body;

  try {
    const actualizada = await ServerModel.Categoria.findByIdAndUpdate(
      id,
      { nombre, colleccion },
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría por ID
router.delete('/categoria/:id', async (req, res) => {
  const { id } = req.params;

  try {
    //eliminar todos los libros que pertenecen a esta categoría
    await ServerModel.Libro.updateMany({ "categoria.cateID": id },{
      $unset: {
         categoria: {
          cateID:id
         } 
      }
    });
    //eliminar la categoría
    await ServerModel.Categoria.findByIdAndDelete(id);
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la categoría' });
  }
});

export default router;
