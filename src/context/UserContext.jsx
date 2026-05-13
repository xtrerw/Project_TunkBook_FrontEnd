// src/context/UserContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Crear el contexto
const UserContext = createContext();

// Crear el proveedor del contexto
export const UserProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        // 页面刷新后 React 内存里的 user 会丢失。
        // actualizar pagina,evitar quitar user
        // 这里请求后端当前用户接口，浏览器会自动带上 HttpOnly Cookie。
        const res = await axios.get(`${apiUrl}/auth/check`, {
          withCredentials: true,
        });
        // devolver infor de user
        setUser(res.data.data);
        
      } catch (error) {
        // si no hay Cookie por caducidacion, login con error,set null   
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    restoreUser();
  }, [apiUrl]);

  useEffect(() => {
  console.log("User changed:", user);
}, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useUser = () => useContext(UserContext);
