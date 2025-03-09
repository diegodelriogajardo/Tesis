import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./home.css";
import fondo from "../../assets/backgroundmain.jpg";
const Home = () => {
  const navigate = useNavigate();
  const handleReservaClick = () => {
    navigate("/calendario");
  };
  const handleRegistrar = () => {
    navigate("/registro");
  };
  return (
    <Container
      fluid
      className="p-0 h-100"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        className="gradientePrimary text-white text-center py-5"
        style={{ display: "flex", padding: "0px 3rem" }}
      >
        <div style={{ alignSelf: "center", flexGrow: 1 }}>
          {/* Encabezado */}
          <h1>Bienvenidos a la Plataforma de Atención</h1>
          <p className="lead">
            Mejorando la calidad de vida de personas con dependencia moderada a
            severa
          </p>
        </div>
        <div style={{ justifySelf: "flex-end", alignSelf: "center" }}>
          <Button onClick={handleReservaClick} variant="secondary" size="lg">
            Ingresar
          </Button>
        </div>
      </div>

      <div
        style={{
          flexGrow: 1,
          background: `url(${fondo}) repeat fixed left top`,
        }}
      >
        {/* Sección de características */}
        <Container className="my-5 ">
          <Row className="text-center">
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Atención Personalizada</Card.Title>
                  <Card.Text>
                    Planes diseñados según las necesidades de cada persona para
                    garantizar su bienestar.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Equipo Multidisciplinario</Card.Title>
                  <Card.Text>
                    Profesionales capacitados en áreas de salud y cuidado
                    integral.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Agendamiento Fácil</Card.Title>
                  <Card.Text>
                    Reserva citas y seguimiento de atención de manera rápida y
                    sencilla.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Sección de llamado a la acción */}
        <div className="bg-light text-center py-5">
          <h2>¿Necesitas ayuda?</h2>
          <p className="mb-4">
            Contáctanos y encuentra la mejor solución para ti y tus seres
            queridos.
          </p>

          <Button onClick={handleRegistrar} variant="secondary" size="lg">
            Registrar
          </Button>
        </div>
      </div>
      {/* Pie de página */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-0">
          © 2024 Plataforma de Atención. Todos los derechos reservados.
        </p>
      </footer>
    </Container>
  );
};

export default Home;
