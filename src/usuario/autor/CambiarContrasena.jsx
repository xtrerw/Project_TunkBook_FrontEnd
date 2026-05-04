import React from 'react'
import { useEffect,useState } from 'react'
import './CambiarContrasena.css'
import { validatePassword } from '../../utils/validatePassword'
const CambiarContrasena = () => {
  // Estado para mostrar/ocultar la contraseña
  const [showPasswordAnterior, setShowPasswordAnterior] = useState(false); // Estado para mostrar/ocultar la contraseña anterior
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [confirmaPassword, setConfirmaPassword] = useState(false); // Estado para mostrar/ocultar la contraseña confirmada
  // Estado inicial del formulario de contraseña nueva con campos vacíos
  const [formData, setFormData] = useState({
    nuevaContrasena: "",
    confirmaPassword: ""
  });

  //Si hay error
   const [error, setError] = useState(false);
  // Contenido de error de contraseña
  const [errorPassword, setErrorPassword] = useState();
const [esExito, setEsExito] = useState(false);
  // Manejar cambios en los inputs del formulario de contraseña nueva
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar el envío del formulario de contraseña nueva
  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const userId = localStorage.getItem("userId");
    console.log("userId", userId);
    
    // Validar que la nueva contraseña y la confirmación coincidan
    const errorPassword = validatePassword(formData.nuevaContrasena, formData.confirmaPassword);
    if (errorPassword) {
      setError(true);
      setErrorPassword(errorPassword);
      setEsExito(false);
      return;
    }

    if (userId) {
      fetch(`http://localhost:5001/autor/password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contrasena: formData.nuevaContrasena
        })
      })
      .then(response => response.json())
      .then(data => {
        setError(false);
        // Aquí puedes manejar la respuesta del servidor después de actualizar la contraseña
        setErrorPassword("Contraseña actualizada:", data);
        setEsExito(true);
      })
      .catch(error => {
        setError(true);
        setErrorPassword("Error al actualizar la contraseña:", error);
        setEsExito(false);
      });
    }
  };
  
  // Si hay un error en el formulario de contraseña anterior
  const [isErrorAnterior, setIsErrorAnterior] = useState(false);
  // Contenido de error de contraseña anterior
  const [errorAnterior, setErrorAnterior] = useState("");
  // Estado inicial del formulario de contraseña anterior con campos vacíos
  const [formDataAnterior, setFormDataAnterior] = useState({
    contrasenaAnterior: ""
  });
  // Manejar cambios en los inputs del formulario de contraseña anterior
  const handleChangeAnterior = (e) => {
    setFormDataAnterior({
      ...formDataAnterior,
      [e.target.name]: e.target.value
    });
  };
  // Manejar el envío del formulario de contraseña anterior
  const handleSubmitAnterior = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const userId = localStorage.getItem("userId");
    console.log("userId", userId);

    if (userId) {
      fetch(`http://localhost:5001/autor/password/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contrasena: formDataAnterior.contrasenaAnterior
        })
      })
      .then(response => 
        {
          // conseguir la respuesta del servidor y convertirla a json
          const data = response.json();
          if (!response.ok) {
            // Si la respuesta no es correcta, se considera un error
            // Aquí puedes manejar el error de la respuesta
            setIsErrorAnterior(true);
            setErrorAnterior(data.message || "Contraseña incorrecta");
          } else {
            // Si la respuesta es correcta, se considera un éxito
            // Aquí puedes manejar el éxito de la respuesta
            setIsErrorAnterior(false);
            setErrorAnterior(data.message || "Contraseña correcta");
          }
        }
      )
      .catch(error => {
        setIsErrorAnterior(true);
        setErrorAnterior(`${error.message}`);
        console.log(error);
      });
    }
  }


  return (
    <div className="editar-informacion">
      <h1>Cambiar Contraseña</h1>
      {/* formulario de introducir contraseña anterior */}
      {
        errorAnterior=== "Contraseña correcta" ?
        (
          // formulario de introducir nueva contraseña
          <form className="editar-form" onSubmit={handleSubmit}>
            <div className='cambiar-password-container'>
              <label className='cambiar-password'>
                  Nueva Contraseña:
                  <input 
                  className={error? "error-input": ""} 
                  name="nuevaContrasena" 
                  type={showPassword ? "text" : "password"} 
                  value={formData.nuevaContrasena} 
                  onChange={handleChange} 
                  placeholder="Escribe tu nueva contraseña"
                  />
                  <i
                    // muestra la contraseña en texto plano o encriptada
                    // cambia el icono de ojo abierto a ojo cerrado y viceversa
                    className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} 
                    onClick={()=>setShowPassword(!showPassword)}
                    ></i>
                </label>
                <label className='cambiar-password'>
                  Confirma Contraseña:
                  <input 
                  className={error? "error-input": ""} 
                  name="confirmaPassword" 
                  type={confirmaPassword ? "text" : "password"} 
                  value={formData.confirmaPassword} 
                  onChange={handleChange} 
                  placeholder="Confirma tu nueva contraseña"
                  />
                  <i
                    // muestra la contraseña en texto plano o encriptada
                    // cambia el icono de ojo abierto a ojo cerrado y viceversa
                    className={`bx ${confirmaPassword ? 'bx-show' : 'bx-hide'}`} 
                    onClick={()=>setConfirmaPassword(!confirmaPassword)}
                    ></i>
                </label>
            </div>
            <div className={esExito ? "success-message" : "error-message"}>
              {errorPassword}
            </div>
            <button type="submit" className="guardar-btn">Cambiar Contraseña</button>
          </form>
        ):(
        // formulario de introducir contraseña anterior
        <form className="editar-form" onSubmit={handleSubmitAnterior}>
          <div className='cambiar-password-container'>
            <label className='cambiar-password'>
                Contraseña Anterior:
                <input 
                className={error? "error-input": ""} 
                name="contrasenaAnterior" 
                type={showPasswordAnterior ? "text" : "password"} 
                value={formDataAnterior.contrasenaAnterior} onChange={handleChangeAnterior} 
                placeholder="Escribe tu contraseña anterior"
                />
                <i
                  // muestra la contraseña en texto plano o encriptada
                  // cambia el icono de ojo abierto a ojo cerrado y viceversa
                  className={`bx ${showPasswordAnterior ? 'bx-show' : 'bx-hide'}`} 
                  onClick={()=>setShowPasswordAnterior(!showPasswordAnterior)}
                  ></i>
              </label>
          </div>
          <div className={isErrorAnterior? "error-message":"exito"}>{errorAnterior}</div>
          <button type="submit" className="guardar-btn">Siguiente</button>
        </form>
        )
      }
      
      
    </div>
  )
}

export default CambiarContrasena

