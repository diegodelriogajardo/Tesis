import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/auth.jsx';
import Calendario from './Components/Calendario/calendario.jsx';
import Login from './Components/Login/Login.jsx';
import Registro from './Components/Registro/Registro.jsx';
import PrivateRoute from './Components/PrivateRoute/privateRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<h1>Holamundo</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          {/* Protegemos la ruta de Calendario con PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route path="/calendario" element={<Calendario />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
