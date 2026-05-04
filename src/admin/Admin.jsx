import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'
import '../style/PasswordInput.css'
const Admin = () => {
    // muestra la contraseña en texto plano o encriptada
    const [showPassword, setShowPassword] = useState(false)
    // usamos el hook useNavigate para redirigir al usuario a otra página después de iniciar sesión
    const navigate = useNavigate()
    // definimos el estado del error
    const [error, setError] = useState()
    // definimos el estado inicial del formulario
    // el estado inicial es un objeto con las propiedades usuario y password, ambas vacías
    const [form,setForm]=useState({
        usuario: '',
        password: ''
    })
    // manejamos el evento de cambio en los inputs del formulario
    // actualizamos el estado del formulario con el valor del input correspondiente
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    // manejamos el evento de envío del formulario
    // evitamos el comportamiento por defecto del formulario (recargar la página)
    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            // hacemos una petición POST a la API de login del administrador
            // enviamos el formulario como cuerpo de la petición en formato JSON
            const response= await fetch('http://localhost:5001/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            const data = await response.json()
            //
            if (response.ok) {
                // si inicia sesión correctamente, guardamos el id en el localStorage
                localStorage.setItem("adminId",data._id)
                console.log('Inicio de sesión exitoso')
                // redirigimos al usuario a la página de administración
                navigate('/paginaAdmin')
            }else {
                // si la respuesta no es ok, actualizamos el estado del error con el mensaje de error
                setError(data.message)
            }
        } catch (error) {
            // si hay un error en la petición, actualizamos el estado del error con el mensaje de error
            setError('Error en la petición',error)
        }
       
    }

  
  
  return (
    <div className='contenedor-admin'>
      <form onSubmit={handleSubmit} className='formulario-admin'>
        <h1>Iniciar Sesión</h1>
        <label htmlFor="usuario">
            Administrador
            <input type="text" placeholder='Administrador' name="usuario" value={form.usuario} onChange={handleChange}
        />
        </label>
        <label htmlFor="password" className='password-input-container'>
            Contraseña
            <input type={showPassword ? "text" : "password"} className='password-input' placeholder='Contraseña' name="password" value={form.password} onChange={handleChange}/>
            <i 
            // muestra la contraseña en texto plano o encriptada
            // cambia el icono de ojo abierto a ojo cerrado y viceversa
            className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`} 
            onClick={()=>setShowPassword(!showPassword)}
            ></i>
        </label>
        {/* el input de contraseña tiene un tipo password para ocultar el texto */}
        
        <p className='error-message'>{error}</p>
        <button type='submit'>Iniciar Sesión</button>
      </form>
    </div>
  )
}

export default Admin