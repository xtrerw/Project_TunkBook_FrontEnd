// validatePassword.js
// Función que valida contraseñas según diversos criterios de seguridad.
export const validatePassword = (password, confirmPassword) => {
    // Verificar que ambas contraseñas coincidan
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.";
    }
  
    // Verificar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
  
    // Verificar que la contraseña no exceda los 20 caracteres
    if (password.length > 20) {
      return "La contraseña no puede tener más de 20 caracteres.";
    }
  
    // Verificar que la contraseña contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
  
    // Verificar que la contraseña contenga al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula.";
    }
  
    // Verificar que la contraseña contenga al menos un número
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }
  
    // Verificar que la contraseña contenga al menos un carácter especial
    if (!/[!@#$%^&*]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial (!@#$%^&*).";
    }
  
    // Verificar que la contraseña no contenga espacios en blanco
    if (/\s/.test(password)) {
      return "La contraseña no puede contener espacios en blanco.";
    }
  
    // Si la contraseña pasa todas las verificaciones, no se devuelve ningún error
    return ""; // No hay errores
  };
  