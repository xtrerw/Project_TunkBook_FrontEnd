import { Router } from "express";
import ServerModel from "../server.js";

const router = Router();

// Obtener los favoritos de un lector
router.get("/:userId", async (req, res) => {
    const { userId } = req.params; // Obtener el ID del usuario de los parámetros de la solicitud

    try {
        // Buscar los favoritos del usuario en la base de datos
        const favoritos = await ServerModel.Favorito.findOne({ userID: userId }).populate('libros.libroID');
        
        if (!favoritos) {
           return res.status(200).json({ libros: [] });
        }
        //
        const librosSolo = favoritos.libros
        .filter(item => item.libroID)
        .map(item => item.libroID);

        res.status(200).json({ libros: librosSolo });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los favoritos", error });
    }
});

// Añadir un favorito
// Ruta para añadir un libro a la lista de favoritos del usuario
router.post("/:userId", async (req, res) => {
  const { userId } = req.params; // ID del usuario
  const { libroID } = req.body; // ID del libro que se quiere añadir

  try {
    // Verificar si el libro ya está en la lista de favoritos del usuario
    const existente = await ServerModel.Favorito.findOne({
      userID: userId,
      "libros.libroID": libroID
    });

    if (existente) {
      // Si ya existe, devolver error de conflicto
      return res.status(409).json({ message: "Ya está en favoritos" });
    }

    // Si no está, agregar el libro a la lista con $addToSet (evita duplicados por seguridad)
    const favorito = await ServerModel.Favorito.findOneAndUpdate(
      { userID: userId },
      { $addToSet: { libros: { libroID } } },
      { upsert: true, new: true }
    );

    // Devolver éxito
    res.status(200).json({ message: "Favorito añadido con éxito", favorito });
  } catch (error) {
    // Capturar errores del servidor
    res.status(500).json({ message: "Error al añadir favorito", error });
  }
});


//eliminar un favorito
router.delete("/:userId/:libroId", async (req, res) => {
    const { userId, libroId } = req.params; // Obtener el ID del usuario y del libro de los parámetros de la solicitud

    try {
        // Eliminar el favorito del usuario en la base de datos
        const resultado = await ServerModel.Favorito.updateOne(
            { userID: userId },
            { $pull: { libros: { libroID: libroId } } }
        );


        if (!resultado) {
            return res.status(404).json({ message: "Favorito no encontrado." });
        }

        res.status(200).json({ message: "Favorito eliminado con éxito." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el favorito", error });
    }
});

export default router;