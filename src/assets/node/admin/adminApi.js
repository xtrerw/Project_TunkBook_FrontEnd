import { Router } from "express";
import ServerModel from "../server.js";
import { createHash } from 'crypto';
const router = Router();

//hash de la contraseña
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
//admin login
router.post('/login',async (req,res)=>{
    //conseguir el usuario y la contraseña del administrador
    const { usuario, password } = req.body;
    try {
      //verificar si el usuario y la contraseña son correctos
      const admin = await ServerModel.Admin.findOne({ username: usuario, password: hashpwd(password)});
      //si el usuario y la contraseña son correctos, devolver un mensaje de éxito
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // 
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
})
//actualizar el estado de un lector
router.put("/actualizarLector/:id", async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    try {
        // Actualizar el estado del usuario en la base de datos
        const usuario = await ServerModel.Usuario.findByIdAndUpdate(id, { activo:activo }, { new: true });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
});
//eliminar un lector
router.delete("/eliminarLector/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar el lector de la base de datos
        const usuario = await ServerModel.Usuario.findByIdAndDelete(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
});
//actualizar el estado de un autor
router.put("/actualizarAutor/:id", async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    try {
        // Actualizar el estado del usuario en la base de datos
        const usuario = await ServerModel.Autor.findByIdAndUpdate(id, { activo:activo }, { new: true });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
});
//Eliminar un autor
router.delete("/eliminarAutor/:id", async (req, res) => {
    const { id } = req.params;
    try {
         // 1. Buscar libros del autor
    const librosDelAutor = await ServerModel.Libro.find({ autorID: id });
    const libroIDs = librosDelAutor.map(libro => libro._id);

    // 2. Eliminar contenidos de esos libros
    await ServerModel.Contenido.deleteMany({ libroID: { $in: libroIDs } });

    // 3. Eliminar libros
    await ServerModel.Libro.deleteMany({ _id: { $in: libroIDs } });

    // 4. Eliminar el autor
    const autorEliminado = await ServerModel.Autor.findByIdAndDelete(id);
    if (!autorEliminado) {
      return res.status(404).json({ message: "Autor no encontrado" });
    }

    res.status(200).json({ message: "Autor, libros y contenidos eliminados." });
    } catch (error) {
        // Manejo de errores en el proceso de eliminación
        res.status(500).json({ message: "Error al eliminar autor o sus datos", error });
    }
});
export default router;
