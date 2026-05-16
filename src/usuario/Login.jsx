import { useState, useRef } from 'react';
import axios from 'axios';
import "./Login.css";
import "../style/calendario.css"
import "../style/responsive.css"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { validateAuthor } from '../utils/validations/validateAuthor';
import { useFormValidation } from '../utils/validations/useFormValidation';
import { paises } from '../utils/utils_lists/paises';
import { provincias } from '../utils/utils_lists/provincias';
import { useUser } from '../context/UserContext';

function Login() {
    // 
    const apiUrl = import.meta.env.VITE_API_URL;

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

      //hasta top en caso clic
      useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);
    //
      const [loginInfo, setLoginInfo] = useState({
        username: '',
      });
      const loginPasswordRef = useRef(null);
      const handeleChangeLogin = (e)=>{
        const {name,value}=e.target;
        setLoginInfo({
          ...loginInfo,
          [name]: value
        });
        setLoginError(null);
      }

    //Función para LOGIN
    const handleIniciar = async (e) => {
        e.preventDefault();
        setLoginError(null);
        // Validar el formulario antes de enviar
        try {
            //quitar password si login
            const password = loginPasswordRef.current?.value || '';
            // token 不再保存在 localStorage，避免 XSS 时被前端 JS 直接读取。
            // 正确做法是让后端在登录成功后通过 Set-Cookie 写入 HttpOnly Cookie。
            const res = await axios.post(`${apiUrl}/login`, {
                email: loginInfo.email,
                password
            }, {
                // 允许浏览器接收后端设置的 Cookie，并在之后请求时自动携带 Cookie。
                withCredentials: true
            });
            if (res.status===200 && res.data.code === 1) {
                //si se ha iniciado sesión correctamente, guardar el usuario en el contexto
                setUser(res.data.data);
                //conseguir id con éxito
                setExisto(true);
                // 登录状态由后端的 HttpOnly Cookie 维持。
                // 这里的 user 只放在 React 内存状态里，用来渲染页面，不用来保存 token。
                //guardar en local storage en caso de que se haya iniciado sesión correctamente
            } else {
                setLoginError(res.data.msg);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setLoginError(error.data?.msg || "Error al iniciar sesión");
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
            const res = await axios.post(`${apiUrl}/register`, userInfo);
            if (res.code === 1) {
                setUserInfo({
                    username: '',
                    password: '',
                    dateBirth: null,
                    email:''
                });
                setRegistro("iniciar");
                setRegisterError(null);
            } else {
                setRegisterError(res.msg || "Error al registrar");
            }
        } catch (error) {
            setRegisterError(error.msg || "Error al registrar el usuario");
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
                            <label htmlFor="e-mail">
                                e-mail
                                <input className={loginError? "error-input" : ""} type="text" name='email' placeholder='E-Mail' value={loginInfo.email} onChange={handeleChangeLogin}
                                 required />
                            </label>
                            {/* campo de la contraseña */}
                            <label className='password-input-container'>
                                Contraseña
                                <input 
                                className={loginError? "error-input" : ""}
                                type={showPassword ? "text" : "password"}
                                name='password' placeholder='Contraseña' 
                                ref={loginPasswordRef}
                                autoComplete="current-password"
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
                            <input type={showPassword2?`text`:`password`} className={errores.password? "error-input" :""} name="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} autoComplete="new-password" required/>
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

export default Login; 
