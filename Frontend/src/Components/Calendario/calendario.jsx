import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../api/axios";
import { useAuth } from "../../auth/auth";
import { Container, Nav, Button, Form, FormSelect, Row, Col } from "react-bootstrap";

import './calendario.css'
import { Menu } from "../Navbar/Menu";

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const usuario = localStorage.getItem("usuario");
  let newUser1 = null;
  let rol = null;

if (usuario) {
  try {
    newUser1 = JSON.parse(usuario); // Convertir a objeto
    rol = newUser1?.rol || null;   // Extraer el rol si existe
  } catch (error) {
    console.error("Error al analizar el JSON del usuario:", error);
  }
} else {
  console.warn("No se encontró el usuario en el localStorage");
}
  const newUser = JSON.parse(usuario);

  useEffect(() => {
    const fetchDoctorsAndAppointments = async () => {
      try {
        const response = await api.get("/usuario", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && response.data.length > 0) {
          const specialists = response.data.filter((user) => user.especialidad);
          setDoctors(specialists);

          if (specialists.length > 0) {
            setSelectedDoctor(specialists[0]);
          }
        }

        const appointmentsResponse = await api.get("/citas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (appointmentsResponse.data) {
          const mappedAppointments = appointmentsResponse.data.map((cita) => ({
            start: new Date(cita.fecha_cita),
            end: moment(new Date(cita.fecha_cita)).add(1, "hour").toDate(),
            title: cita.title,
            id_especialista: cita.id_especialista,
            id_paciente: cita.id_paciente,
          }));

          setPatientAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDoctorsAndAppointments();
  }, []);

  const handleBookAppointment = async ({ start }) => {
    if (!selectedDoctor) {
      alert("Seleccione un especialista antes de reservar una cita.");
      return;
    }

    const endForzado = moment(start).add(1, "hour").toDate();
    const isTimeAvailable = !patientAppointments.some(
      (appointment) =>
        appointment.id_especialista === selectedDoctor.id_usuario &&
        moment(start).isSame(appointment.start)
    );

    if (!isTimeAvailable) {
      alert("El horario seleccionado ya está reservado.");
      return;
    }

    const title = window.prompt("Ingrese su nombre para la cita:");
    if (title) {
      const appointment = {
        start,
        end: endForzado,
        title: `Cita: ${title}`,
        id_especialista: selectedDoctor.id_usuario,
        id_paciente: newUser.id_usuario,
      };

      setPatientAppointments((prev) => [...prev, appointment]);

      try {
        await api.post(
          "/citas",
          {
            id_paciente: newUser.id_usuario,
            id_especialista: selectedDoctor.id_usuario,
            fecha_cita: appointment.start.toISOString(),
            estado: "Creado",
            title: appointment.title,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (err) {
        console.error("Ocurrió un problema:", err);
      }
    }
  };

  const displayedEvents = patientAppointments.filter(
    (appointment) => appointment.id_especialista === (selectedDoctor?.id_usuario || null)
  );

  return (
    <Container fluid className="calendario px-0">
  {/* Navbar */}
   <Menu/> 
  {/* Main Content */}
  <div className="d-flex mb-4 justify-content-center">


    <Col md={6} sm={12}>
      <h3 className="text-center mb-4">Seleccione un Especialista</h3>
      <Form>
        <Form.Group>
          <FormSelect
            value={selectedDoctor?.id_usuario || ""}
            onChange={(e) =>
              setSelectedDoctor(
                doctors.find((doc) => doc.id_usuario === parseInt(e.target.value))
              )
            }
          >
            {doctors.map((doctor) => (
              <option key={doctor.id_usuario} value={doctor.id_usuario}>
                {doctor.nombre}
              </option>
            ))}
          </FormSelect>
        </Form.Group>
      </Form>
    </Col>
 


  </div>
<div className="d-flex">

    <Col>
      <h3 className="mb-4">Calendario de Citas</h3>
      <div  style={{ height: "80vh", padding:"12px" }}>
        <Calendar
          localizer={localizer}
          events={displayedEvents}
          startAccessor="start"
          endAccessor="end"
          selectable={true}
          onSelectSlot={handleBookAppointment}
          style={{ height: 500 }}
          min={moment()
            .set({ hours: 8, minutes: 0, seconds: 0, milliseconds: 0 })
            .toDate()}
          max={moment()
            .set({ hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })
            .toDate()}
          views={["week", "day", "agenda"]}
          defaultView={Views.WEEK}
          step={60}
          timeslots={1}
        />
      </div>
    </Col>


</div>
</Container>

  );
};

export default Calendario;
