import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useAuth } from "../../auth/auth";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
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
    <div className="gradientePrimary text-white text-center ">
      <Navbar expand="lg" className="mb-4">
        <div
          style={{
            padding: "0 10px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Navbar.Brand href="/tesis/">
            Plataforma De Atención Domiciliaria
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {rol === "paciente" && (
                <>
                  <ButtonLink href="/tesis/#/calendario">
                    <i class="bi bi-calendar"></i>
                    <span>Agendar Cita</span>
                  </ButtonLink>
                  <ButtonLink href="/tesis/#/atenciones">
                    <i class="bi bi-journal-text"></i>
                    <span>Mis Atenciones</span>
                  </ButtonLink>
                  <ButtonLink onClick={handleLogout}>
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Cerrar Sesión</span>
                  </ButtonLink>
                  <div className="perfil-container">
                    <ButtonLink href="/tesis/#/perfil">
                      <i className="bi bi-person"></i>
                      {JSON.parse(usuario).nombre}
                    </ButtonLink>
                  </div>
                </>
              )}
              {rol === "especialista" && (
                <>
                  <ButtonLink href="/tesis/#/calendario">
                    <i class="bi bi-calendar"></i>
                    <span>Mi Agenda</span>
                  </ButtonLink>
                  <ButtonLink href="/tesis/#/citas">
                    <i class="bi bi-journal-text"></i>
                    <span>Mis Citas</span>
                  </ButtonLink>
                  <ButtonLink href="/tesis/#/pacientes">
                    <i class="bi bi-people"></i>
                    <span>Pacientes</span>
                  </ButtonLink>
                  <ButtonLink onClick={handleLogout}>
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Cerrar Sesión</span>
                  </ButtonLink>
                  <div className="perfil-container">
                    <ButtonLink href="/tesis/#/perfil">
                      <i className="bi bi-person"></i>
                      {JSON.parse(usuario).nombre}
                    </ButtonLink>
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

const ButtonLink = ({ children, ...props }) => {
  return (
    <div
      style={{
        padding: "0 10px",
        border: "1px solid black",
        boxShadow: "0 0 5px rgba(0,0,0,0.5)",
        opacity: "0.8",
        borderRadius: "5px",
        margin: "0 5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Nav.Link
        {...props}
        style={{ gap: "10px", display: "flex", alignItems: "center" }}
      >
        {children}
      </Nav.Link>
    </div>
  );
};
//export default Menu;
