import ServerModel from "../server.js";
import express from 'express';

const router = express.Router();

// Ocultar los libros
//conseguir los libros de un autor
router.get('/ocultarLibros/:id', async (req, res) => {
    const { id } = req.params; // conseguir id del autor
    
    try {
        // Buscar los libros del autor
        const libros = await ServerModel.Libro.find({ autorID: id }).populate("autorID","nombre apellido")

        if (!libros || libros.length === 0) {
        return res.status(404).json({ message: 'No se encontraron libros para este autor' });
        }
        //muestra los libros en el front-end
        res.status(200).json(libros);
    } catch (error) {
        res.status(500).json({ message: 'Error al ocultar los libros: ' + error.message });
    }
});
// Ocultar o mostrar un libro
router.put('/ocultar/:libroID', async (req, res) => {
    const { libroID } = req.params; // ID del libro a ocultar o mostrar
    const { oculto,motivo } = req.body; // Estado de oculto (true o false)

    try {
        // Actualizar el estado de oculto del libro
        const libroActualizado = await ServerModel.Libro.findByIdAndUpdate(
            libroID,
            { 
                oculto: oculto,
                motivo: motivo
},
            { new: true }
        );
        // Verificar si el libro fue encontrado y actualizado
        if (!libroActualizado) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        // Devolver el libro actualizado
        res.status(200).json(libroActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del libro: ' + error.message });
    }
});
export default router;