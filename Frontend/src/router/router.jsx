import Login from '../Components/Login/Login.jsx'
import Registro from '../Components/Registro/Registro.jsx';
import { createBrowserRouter } from 'react-router-dom';
import Calendario from '../Components/Calendario/calendario.jsx';
import { AuthProvider } from '../auth/auth';
import PrivateRoute from '../Components/PrivateRoute/privateRoute.jsx';

const router= createBrowserRouter ([{
    path:"/",
    element:<Login/>
},{
    path:"/Registro",
    element:<Registro/>
},{
    path:"/Calendario",
    element:(<PrivateRoute>
        <Calendario></Calendario>
        </PrivateRoute>)
}])
//para proteger las rutas usar el componente <PrivateRoute>
//export default router;