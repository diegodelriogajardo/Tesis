// PrivateRoute.js
import { useNavigate,Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/auth';
import Login from '../Login/Login';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  //const navigate=useNavigate();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    console.log("No estoy autenticado")
    return <Login/>
  }
  console.log("Estoy autenticado")

  // Si está autenticado, renderiza las rutas hijas
  return <Outlet />;
};

export default PrivateRoute;
