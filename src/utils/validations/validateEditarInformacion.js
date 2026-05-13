// validateEditarInformacion.js
// Función para validar campos del formulario de EditarInformacion

export const validateEditarInformacion = (formData) => {
  // Validar el nombre (solo letras y espacios)
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(formData.nombre)) {
    return { campo: "nombre", mensaje: "El nombre no puede contener números ni caracteres especiales." };
  }
  if (!formData.nombre.trim()) {
    return { campo: "nombre", mensaje: "El nombre es obligatorio." };
  }
  // Validar el apeilldo (solo letras y espacios)
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(formData.apellido)) {
    return { campo: "apellido", mensaje: "El apellido no puede contener números ni caracteres especiales." };
  }
  if (!formData.apellido.trim()) {
    return { campo: "apellido", mensaje: "El apellido es obligatorio." };
  }

  if (!formData.fechaNacimiento) {
    return { campo: "fechaNacimiento", mensaje: "La fecha de nacimiento es obligatoria." };
  }
  // Validar el formato de la fecha (YYYY-MM-DD)
  const fecha = new Date(formData.fechaNacimiento);
  const minFecha = new Date(1900, 0, 1);
  const maxFecha = new Date(2007, 11, 31);
  // Comprobar si la fecha es válida
  // y si está dentro del rango permitido
  if (isNaN(fecha.getTime())) {
    return { campo: "fechaNacimiento", mensaje: "La fecha de nacimiento no es válida." };
  }
  if (fecha < minFecha || fecha > maxFecha) {
    return { campo: "fechaNacimiento", mensaje: "La fecha debe estar entre 01/01/1900 y 31/12/2007." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return { campo: "email", mensaje: "El formato del correo electrónico no es válido." };
  }
  if (!formData.email.trim()) {
    return { campo: "email", mensaje: "El correo electrónico es obligatorio." };
  }

  if (!formData.direccion.trim()) {
    return { campo: "direccion", mensaje: "La dirección es obligatoria." };
  }

  // if (!/^\d{5}$/.test(formData.codigoPostal)) {
  //   return { campo: "codigoPostal", mensaje: "El código postal debe contener exactamente 5 dígitos." };
  // }
  if (!formData.codigoPostal.trim()) {
    return { campo: "codigoPostal", mensaje: "El código postal es obligatorio." };
  }

  if (!formData.provincia.trim()) {
    return { campo: "provincia", mensaje: "La provincia es obligatoria." };
  }

  if (!formData.pais.trim()) {
    return { campo: "pais", mensaje: "El país es obligatorio." };
  }

  if (!formData.nacionalidad.trim() || formData.nacionalidad === "-- Selecciona un país --") {
    return { campo: "nacionalidad", mensaje: "La nacionalidad es obligatoria." };
  }

  if (!formData.genero.trim() || formData.genero === "-- Selecciona tu género --") {
    return { campo: "genero", mensaje: "El género es obligatorio." };
  }

  // // Validar el teléfono (solo números y longitud de 9 dígitos)
  // if (!/^[69]\d{8}$/.test(formData.telefono)) {
  //   return {
  //     campo: "telefono",
  //     mensaje: "Debe contener 9 dígitos y comenzar con 6 o 9."
  //   };
  // }
  return null; // No hay errores
};
