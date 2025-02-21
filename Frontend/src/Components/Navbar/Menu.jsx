import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../../auth/auth";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const usuario = localStorage.getItem("usuario");
  let newUser1 = null;
  let rol = null;
  const { logout } = useAuth();
  const navigate = useNavigate();
  if (usuario) {
    try {
      newUser1 = JSON.parse(usuario); // Convertir a objeto
      rol = newUser1?.rol || null; // Extraer el rol si existe
    } catch (error) {
      console.error("Error al analizar el JSON del usuario:", error);
    }
  } else {
    console.warn("No se encontró el usuario en el localStorage");
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <div
          style={{
            padding: "0 10px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Navbar.Brand href="/">
            Plataforma De Atención Domiciliaria
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {rol === "paciente" && (
                <>
                  <Nav.Link href="/tesis/#/calendario">Agendar Cita</Nav.Link>
                  <Nav.Link href="/tesis/#/atenciones">Mis Atenciones</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "right",
                      width: "100%",
                    }}
                  >
                    <Nav.Link href="/tesis/#/perfil">
                      {JSON.parse(usuario).nombre}
                    </Nav.Link>
                  </div>
                </>
              )}
              {rol === "especialista" && (
                <>
                  <Nav.Link href="/tesis/#/calendario">Mi Agenda</Nav.Link>
                  <Nav.Link href="/tesis/#/citas">Mis Citas</Nav.Link>
                  <Nav.Link href="/tesis/#/pacientes">Pacientes</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "right",
                      width: "100%",
                    }}
                  >
                    <Nav.Link href="/tesis/#/perfil">
                      {JSON.parse(usuario).nombre}
                    </Nav.Link>
                  </div>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
};
//export default Menu;
