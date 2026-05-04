import mongoose from 'mongoose';
import { createHash } from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { type } from 'os';

// cargar el archivo .env con seguridad
dotenv.config({ path: path.resolve('src/assets/node/.env') });
const hashpwd = (pwd) => {
    return createHash('sha256').update(pwd).digest('hex');
}
console.log("usuario de mango:", process.env.DB_USER);
console.log("contraseña de mango:", process.env.DB_PASSWORD);

const user=encodeURIComponent(process.env.DB_USER);

const password=encodeURIComponent(process.env.DB_PASSWORD);

const nombreBD=encodeURIComponent(process.env.DB_NAME);

const url=`mongodb+srv://${user}:${password}@cluster0.3emmgzn.mongodb.net/${nombreBD}`;

mongoose.connect(url).then(()=>console.log('Conectado a MongoDB')).catch((err)=>console.log(err)).catch((err)=>console.log("Error al conectar a MongoDB: "+err));
//agregar documento
const addDocument = async (modelo, docs, campoUnico = 'nombre') => {
    if (!Array.isArray(docs)) {
      docs = [docs]; // si lo que insertar no es Array, convertir en array
    }
    for (const doc of docs) {
      const consulta = {};
      consulta[campoUnico] = doc[campoUnico]; // consultar array dinamicamente

      const docExiste = await modelo.findOne(consulta);
      if (!docExiste) {
        await modelo.create(doc);
      }
    }
};

  

//administrador
const SchemaAdmin=new mongoose.Schema({
    username:String,
    password:String,
    tipo:{
        type:String,
        default:"admin",
    }
})
const Admin=mongoose.model('Admin',SchemaAdmin)
//eje de admin
const nuevoAdmin=[
    {
        username:"root",
        password:hashpwd("root")
    }
]

//Reader
const SchemaUsuario=new mongoose.Schema({
    nombre:String,
    apellido:String,
    usernombre:{
      type:String,
      unique:[true, "el nombre de usuario debe ser único"],
      required: [true," el nombre de usuario es obligatorio"],
    },
    password:{
      type:String,
      required: [true," el nombre de usuario es obligatorio"],
    },
    fechaNacimiento: { type: Date },
    direccion:String,
    codigoPostal:String,
    provincia:String,
    pais:String,
    nacionalidad:String,
    genero:String,
    email:String,
    telefono:Number,
    tipo:{
      type:String,
      default:"lector",
      required:true,
    },
    activo:{
      type:Boolean,
      default:true,
    }
});

const Usuario=mongoose.model('Usuario',SchemaUsuario);

const nuevoUsuario=[
      {
      nombre: "Sara",
      apellido: "López",
      usernombre: "sara",
      password: hashpwd("1234"),
      fechaNacimiento: new Date("2000-01-01"),
      direccion: "Calle RTX5060 7 izquierda",
      codigoPostal: "23000",
      provincia: "Jaén",
      pais: "España",
      nacionalidad: "China",
      genero: "Mujer",
      email: "xqe@gmail.com",
      telefono: 666666666,
    },
    {
      nombre: "Juan",
      apellido: "López",
      usernombre: "juan",
      password: hashpwd("1234"),
      fechaNacimiento: new Date("1995-01-01"),
      direccion: "Calle RTX4060 5 izquierda",
      codigoPostal: "23000",
      provincia: "Jaén",
      pais: "España",
      nacionalidad: "Estado Unido",
      genero: "Hombre",
      email: "juan@gmail.com",
      telefono: 680145361,
    },
    {
      nombre: "Ana",
      apellido: "García",
      usernombre: "ana",
      password: hashpwd("1234"),
      fechaNacimiento: new Date("1999-06-12"),
      direccion: "Calle Madrid 10",
      codigoPostal: "28001",
      provincia: "Madrid",
      pais: "España",
      nacionalidad: "Española",
      genero: "Mujer",
      email: "ana@gmail.com",
      telefono: 612345678,
    },
    {
      nombre: "Pedro",
      apellido: "Martínez",
      usernombre: "pedro",
      password: hashpwd("1234"),
      fechaNacimiento: new Date("1990-04-20"),
      direccion: "Calle Sevilla 5",
      codigoPostal: "41001",
      provincia: "Sevilla",
      pais: "España",
      nacionalidad: "Española",
      genero: "Hombre",
      email: "pedro@gmail.com",
      telefono: 622334455,
    },
    {
      nombre: "Lucía",
      apellido: "Sánchez",
      usernombre: "lucia",
      password: hashpwd("1234"),
      fechaNacimiento: new Date("1998-09-10"),
      direccion: "Calle Valencia 3",
      codigoPostal: "46001",
      provincia: "Valencia",
      pais: "España",
      nacionalidad: "Española",
      genero: "Mujer",
      email: "lucia@gmail.com",
      telefono: 633445566,
    }
  ]
        
//autor
const SchemaAutor=new mongoose.Schema({
    nombre:String,
    apellido:String,
    usernombre:{
      type:String,
      unique:[true, "el nombre de usuario debe ser único"],
      required: [true," el nombre de usuario es obligatorio"],
    },
    password:{
      type:String,
      required: [true," el nombre de usuario es obligatorio"],
    },
    fechaNacimiento: { type: Date },
    direccion:String,
    codigoPostal:String,
    provincia:String,
    pais:String,
    nacionalidad:String,
    genero:String,
    email:String,
    tipo:{
      type:String,
      default:"autor",
    },
    activo:{
      type:Boolean,
      default:true,
    }
});

const Autor=mongoose.model('Autor',SchemaAutor);
//define los atributos de autor
const nuevoAutor=[
  {
    nombre: "Juan",
    apellido: "López",
    usernombre: "juan",
    password: hashpwd("1234"),
    fechaNacimiento: new Date("1995-01-01"),
    direccion: "Calle RTX4060 5 izquierda",
    codigoPostal: "23000",
    provincia: "Jaén",
    pais: "España",
    nacionalidad: "Estado Unido",
    genero: "Hombre",
    email: "juan@gmail.com",
    telefono: 680145361,
  },
  {
    nombre: "Ana",
    apellido: "García",
    usernombre: "ana",
    password: hashpwd("1234"),
    fechaNacimiento: new Date("1999-06-12"),
    direccion: "Calle Madrid 10",
    codigoPostal: "28001",
    provincia: "Madrid",
    pais: "España",
    nacionalidad: "Española",
    genero: "Mujer",
    email: "ana@gmail.com",
    telefono: 612345678,
  },
  {
    nombre: "Pedro",
    apellido: "Martínez",
    usernombre: "pedro",
    password: hashpwd("1234"),
    fechaNacimiento: new Date("1990-04-20"),
    direccion: "Calle Sevilla 5",
    codigoPostal: "41001",
    provincia: "Sevilla",
    pais: "España",
    nacionalidad: "Española",
    genero: "Hombre",
    email: "pedro@gmail.com",
    telefono: 622334455,
  },
  {
    nombre: "Lucía",
    apellido: "Sánchez",
    usernombre: "lucia",
    password: hashpwd("1234"),
    fechaNacimiento: new Date("1998-09-10"),
    direccion: "Calle Valencia 3",
    codigoPostal: "46001",
    provincia: "Valencia",
    pais: "España",
    nacionalidad: "Española",
    genero: "Mujer",
    email: "lucia@gmail.com",
    telefono: 633445566,
  }
]
//agregar autores de ejemplo

//categorias

const SchemaCategoria=new mongoose.Schema({
    nombre:String,
    colleccion:[String],
});
const Categoria=mongoose.model('Categoria',SchemaCategoria)
//crea categorias

const nuevoCategorias=[
    {
        nombre:"Imprescindibles",
        colleccion:["Todos los libros"]
    },
    {
        nombre:"Ficción",
        colleccion:["Romántica y erótica","Negra","Histórica","Fantástica","Ciencia ficción","Terror","Humor","Viajes"]
    },
    {
        nombre:"No Ficción",
        colleccion:["Ciencias y tecnología","Humanidades","Arte","Filología","Historia"]
    },
    {
        nombre:"Cómic y Manga",
        colleccion:["Libros de ilustración","Cómic de humor","Historia y técnica","Manga"]
    }
]


//libros
const SchemaLibro=new mongoose.Schema({
    img:{
      type:String,
      required:true,
    },
    titulo:{
      type:String,
      required:true,
    },
    //relacion entre autor y libros
    autorID:{type:mongoose.Schema.Types.ObjectId,ref:'Autor'},
    precio:{
      type:Number,
      required:true,
    },
    // relaciones entre categoría y libros
    //varias categorias
    categoria:[
      {
        cateID:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Categoria',
          required:true,
        },
        colleccion:[{type:String}]
      },
    ],
    estrella:{
      type:Number,
      default:0,
      min:0,
      max:5
    },
    oculto:{
      type:Boolean,
      default:false,
    },
    motivo:{
      type:String,
      default:""
    }
});

const Libro=mongoose.model('Libro',SchemaLibro);

//CONTENIDO
const SchemaContenido=new mongoose.Schema({
    libroID:{type:mongoose.Schema.Types.ObjectId,ref:'Libro'},
    titulo:String,
    contenido:String,
    archivo:String, // URL del archivo o contenido adicional
});

const Contenido=mongoose.model('Contenido',SchemaContenido);

//favorita lista
const SchemaFavorito = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  libros: [
    {
      libroID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Libro',
        required: true
      },
      fechaAgregado: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Favorito = mongoose.model('Favorita', SchemaFavorito);

  // compras
  const SchemaCompra=new mongoose.Schema({
    libroID:{type:mongoose.Schema.Types.ObjectId,ref:'Libro'},
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'Usuario'},
  });
  // crear el modelo de compra
  const Compra=mongoose.model('Compra',SchemaCompra);
  //agregar compras de ejemplo


  // Función para generar un precio aleatorio entre 1 y 49 euros
  const precioAleatorio = () => Math.floor(Math.random() * 30) + 1;
  // Función para generar títulos aleatorios con palabras comunes
  const generarTituloAleatorio = () => {
    const palabras1 = ["Sombras", "Susurros", "Destinos", "Secretos", "Luces", "Amanecer", "Caminos", "Espíritus", "Voces", "Horizontes"];
    const palabras2 = ["del pasado", "en la niebla", "del corazón", "perdidos", "invisibles", "eternos", "del silencio", "de cristal", "errantes", "del bosque"];
    const palabra1 = palabras1[Math.floor(Math.random() * palabras1.length)];
    const palabra2 = palabras2[Math.floor(Math.random() * palabras2.length)];
    return `${palabra1} ${palabra2}`;
  };
  const insertarDatos = async () => {
      try {
    // Buscar datos base: categorías, autor, usuario
    const categorias = await Categoria.find();
    const autores = await Autor.find();
    const usuarios = await Usuario.find();
    const categoriaTodos = await Categoria.findOne({ nombre: "Imprescindibles" });
    if (!categorias.length || !autores || !usuarios || !categoriaTodos) {
      console.error("Faltan datos base: categorías, autor o usuario.");
      return;
    }

    const libros = [], contenidos = [], compras = [];

    // Recorrer cada categoría y su collección para insertar 5 libros por cada colección
    for (let i = 1; i < categorias.length; i++) {
      const categoria=categorias[i]
      for (const coleccion of categoria.colleccion) {
        for (let i = 1; i <= 5; i++) {
          const titulo =  generarTituloAleatorio();

          const nuevoLibro = new Libro({
            img: "http://localhost:5173/src/img/libro.jpg",
            titulo,
            autorID: autores[Math.floor(Math.random() * autores.length)]._id,
            precio: precioAleatorio(),
            categoria: [
              {
                cateID: categoria._id,
                colleccion: [coleccion],
              },
              {
                cateID:categoriaTodos._id,
                colleccion:["Todos los libros"]
              }
            ],
            estrella: Math.floor(Math.random() * 5) + 1,
          });

          libros.push(nuevoLibro);
        }
      }
    }

    // Insertar libros a la base de datos
    const librosInsertados = await Libro.insertMany(libros);

    // Crear contenido y compras para cada libro insertado
    for (const libro of librosInsertados) {
      contenidos.push({
        libroID: libro._id,
        titulo: libro.titulo,
        contenido: `Este es el contenido de ejemplo para "${libro.titulo}". Una historia increíble con aventuras y emoción.`
      });

       for (const usuario of usuarios) {
        compras.push({ libroID: libro._id, userID: usuario._id });
      }
    }

    // Insertar contenidos y compras a la base de datos
    await Contenido.insertMany(contenidos);
    await Compra.insertMany(compras);

     // Asignar favoritos aleatorios por usuario
    for (const usuario of usuarios) {
      const favoritos = librosInsertados
        .sort(() => 0.5 - Math.random())
        .slice(0, 15) // Seleccionar 15 libros aleatorios
        .map((libro) => ({ libroID: libro._id }));

      await Favorito.updateOne(
        { userID: usuario._id },
        { $set: { libros: favoritos } },
        { upsert: true }
      );
    }

    console.log("Libros, contenidos y compras insertados con éxito.");
  } catch (err) {
    console.error("Error al insertar datos:", err);
  }
  };
  
  
const initDB = async () => {
    await addDocument(Admin, nuevoAdmin, 'username');
    await addDocument(Autor, nuevoAutor, 'usernombre');
    await addDocument(Categoria, nuevoCategorias, 'nombre');
    await addDocument(Usuario, nuevoUsuario, 'usernombre');
    
    const libroExistente = await Libro.findOne();
    if (!libroExistente) {
      await insertarDatos(); // realizar sin existir los libros
    }
  };
  
  initDB();

//exportar todos los modelos a api.js
export default {Usuario,Autor,Libro,Contenido,Admin,Categoria,Favorito,addDocument};