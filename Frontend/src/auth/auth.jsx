import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un token en el localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica el JWT
        console.log("decodeToken",decodedToken)
        console.log(Date.now())
        // Verifica si el token no ha expirado
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true)

          console.log("dentro de la sentencia if",isAuthenticated)
          setUser(decodedToken); // Guarda la información del usuario
          console.log(user)
        } else {
          localStorage.removeItem('token'); // Elimina el token si está expirado
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false); // Si no hay token, el usuario no está autenticado
    }
  }, [isAuthenticated]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    setUser(decodedToken);
    setIsAuthenticated(true);
    datosUsuarioLogeado();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUser(null);
  };

  const obtenerRol=()=>{
    const rol=user.role;
    console.log(user)
    return rol;
  }

  const datosUsuarioLogeado=async()=>{
    const id=user.userId;
    try{
      const usuario= await api.get(`/usuario/${id}`);
      const newUser= usuario.data;
      delete newUser.password;//para borrar un dato del data.json
      localStorage.setItem('usuario',JSON.stringify(newUser));
    }catch(err){
      console.log("error",err);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout,obtenerRol }}>
      {children}
    </AuthContext.Provider>
  );
};
