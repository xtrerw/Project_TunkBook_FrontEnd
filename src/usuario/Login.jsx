import { useState } from 'react';
import "./Login.css";
import "../style/calendario.css"
import "../style/responsive.css"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { validateAuthor } from '../utils/validateAuthor';
import { useFormValidation } from '../utils/useFormValidation';
import { paises } from '../utils/paises';
import { provincias } from '../utils/provincias';
import { useUser } from '../context/UserContext';
function Author() {
    //error para iniciar sesión y registro
    const [loginError, setLoginError] = useState(null);
    const [registerError, setRegisterError] = useState(null);

    //usar el contexto de usuario
    const {user, setUser } = useUser();
    //muestra la contraseña en texto plano o encriptada
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    //validar el formulario
    const { errores, mensajeError, validar } = useFormValidation(validateAuthor);
    
    //Importar useNavigate para navegar a la página de MisDatos
    const navigate = useNavigate();
    //Variables para registro de autor
    const [actionRegistro, setRegistro] = useState("iniciar");
    //Variables para controlar el estado de registro y éxito
    const [isExito, setExisto] = useState(false);
    //Variable id para navegar al autor correspondiente
    const [id,setId]=useState()

      //hasta top en caso clic
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);
    //
      const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: '',
      });
      const handeleChangeLogin = (e)=>{
        const {name,value}=e.target;
        setLoginInfo({
          ...loginInfo,
          [name]: value
        });
        setLoginError(null);
      }

    //Función para iniciar sesión del autor
    const handleIniciar = async (e) => {
        e.preventDefault();
        setLoginError(null);
        // Validar el formulario antes de enviar
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: loginInfo.username, password: loginInfo.password }),
            });
            const res = await response.json();
            if (response.ok && res.code === 1  && res.data) {
                console.log(res + " con éxito");
                //si se ha iniciado sesión correctamente, guardar el usuario en el contexto
                setUser(res.data);
                //conseguir id con éxito
                setId(res._id)
                setExisto(true);
                //guardar en local storage en caso de que se haya iniciado sesión correctamente
                localStorage.setItem("loggedInUser", JSON.stringify(res));
                localStorage.setItem("userId", res._id);
            }else{
                setLoginError(res.msg);
                //si no se ha iniciado sesión, mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.msg);
            setLoginError("Error iniciar Sesión " + error.msg);
      }
    };
    //Función para manejar el registro del autor
    //se usa para guardar la información del autor
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
        dateBirth: null,
        email:'',
    });
    //vaciar el formulario de registro
    const switchToRegistro = () => {
        //cambio de iniciar sesión a registro
        setRegistro("registro");
        setLoginError(null);
        setRegisterError(null);
        setUserInfo({
            username: '',
            password: '',
            dateBirth: null,
            email:''
        });
    };
    // vaciar el formulario de iniciar sesión
    const switchToIniciar = () => {
        //cambio de iniciar sesión a registro
        setRegistro("iniciar");
        setLoginError(null);
        setRegisterError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
        setLoginError(null);
    };

    //registrar
    const handleRegister = async (e) => {
        e.preventDefault();
        // Validar el formulario antes de enviar
        const errorAutor=validar(userInfo)
        setLoginError(null);
        //si hay error, mostrar mensaje de error
        if(errorAutor) return;

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });
            const data = await response.json();
            if (response.ok) {
                //
                setUserInfo({
                    username: '',
                    password: '',
                    dateBirth: null,
                    email:''
                });
                setRegistro("iniciar");
            }else{
                setRegisterError(data.message);
                //si no se ha registrado, mostrar mensaje de error
            }
        } catch (error) {
            //si no se ha registrado, mostrar mensaje de error
            setRegisterError("Error al registrar el usuario: " + error.message);
        }
    };
    // si el registro es exitoso, navegar a la página de registro
    useEffect(() => {
        if (user !== null && isExito === true) {
            navigate('/');
        }
    }, [user, isExito, navigate]);

    return (
        <>
        {/* si inciciar sesión son éxito */}
                <div className='form-iniciar'>
                    <div className='form-iniciar-img'></div>
                    {actionRegistro === "iniciar" ? (
                        //Formulario para iniciar sesión
                        <form onSubmit={handleIniciar}>
                            <h2>Iniciar Sesión</h2>
                            {/* campo de la información de autor */}
                            <label htmlFor="username">
                                Usuario
                                <input className={loginError? "error-input" : ""} type="text" name='username' placeholder='Username' value={loginInfo.username} onChange={handeleChangeLogin}
                                 required />
                            </label>
                            {/* campo de la contraseña */}
                            <label className='password-input-container'>
                                Contraseña
                                <input 
                                className={loginError? "error-input" : ""}
                                type={showPassword ? "text" : "password"}
                                name='password' placeholder='Contraseña' 
                                value={loginInfo.password} 
                                onChange={handeleChangeLogin} 
                                required />
                                <i
                                // muestra la contraseña en texto plano o encriptada
                                // cambia el icono de ojo abierto a ojo cerrado y viceversa
                                className={`bx ${showPassword ? 'bx-eye-big' : 'bx-eye-closed'}`} 
                                onClick={()=>setShowPassword(!showPassword)}
                                ></i>
                            </label>
                            {/* Mensaje de error al iniciar sesión */}
                            <div className="error-message">{loginError}</div>
                            <div className='buttones'>
                                <button type="submit">Iniciar Sesión</button>
                                 <p style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontSize: "14px",
                                    textAlign: "center",
                                    fontWeight: "400",
                                }} onClick={() => {switchToRegistro()}}>¿Aún no tienes una cuenta? Regístrate</p>
                            </div>
                        </form>
                    ) : actionRegistro === "registro" ? (
                        //Formulario para registro
                        <form onSubmit={handleRegister} className='form-registro'>
                            <h2>Registrar</h2>
                            {/* campo de la información de persona */}
                            Correo electrónico
                            <input type="email" name="email"  className={errores.email? "error-input" : ""} placeholder="Correo electrónico" value={userInfo.email} onChange={handleInputChange} required/>
                            Nombre de usuario
                            <input type="text" name="username"  className={errores.username ? "error-input" : ""}placeholder="Username" value={userInfo.username} onChange={handleInputChange} required/>
                                {/* fecha nacimiento */}
                                Fecha de nacimiento
                                <DatePicker
                                    locale="es"
                                    selected={userInfo.dateBirth}
                                    onChange={(date) => {
                                    setUserInfo({
                                        ...userInfo,
                                        dateBirth: date,
                                        });
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Fecha de nacimiento"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    // Añadir clase de error condicional
                                    className={`registro-input-text ${errores.dateBirth ? "error-input" : ""}`}
                                    calendarClassName="custom-calendar"
                                    dayClassName={() => "custom-day"}
                                    minDate={new Date(1900, 0, 1)}
                                    maxDate={new Date(
                                        new Date().getFullYear()-12,
                                        new Date().getMonth(),
                                        new Date().getDate(),
                                    )}
                                    renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth }) => {
                                    const years = Array.from({ length: new Date().getFullYear() - 12 - 1900 + 1 }, (_, i) => 1900 + i);
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
                            <label className='password-input-container'>
                            Contraseña
                            <input type={showPassword2?`text`:`password`} className={errores.password? "error-input" :""} name="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} required/>
                            <i
                                // muestra la contraseña en texto plano o encriptada
                                // cambia el icono de ojo abierto a ojo cerrado y viceversa
                                className={`bx ${showPassword2 ? 'bx-eye-big' : 'bx-eye-closed'}`} 
                                onClick={()=>setShowPassword2(!showPassword2)}
                                ></i>  
                            </label>
                            {/* Mensaje general de error */}
                            <div className="error-message">{mensajeError || registerError}</div>

                            <div className='buttones'>
                                {/* botón de registro */}
                                <button type="submit">Registrar</button>
                                 <p style={{
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontWeight: "400",
                                }} onClick={() => {switchToIniciar()}}>¿ Ya tengo una cuenta ?</p>
                            </div>
                        </form>
                    ) : null}
                </div>
        </>
    );
}

export default Author; 