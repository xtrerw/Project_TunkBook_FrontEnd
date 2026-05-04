import { Router } from "express";
import ServerModel from "../server.js";
import { createHash } from 'crypto';

const router = Router();

// Hash password function
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
//conseguir todos los usuarios
router.get("/listado", async (req, res) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = await ServerModel.Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
});
//iniciar sesion
router.post("/iniciar", async (req, res) => {
    const { usernombre, password } = req.body; // Obtener los datos del cuerpo de la solicitud
    try {
        // Buscar el usuario en la base de datos
        const usuario = await ServerModel.Usuario.findOne({ usernombre: usernombre,password:hashpwd(password),activo:true });
        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        // si el usuario sin activo, devolver un mensaje de error
        if (!usuario.activo) {
            return res.status(401).json({ message: "Usuario inactivo" });
        }
        res.status(200).json({ message: "Inicio de sesión exitoso", usuario });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error });
    }
});
//registrar usuario

router.post("registrar", async (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { nombre, apellido, usernombre, password, fechaNacimiento, direccion, codigoPostal, provincia, pais, genero, email, telefono } = req.body;
    try {
        // crear un nuevo usuario
        const usuario = new ServerModel.Usuario({ nombre, apellido, usernombre, password, fechaNacimiento, direccion, codigoPostal, provincia, pais, genero, email, telefono,tipo:"lector",activo:true });
        // Guardar el usuario en la base de datos
        await usuario.save();
        res.status(200).json(usuario);
    } catch (error) {
        // Manejar errores, como duplicados o validaciones fallidas
        res.status(400).json({ message: error.message });// 400 Bad Request
    }
});
//convertir un usuario en escritor
router.post("/convertirse", async (req, res) => {
  const { userId } = req.body;

  try {
    // Buscar el usuario original
    const usuario = await ServerModel.Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si ya es autor
    const autorExistente = await ServerModel.Autor.findOne({ email: usuario.email });
    if (autorExistente) {
      return res.status(400).json({ message: "Este usuario ya es autor" });
    }

    // Crear nuevo autor con datos del usuario
    const nuevoAutor = new ServerModel.Autor({
        usernombre: usuario.usernombre,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        password: usuario.password,
        fechaNacimiento: usuario.fechaNacimiento,
        direccion: usuario.direccion,
        codigoPostal: usuario.codigoPostal,
        provincia: usuario.provincia,
        pais: usuario.pais,
        nacionalidad: usuario.nacionalidad,
        genero: usuario.genero,
        tipo: "autor",
        activo: true,
    });

    await nuevoAutor.save();

    // (Opcional) Actualizar tipo en la colección original
    // usuario.tipo = "autor";
    // await usuario.save();

    res.status(201).json({ message: "Usuario convertido a autor", autor: nuevoAutor });

  } catch (error) {
    res.status(500).json({ message: "Error al convertir el usuario", error: error.message });
  }
});

//Obtener categorias por defecto
router.get("/categorias", async (req, res) => {
    try {
        // Obtener todas las categorías de la base de datos
        const categorias = await ServerModel.Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las categorías", error });
    }
});


export default router;