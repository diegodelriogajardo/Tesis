import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/auth.jsx';
import Calendario from './Components/Calendario/calendario.jsx';
import Login from './Components/Login/Login.jsx';
import Registro from './Components/Registro/Registro.jsx';
import PrivateRoute from './Components/PrivateRoute/privateRoute.jsx';
import Home from './Components/Home/home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Atenciones from './Components/Atenciones/atenciones.jsx';
import Perfil from './Components/Perfil/perfil.jsx'
import Citas from './Components/Citas/citas.jsx';
import FinalizarAtencion from './Components/FinalizarAtencion/FinalizarAtencion.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          {/* Protegemos la ruta de Calendario con PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/atenciones" element={<Atenciones />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/finalizarAtencion" element={<FinalizarAtencion />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
