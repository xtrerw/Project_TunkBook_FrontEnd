// validateAuthor.js
// Función para validar campos del formulario de registro de autor

export const validateAuthor = (formData) => {
    // Validar username obligatorio
    if (!formData.username || !formData.username.trim()) {
      return { campo: "username", mensaje: "El nombre de usuario es obligatorio." };
    }
    // username entre 6 y 20 caracteres
    if (formData.username.length < 6) {
      return { campo: "username", mensaje: "El nombre de usuario debe tener al menos 6 caracteres." };
    }
    if (formData.username.length > 20) {
      return { campo: "username", mensaje: "El nombre de usuario no puede tener más de 20 caracteres." };
    }
    // Validar email obligatorio y formato
    if (!formData.email || !formData.email.trim()) {
      return { campo: "email", mensaje: "El correo electrónico es obligatorio." };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { campo: "email", mensaje: "El correo electrónico no es válido." };
    }
    // email entre 6 y 20 caracteres
    if (formData.email.length < 6) {
      return { campo: "email", mensaje: "El correo electrónico debe tener al menos 6 caracteres." };
    }
    if (formData.email.length > 20) {
      return { campo: "email", mensaje: "El correo electrónico no puede tener más de 20 caracteres." };
    }
    // Validar fecha de nacimiento
    if (!formData.dateBirth) {
      return { campo: "dateBirth", mensaje: "La fecha de nacimiento es obligatoria." };
    }
    const fecha = new Date(formData.dateBirth);
    const minFecha = new Date(1900, 0, 1);
    const maxFecha = new Date(
      new Date().getFullYear() - 12,
      new Date().getMonth(),
      new Date().getDate()
    );
  
    if (isNaN(fecha.getTime())) {
      return { campo: "dateBirth", mensaje: "La fecha de nacimiento no es válida." };
    }
    if (fecha < minFecha || fecha > maxFecha) {
      return { campo: "dateBirth", mensaje: "La fecha debe estar entre 01/01/1900 y 31/12/" + maxFecha.getFullYear() + "." };
    }
  
    // Validar contraseña con confirmación y requisitos de seguridad
    if (!formData.password || !formData.password.trim()) {
      return { campo: "password", mensaje: "La contraseña es obligatoria." };
    }
  
    if (formData.password.length < 6) {
      return { campo: "password", mensaje: "La contraseña debe tener al menos 6 caracteres." };
    }
  
    if (formData.password.length > 20) {
      return { campo: "password", mensaje: "La contraseña no puede tener más de 20 caracteres." };
    }
  
    if (!/[A-Z]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos una letra mayúscula." };
    }
  
    if (!/[a-z]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos una letra minúscula." };
    }
  
    if (!/[0-9]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos un número." };
    }
  
    if (!/[!@#$%^&*]/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña debe contener al menos un carácter especial (!@#$%^&*)." };
    }
  
    if (/\s/.test(formData.password)) {
      return { campo: "password", mensaje: "La contraseña no puede contener espacios en blanco." };
    }
  
    return null; // No hay errores
  };
  