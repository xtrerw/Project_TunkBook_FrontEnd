import React, { useState, useEffect } from 'react';
import './EditarInformacion.css'; // Asegúrate de tener este archivo CSS para estilos
import "../../style/calendario.css"; // Asegúrate de tener este archivo CSS para estilos del calendario
import DatePicker from 'react-datepicker'; // Si necesitas un selector de fecha más avanzado
import "react-datepicker/dist/react-datepicker.css"; // Estilos para el DatePicker
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es"; // Importa el locale español
import { paises } from '../../utils/paises';
import { provincias } from '../../utils/provincias'; // Importa la lista de provincias
import { validateEditarInformacion } from '../../utils/validateEditarInformacion'; // Importa la función de validación
import { useFormValidation } from '../../utils/useFormValidation';
//Wei123@
registerLocale("es", es); // Registra el locale español
const EditarInformacion = ({onSuccess,tipoUsuario}) => {
    //Si hay error      
    const { errores, mensajeError, validar } = useFormValidation(validateEditarInformacion);

  // Estado inicial del formulario con campos vacíos
const [formData, setFormData] = useState({
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  direccion: "",
  codigoPostal: "",
  provincia: "",
  pais: "España",
  nacionalidad: "",
  genero: "",
  email: "",
  tipo: tipoUsuario, // 
});

  // Cargar datos del usuario desde la API cuando el componente se monta
  useEffect(() => {
    const userId = localStorage.getItem("userId");
  
    // Si hay un userId en el localStorage, realiza la solicitud a la API
    
    if (userId) {
      fetch(`http://localhost:5001/autor/${userId}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.slice(0,10) : "",
            direccion: data.direccion || "",
            codigoPostal: data.codigoPostal || "",
            provincia: data.provincia || "",
            pais: "España", // Asignar España como país por defecto
            nacionalidad: data.nacionalidad || "",
            genero: data.genero || "",
            email: data.email || "",
            tipo: data.tipo || tipoUsuario || "autor"
          });
        })
        .catch(error => {
          console.error("Error al obtener datos del usuario:", error);
        });
    }
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const userId = localStorage.getItem("userId");
      
    // Validar el formulario antes de enviar
    const hayError = validar(formData); // Ejecuta la validación al cargar el componente
    if (hayError) return; // Si hay errores, no enviar el formulario
    // Si no hay errores, proceder a enviar los datos
    
    const { tipo, ...formDataSinTipo } = formData;

    if (userId) {
      // Realizar la solicitud PUT a la API para actualizar los datos del usuario
      fetch(`http://localhost:5001/autor/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        // Enviar los datos del formulario como JSON
        body: JSON.stringify(formDataSinTipo)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Datos actualizados:", data);
          if (onSuccess) {
            onSuccess(); // Llama a la función de éxito pasada como prop y actualiza el estado en el componente padre <MisDatos />
          }
        })
        .catch(error => {
          console.error("Error al actualizar datos:", error);
        });
    }
  };
  //convertirse en lector
  const handleConvertirse = () => {

      const hayError = validar(formData);
      if (hayError) {
        alert("Por favor, rellena todos los campos obligatorios antes de convertirte.");
        return;
      }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No se encontró el userId en localStorage");
      return;
    }

    fetch("http://localhost:5001/autor/convertirse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    })
      .then(async res => {
        if (res.ok) {
          alert("Registro con exito")
          return res.json();
        } else {
          const errorData = await res.json();
          //sale error para catch conseguirlo
          throw new Error(errorData.mensaje || "Registro fallado");
        }
      })
      .catch(err => {
        alert("Error: " + err.message);
      });
  };
  return (
    <div className="editar-informacion">
      <h1>Editar Información</h1>
      <form className="editar-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nombre:
            {/* Campo de nombre con clase de error condicional */}
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errores.nombre ? "error-input" : ""}
            />
          </label>

          <label>
            Apellido:
            {/* Campo de apellido con clase de error condicional */}
            <input
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={errores.apellido ? "error-input" : ""}
            />
          </label>

          <label>
            genero:
            {/* Selector de género con clase de error condicional */}
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className={errores.genero ? "error-input" : ""}
            >
              <option value="">-- Selecciona tu género --</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Fecha de Nacimiento:
            {/* DatePicker con clase de error condicional */}
            <DatePicker
              locale="es"
              selected={
                // muestra la fecha de nacimiento anteriormente guardada
                // o null si no hay fecha guardada
                formData.fechaNacimiento
                  ? new Date(formData.fechaNacimiento)
                  : null
              }
              onChange={(date) => {
                setFormData({
                  ...formData,
                  // Convertir la fecha de nacimiento a formato ISO
                  fechaNacimiento: date
                    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                    : ""
                });
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              // Añadir clase de error condicional
              className={`input-text ${errores.fechaNacimiento ? "error-input" : ""}`}
              calendarClassName="custom-calendar"
              dayClassName={() => "custom-day"}
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(2007, 11, 31)}
              renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => {
                const years = Array.from({ length: 2007 - 1900 + 1 }, (_, i) => 1900 + i);
                const months = [
                  "enero", "febrero", "marzo", "abril", "mayo", "junio",
                  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
                ];
                return (
                  <div className="custom-header">
                    {/* Año y mes seleccionables */}
                    <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(parseInt(value))}>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <select value={date.getMonth()} onChange={({ target: { value } }) => changeMonth(parseInt(value))}>
                      {months.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                );
              }}
            />
          </label>

          <label>
            Nacionalidad:
            {/* Selector de nacionalidad con clase de error condicional */}
            <select
              name="nacionalidad"
              value={formData.nacionalidad}
              onChange={handleChange}
              className={errores.nacionalidad ? "error-input" : ""}
            >
              <option value="">-- Selecciona un país --</option>
              {paises.map((pais, index) => (
                <option key={index} value={pais}>{pais}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Provincia:
            {/* Campo de provincia con clase de error condicional */}
            <select
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className={errores.provincia ? "error-input" : ""}
            >
              <option value="">-- Selecciona una provincia --</option>
              {provincias.map((provincia, index) => (
                <option key={index} value={provincia}>{provincia}</option>
              ))}
            </select>
          </label>

          <label>
            País:
            {/* Campo de país con clase de error condicional */}
            <input
              name="pais"
              value={"España"}
              onChange={handleChange}
              className={errores.pais ? "error-input" : ""}
              disabled
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Dirección:
            {/* Campo de dirección con clase de error condicional */}
            <input
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={errores.direccion ? "error-input" : ""}
            />
          </label>

          <label>
            Código Postal:
            {/* Campo de código postal con clase de error condicional */}
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
              className={errores.codigoPostal ? "error-input" : ""}
            />
          </label>
        </div>

        <div className="form-row-full">
          <label>
            Email:
            {/* Campo de email con clase de error condicional */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errores.email ? "error-input" : ""}
            />
          </label>
        </div>

        {/* Mensaje general de error */}
        {mensajeError && (
          <div className="error-message">{mensajeError}</div>
        )}
        {/* btns */}
        <div className='btns-editar'>
          {/* Bóton convertirse */}
          <button type="button" className='convertir-btn' onClick={handleConvertirse}>Convertirse en lector</button>
          {/* Botón para enviar el formulario */}
          <button type="submit" className="guardar-btn">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}

export default EditarInformacion;