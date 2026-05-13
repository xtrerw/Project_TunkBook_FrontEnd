// hooks/useFormValidation.js
// Hook personalizado para validar formularios de manera reutilizable

import { useState } from "react";

export const useFormValidation = (validateFn) => {
  // Estado para guardar los errores por campo (ej. { nombre: true })
  const [errores, setErrores] = useState({});

  // Estado para guardar el mensaje general de error
  const [mensajeError, setMensajeError] = useState("");

  // Función para ejecutar la validación
  const validar = (data) => {
    const resultado = validateFn(data);

    if (resultado) {
      // Si hay un error, actualizamos el campo con error y el mensaje
      setErrores({ [resultado.campo]: true });
      setMensajeError(resultado.mensaje);
      return true; // hay error
    }

    // Si no hay error, limpiamos los estados
    setErrores({});
    setMensajeError("");
    return false; // todo bien
  };

  // Retornamos el estado y la función para ser usado en componentes
  return {
    errores,         // objeto con campos con error
    mensajeError,    // mensaje de error general
    validar          // función para validar el formulario
  };
};
  