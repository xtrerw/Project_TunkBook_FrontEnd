// validateCategoria.js
export const validateCategoria = ({ nombre, colleccion }) => {
    // Validar nombre: obligatorio y sin números ni símbolos
    if (!nombre.trim()) {
        return { campo: "nombre", mensaje: "El nombre es obligatorio." };
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(nombre)) {
        return { campo: "nombre", mensaje: "El nombre no puede contener números ni símbolos." };
    }

    // Validar campo colleccion

    // Verifica que no esté vacío
    if (!colleccion.trim()) {
    return { campo: "colleccion", mensaje: "Debe ingresar al menos una subcategoría." };
    }

    // Divide la cadena por comas y elimina espacios
    const partes = colleccion.split(',').map(s => s.trim()).filter(Boolean);

    // Verifica que haya al menos una subcategoría válida
    if (partes.length === 0) {
    return { campo: "colleccion", mensaje: "Debe ingresar subcategorías separadas por comas." };
    }

    // Verifica que cada subcategoría solo tenga letras y espacios
    for (let parte of partes) {
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(parte)) {
        return {
        campo: "colleccion",
        mensaje: `La subcategoría "${parte}" contiene caracteres inválidos.`,
        };
    }
    }

  return null; // sin errores
};
