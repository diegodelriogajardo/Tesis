import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import Swal from "sweetalert2";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../api/axios";
import {
  Container,
  Form,
  FormSelect,
  Col,
  Modal,
  Button,
} from "react-bootstrap";
import { Menu } from "../Navbar/Menu";
import { useLocation } from "react-router-dom";
moment.locale("es");
const localizer = momentLocalizer(moment);
const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  showMore: (total) => `+ Ver más (${total})`,
};
const Calendario = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const location = useLocation();
  const { id_paciente, id_cita_anterior } = location.state;
  useEffect(() => {
    const fetchDoctorsAndAppointments = async () => {
      try {
        const response = await api.get("/usuario", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const specialists = response.data.filter(
          (user) => user.rol == "especialista" && user.id_usuario != id_paciente
        );
        setDoctors(specialists);
        if (specialists.length > 0) {
          setSelectedDoctor(specialists[0]);
        }

        const appointmentsResponse = await api.get("/citas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        llenarCalendario(appointmentsResponse.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDoctorsAndAppointments();
  }, []);

  const llenarCalendario = (appoimets) => {
    const mappedAppointments = appoimets.map((cita) => ({
      start: new Date(cita.fecha_cita),
      end: moment(new Date(cita.fecha_cita)).add(1, "hour").toDate(),
      title: cita.title,
      id_especialista: cita.id_especialista,
      id_paciente: cita.id_paciente,
    }));

    setPatientAppointments(mappedAppointments);
  };
  const handleBookAppointment = async () => {
    if (!patientName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe ingresar un nombre válido.",
      });
      return;
    }

    const endForzado = moment(selectedSlot.start).add(1, "hour").toDate();
    const appointment = {
      start: selectedSlot.start,
      end: endForzado,
      title: `Derivacion: ${patientName}`,
      id_especialista: selectedDoctor.id_usuario,
      id_paciente: id_paciente,
    };

    setPatientAppointments((prev) => [...prev, appointment]);

    try {
      await api.post(
        "/citas",
        {
          id_paciente: id_paciente,
          id_especialista: selectedDoctor.id_usuario,
          fecha_cita: appointment.start.toISOString(),
          estado: "Creado",
          title: appointment.title,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      //cambiar estado de cita anterior

      await api.put(
        `/citas/terminar/${id_cita_anterior}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire(
        "Cita reservada",
        "Su cita ha sido registrada con éxito.",
        "success"
      );
      navigate("/citas"); // Redirige a /citas cuando el proceso termine
    } catch (err) {
      console.error("Ocurrió un problema:", err);
    }

    setShowModal(false);
    setPatientName("");
  };
  const slotpropgetter = (date) => {
    const fechaActualAjustada = moment(date);
    const isPastDate = fechaActualAjustada.isBefore(moment(), "hour");
    let isInaccess =
      fechaActualAjustada.hour() > 16 ||
      fechaActualAjustada.hour() < 8 ||
      fechaActualAjustada.day() === 0;

    if (fechaActualAjustada.day() === 6) {
      // si es sabado
      isInaccess =
        fechaActualAjustada.hour() < 8 ||
        fechaActualAjustada.hour() > 14 ||
        isInaccess;
    }

    if (isPastDate || isInaccess) {
      return {
        className: "past-day",
        style: {
          backgroundColor: "rgba(180, 180, 180, 0.7)",
          opacity: 0.5,
        },
      };
    }
    return {};
  };

  const handleSlotSelection = ({ start }) => {
    const fechaSeleccionada = moment(start);
    if (fechaSeleccionada < moment()) return;
    if (fechaSeleccionada.hour() > 16 || fechaSeleccionada.hour() < 8) return;

    if (fechaSeleccionada.day() === 6) {
      if (fechaSeleccionada.hour() > 14) return;
    }
    if (fechaSeleccionada.day() === 0) return;
    if (!selectedDoctor) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Seleccione un especialista antes de reservar una cita.",
      });
      return;
    }

    const isTimeAvailable = !patientAppointments.some(
      (appointment) =>
        appointment.id_especialista === selectedDoctor.id_usuario &&
        moment(start).isSame(appointment.start)
    );

    if (!isTimeAvailable) {
      Swal.fire({
        icon: "info",
        title: "Horario no disponible",
        text: "El horario seleccionado ya está reservado.",
      });
      return;
    }

    const yaReservado = patientAppointments.some(
      (appointment) =>
        appointment.id_paciente === id_paciente &&
        fechaSeleccionada.isSame(moment(appointment.start).startOf("minute"))
    );

    if (yaReservado) {
      let citayaresevada = patientAppointments.find(
        (appointment) =>
          appointment.id_paciente === id_paciente &&
          fechaSeleccionada.isSame(moment(appointment.start).startOf("minute"))
      );
      let doctorconcita = doctors.find(
        (doc) => doc.id_usuario === citayaresevada.id_especialista
      );
      Swal.fire({
        icon: "info",
        title: doctorconcita
          ? `Paciente con cita, doctor ${doctorconcita.nombre}`
          : "paciente con cita reservada",
        text: doctorconcita
          ? ` el ${fechaSeleccionada.format("DD-MM-yy HH:mm")}`
          : "Solo puede tener una cita a la vez.",
      });
      return;
    }

    setSelectedSlot({ start });
    setShowModal(true);
  };

  const handleEventSelection = (event) => {
    Swal.fire({
      icon: "info",
      title: "Cita reservada",
      text: `Esta cita ya está reservada: ${event.title}`,
    });
  };
  var displayedEvents = patientAppointments;

  displayedEvents = patientAppointments.filter(
    (appointment) =>
      appointment.id_especialista === (selectedDoctor?.id_usuario || null)
  );

  const mostrarSelect = () => {
    // Ocultar si hay solo un médico
    return doctors.length > 1;
  };

  return (
    <Container fluid className="calendario px-0">
      {/* Navbar */}
      <Menu />
      <div className="d-flex mb-4 justify-content-center">
        <Col md={6} sm={12}>
          {!mostrarSelect() && (
            <h3 className="text-center mb-4">
              {doctors.length == 1 ? doctors[0].nombre : ""}
            </h3>
          )}
          {mostrarSelect() && (
            <>
              <h3 className="text-center mb-4">Seleccione un Especialista</h3>
              <Form>
                <Form.Group>
                  <FormSelect
                    value={selectedDoctor?.id_usuario || ""}
                    onChange={(e) =>
                      setSelectedDoctor(
                        doctors.find(
                          (doc) => doc.id_usuario === parseInt(e.target.value)
                        )
                      )
                    }
                  >
                    {doctors.map((doctor) => (
                      <option key={doctor.id_usuario} value={doctor.id_usuario}>
                        {`${doctor.nombre} - ${doctor.especialidad}`}
                      </option>
                    ))}
                  </FormSelect>
                </Form.Group>
              </Form>
            </>
          )}
        </Col>
      </div>
      <div className="d-flex">
        <Col>
          <h3 className="mb-4">Calendario de Citas</h3>
          <div style={{ height: "80vh", padding: "12px" }}>
            <Calendar
              localizer={localizer}
              messages={messages}
              events={displayedEvents}
              startAccessor="start"
              endAccessor="end"
              selectable={true}
              onSelectSlot={handleSlotSelection}
              onSelectEvent={handleEventSelection}
              style={{ height: 500 }}
              min={moment().set({ hours: 8, minutes: 0 }).toDate()}
              max={moment().set({ hours: 17, minutes: 0 }).toDate()}
              views={["week", "day", "agenda"]}
              defaultView={Views.WEEK}
              step={60}
              timeslots={1}
              slotPropGetter={slotpropgetter}
              eventPropGetter={(event) => {
                if (event?.title?.includes("Cita:")) {
                  return { style: { backgroundColor: "blue" } };
                }
                if (event?.title?.includes("Derivacion:")) {
                  return { style: { backgroundColor: "green" } };
                }
                return {};
              }}
              formats={{
                dateFormat: "DD",
                dayFormat: (date, culture, localizer) =>
                  localizer.format(date, "dddd", culture), // Muestra el día en español
                weekdayFormat: (date, culture, localizer) =>
                  localizer.format(date, "ddd", culture), // Muestra "Lun", "Mar", etc.
                timeGutterFormat: "HH:mm", // Formato de horas en 24h
                monthHeaderFormat: "MMMM YYYY",
                dayHeaderFormat: "dddd, D MMMM YYYY",
                agendaDateFormat: "dddd D MMM",
                agendaTimeFormat: "HH:mm",
                agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer.format(
                    start,
                    "HH:mm",
                    culture
                  )} - ${localizer.format(end, "HH:mm", culture)}`,
              }}
            />
            <SimbologiaCard />
          </div>
        </Col>
      </div>

      {/* Modal para reservar cita */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Ingrese su Motivo Consulta</Form.Label>
              <Form.Control
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Motivo Consulta"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleBookAppointment}>
            Reservar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
const SimbologiaCard = () => {
  const cardStyle = {
    display: "flex",
    gap: "10px",
    borderRadius: "10px",
    width: "250px",
    padding: "15px",
    fontFamily: "Arial, sans-serif",
  };

  const itemContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };

  const boxStyle = (color) => ({
    width: "30px",
    height: "20px",
    backgroundColor: color,
    marginRight: "10px",
  });

  return (
    <div style={cardStyle}>
      <div style={itemContainerStyle}>
        <div style={boxStyle("blue")}></div>
        <span>Cita</span>
      </div>
      <div style={itemContainerStyle}>
        <div style={boxStyle("green")}></div>
        <span>Derivación</span>
      </div>
    </div>
  );
};

export default Calendario;
