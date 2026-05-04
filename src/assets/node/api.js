import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
//importar todos los apis
import librosRouter from './lector/librosApi.js';
import autorRouter from './autor/autorApi.js';
import misLibrosRouter from './autor/misLibrosApi.js';
import adminRouter from './admin/adminApi.js';
import comprasRouter from './lector/comprasApi.js';
import usuarioRouter from './lector/usuarioApi.js';
import categoriaRouter from './admin/categoriaApi.js';
import favoritoRouter from './lector/favoritoApi.js';
import ocultarLibrosRouter from './admin/ocultarLibrosApi.js';
const app = express();

app.use(express.json({
  // eliminar el límite de tamaño de imgenes
  // para evitar errores al subir imágenes grandes
  limit: '20mb'
}));
app.use(express.urlencoded({
  extended:true,
  // eliminar el límite de tamaño de imgenes
  limit: '20mb'
}));
app.use(cors());

//Entrada de ruta unificada
// Ruta para servir archivos estáticos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
//autor
app.use('/autor', autorRouter);
app.use('/misLibros', misLibrosRouter);
//lector
app.use('/compras', comprasRouter);
app.use('/usuario', usuarioRouter);
app.use('/libros', librosRouter);
app.use('/favoritos', favoritoRouter);
// admin
app.use('/admin', adminRouter);
app.use('/adminCategoria',categoriaRouter)
app.use('/ocultarLibros', ocultarLibrosRouter);


// Puerto de escucha de servidor único
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});