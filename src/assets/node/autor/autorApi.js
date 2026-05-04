import { Router } from "express";
import ServerModel from "../server.js";
import { createHash } from 'crypto';
import path from "path";
import fs from "fs";
import multer from "multer";
import mammoth from "mammoth"; // Para manejar archivos DOCX
const router = Router();

// Hash password function
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
// conseguir todos los autores
router.get("/listado", async (req, res) => {
    try {
        // Obtener todos los autores de la base de datos
        const autores = await ServerModel.Autor.find();
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los autores", error });
    }
});
// Register route
router.post('/register', async(req, res) => {
  const { nombre,apellido,fechaNacimiento,username, password,tipoRegistro,nacionalidad,genero } = req.body;
  let user
  try {
    //verificar si es lector o autor
    if (tipoRegistro === "lector") {
      // Verificar si el nombre de usuario ya existe en la colección de lectores
      user = await ServerModel.Usuario.findOne({ usernombre: username });
      if (user) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }
      // Crear un nuevo lector
      user = new ServerModel.Usuario({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaNacimiento, usernombre:username, password:hashpwd(password), tipo:tipoRegistro ,activo:true, nacionalidad:nacionalidad,genero:genero });
      await user.save();
      res.status(200).json(user);
      return;
    } 
    // verificar si es autor
    else if (tipoRegistro === "autor") {
    // Verificar si el nombre de usuario ya existe en la colección de autores
    user = await ServerModel.Autor.findOne({ usernombre: username });
    if (user) {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }
    // Crear un nuevo autor
    user = new ServerModel.Autor({ nombre:nombre, apellido:apellido ,fechaNacimiento:fechaNacimiento, usernombre:username, password:hashpwd(password), tipo:tipoRegistro ,activo:true, nacionalidad:nacionalidad,genero:genero });
    await user.save();
    return res.status(200).json(user);
  }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//convertirse en lector
router.post('/convertirse', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ mensaje: "Falta el ID de usuario." });
  }

  try {
    // 1. Buscar el autor por ID
    const autor = await ServerModel.Autor.findById(userId);
    if (!autor) {
      return res.status(404).json({ mensaje: "Autor no encontrado." });
    }

    // 2. Verificar si ya existe un lector con el mismo correo
    const existe = await ServerModel.Usuario.findOne({ email: autor.email });
    if (existe) {
      return res.status(400).json({ mensaje: "Ya existe un lector con este correo." });
    }

    // 3. Crear un nuevo usuario tipo lector
    const lector = new ServerModel.Usuario({
      usernombre: autor.usernombre,
      nombre: autor.nombre,
      apellido: autor.apellido,
      fechaNacimiento: autor.fechaNacimiento,
      direccion: autor.direccion,
      codigoPostal: autor.codigoPostal,
      provincia: autor.provincia,
      pais: autor.pais,
      nacionalidad: autor.nacionalidad,
      genero: autor.genero,
      email: autor.email,
      password: autor.password,
      tipo: "lector",
      activo: true
    });

    await lector.save();
    res.status(201).json({ mensaje: "Lector registrado con éxito.", lector });
  } catch (error) {
    console.error("Error al convertir en lector:", error);
    res.status(500).json({ mensaje: "Error del servidor.", error: error.message });
  }
});

//iniciar sesión
router.post('/iniciar', async (req, res) => {
    const { username, password,tipoUsuario } = req.body;
    try {
      const hashedPwd = hashpwd(password);
      let usuario;
      // Verificar el tipo de usuario y buscar en la colección correspondiente
      // Si el tipo de usuario es "Autor", buscar en la colección de autores
      // Si el tipo de usuario es "Lector", buscar en la colección de lectores
      if (tipoUsuario === "autor") {
        // conseguir en la colección de autores
        usuario = await ServerModel.Autor.findOne({ usernombre: username, password: hashedPwd, tipo: tipoUsuario });
      } else if (tipoUsuario === "lector") {
        // conseguir en la colección de lectores
        usuario = await ServerModel.Usuario.findOne({ usernombre: username, password: hashedPwd, tipo: tipoUsuario });
      }
      // Verificar si el usuario existe
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario o contraseña incorrecto' });
      }
      // Verificar si el usuario está activo
      if (!usuario.activo) {
        return res.status(401).json({ message: 'Usuario inactivo' });
      }
    
      res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//conseguir categorias
// Obtener todas las categorías
router.get("/categorias", async (req, res) => {
  try {
    const categorias = await ServerModel.Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener las categorías", error: error.message });
  }
});

// subir los libros
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

// Ruta para publicar un libro
router.post('/publish', upload.single('file'), async (req, res) => {
  const { img, title, id, price, categoriaSeleccionada, coleccionSeleccionada, content } = req.body;
  const file = req.file;

  // Validación de campos obligatorios
  if (!title || !price || !categoriaSeleccionada || !file) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    // Buscar categoría por defecto
    const categoriaDefecto = await ServerModel.Categoria.findOne({ nombre: "Imprescindibles" });
    if (!categoriaDefecto) {
      return res.status(400).json({ message: "Categoría por defecto no encontrada." });
    }

    // Crear y guardar el libro
    const libro = new ServerModel.Libro({
      img: img || "default.png", // Imagen por defecto si no se provee
      titulo: title,
      autorID: id,
      contenido: content || "",
      precio: price,
      categoria: [
        {
          cateID: categoriaSeleccionada,
          colleccion: coleccionSeleccionada
        },
        {
          cateID: categoriaDefecto._id,
          colleccion: "Todos los libros"
        }
      ]
    });

    await libro.save();

    // Procesar archivo del contenido
    const extension = file.originalname.split('.').pop().toLowerCase();
    let contenidoTexto = null;
    let archivo = null;

    if (extension === "docx") {
      // Extraer texto de archivo Word
      const buffer = fs.readFileSync(file.path);
      const result = await mammoth.extractRawText({ buffer });
      contenidoTexto = result.value;
    } else {
      // Guardar solo el archivo (pdf, epub, etc.)
      archivo = file.filename;
    }

    // Guardar contenido del libro
    const contenido = new ServerModel.Contenido({
      contenido: contenidoTexto,
      archivo: archivo,
      libroID: libro._id
    });

    await contenido.save();

    res.status(200).json({
      message: "Libro y contenido guardados correctamente",
      libro,
      contenido
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//autores
// Obtener información del autor por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let usuario;
    try {
        // Buscar el autor por ID
        usuario = await ServerModel.Autor.findById(id);
        if (!usuario) {
            // Si no se encuentra el autor, buscar en la colección de usuarios
          usuario = await ServerModel.Usuario.findById(id);
          // Si no se encuentra el usuario, devolver un error 404
          if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
          }
        }
        // Enviar la respuesta con el autor o usuario encontrado
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener autor", error });
    }
  });
  
  
// Actualizar información del autor por ID
router.put('/:id', async (req, res) => {
    // Obtener el ID del autor desde los parámetros de la solicitud
    const { id } = req.params;
    // Extraer los campos que deseas actualizar del cuerpo de la solicitud
    const { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, genero, email,telefono,tipo } = req.body;
    let usuario
    // Validar que el ID es un ObjectId válido
    let lector = await ServerModel.Usuario.findById(id);
    let autor = await ServerModel.Autor.findById(id);
    try {
      //si es lector
        if (lector) {
          usuario=await ServerModel.Usuario.findByIdAndUpdate(id,{
            nombre: nombre,apellido:apellido,fechaNacimiento:fechaNacimiento,direccion:direccion,nacionalidad:nacionalidad,codigoPostal:codigoPostal,provincia:provincia,pais:pais,telefono:telefono,genero:genero,email:email
          },
          {new: true})
        } 
        // si es autor
        else if (autor) {
          usuario = await ServerModel.Autor.findByIdAndUpdate(id, { nombre, apellido, fechaNacimiento, direccion, codigoPostal, provincia, pais, nacionalidad, genero, email }, { new: true });
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Enviar la respuesta con el autor actualizado
        res.status(200).json(usuario);
    } catch (error) {
      console.error("PUT /autor/:id error", error.message, error.stack);
      res.status(500).json({ message: "Error al autor", error: error.message });
        //res.status(500).json({ message: "Error al actualizar autor", error });
    }
  });
//Verificar contraseña anterior por ID
router.post('/password/:id', async (req, res) => {
  const { id } = req.params;
  const { contrasena } = req.body;
  const hashedPwd = hashpwd(contrasena);

  try {
    // Primero buscar en usuarios (lectores)
    let usuario = await ServerModel.Usuario.findById(id);

    // Si no está en usuarios, buscar en autores
    if (!usuario) {
      usuario = await ServerModel.Autor.findById(id);
    }

    // Si no se encuentra en ningún modelo
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    if (hashedPwd !== usuario.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({ message: "Contraseña correcta" });
  } catch (error) {
    console.error("Error al verificar contraseña:", error.message);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
});

// Cambiar contraseña del autor por ID
router.put('/password/:id', async (req, res) => {
    const { id } = req.params;
    const { contrasena } = req.body;
    const hashedPwd = hashpwd(contrasena);
    try {
        let lector = await ServerModel.Usuario.findById(id);
        let autor = await ServerModel.Autor.findById(id);
        let usuario;

        if (lector) {
          usuario = await ServerModel.Usuario.findByIdAndUpdate(id, { password: hashedPwd }, { new: true });
        } else if (autor) {
          usuario = await ServerModel.Autor.findByIdAndUpdate(id, { password: hashedPwd }, { new: true });
        } else {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Contraseña actualizada correctamente", usuario });
    } catch (error) {
      console.error("cambiar contraseña error", error.message, error.stack);
      res.status(500).json({ message: "Error al actualizar contraseña", error: error.message });
    }
  });

  export default router;