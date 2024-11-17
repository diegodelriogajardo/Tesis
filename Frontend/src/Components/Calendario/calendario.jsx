import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer,Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);
import { useAuth } from "../../auth/auth";




const Calendario = () => {
  const usuario=localStorage.getItem('usuario');
  const newUser= JSON.parse(usuario);
  const [doctors, setDoctors] = useState([
    { id: newUser.id, nombre: newUser.nombre, availability: [] }
  ]);
  if(newUser.rol!=="especialista"){
    setDoctors(null);
  }

  const {obtenerRol}=useAuth();
  const rol= obtenerRol();
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [isDoctorMode, setIsDoctorMode] = useState(true);
  //post('/cita',headers:Authorization{`Bearer ${localStorage.getItem('token')}`},body:{id:doctor1.nombre})
  //localStorage solo almacenan string
  // Función para agregar disponibilidad (modo doctor) cambiar logica para que paciente genere las "citas"
  const handleAddAvailability = ({ start, end }) => {
    const title = window.prompt(
      `Ingrese el título de la disponibilidad para ${selectedDoctor.nombre}:`
    );
    if (title) {
      const newAvailability = { start, end, title: `Disponible: ${title}` };

      const updatedDoctors = doctors.map((doctor) =>
        doctor.id === selectedDoctor.id
          ? {
              ...doctor,
              availability: [...doctor.availability, newAvailability],
            }
          : doctor
      );

      setDoctors(updatedDoctors);
      setSelectedDoctor(
        updatedDoctors.find((doc) => doc.id === selectedDoctor.id)
      );

      console.log("Disponibilidad agregada:", newAvailability);
    }
  };

  // Función para reservar una cita (modo paciente)
  const handleBookAppointment = ({ start, end }) => {
    console.log("estoy aqui");
    const isAvailable = selectedDoctor.availability.some(
      (event) =>
        moment(start).isBetween(event.start, event.end, null, "[)") &&
        moment(end).isBetween(event.start, event.end, null, "(]")
    );

    if (isAvailable) {
      const title = window.prompt("Ingrese su nombre para la cita:");
      if (title) {
        const appointment = {
          start,
          end,
          title: `Cita: ${title}`,
          doctorId: selectedDoctor.id,
        };

        setPatientAppointments((prev) => [...prev, appointment]);
        alert("Cita agendada correctamente.");
        console.log("Cita agendada:", appointment);
      }
    } else {
      alert("El horario no está disponible.");
    }
  };

  // Determinar los eventos mostrados
  const displayedEvents = isDoctorMode
    ? selectedDoctor.availability
    : [
        ...selectedDoctor.availability.map((event) => ({
          ...event,
          title: `Disponible - ${event.title}`,
        })),
        ...patientAppointments.filter(
          (appointment) => appointment.doctorId === selectedDoctor.id
        ),
      ];



      useEffect(()=>{
        //console.log(rol)
        if(rol==="paciente"){
          setIsDoctorMode(false)
        }else{
          setIsDoctorMode(true)
        }
      },[])//corchetes vacio hace que se llame solo como a una funcion void main en java 



  return (
    <div>

      {rol==="paciente"&&(<h1>Calendario de citas</h1>)}
      {rol==="especialista"&&(<h1>Calendario de Disponibilidad</h1>)}
      {/* <h1>Calendario de Disponibilidad y Citas</h1> */}

      {/* Selector de Modo */}
      {/* <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setIsDoctorMode(true)}>Modo Doctor</button>
        <button onClick={() => setIsDoctorMode(false)}>Modo Paciente</button>
      </div> */}

      {/* Selector de Doctor */}
      {rol==="paciente" &&(
      <div style={{ marginBottom: "10px" }}>
        <label>Seleccione un doctor: </label>
        <select
          value={selectedDoctor.id}
          onChange={(e) =>
            setSelectedDoctor(
              doctors.find((doc) => doc.id === parseInt(e.target.value))
            )
          }
        >
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.nombre}
            </option>
          ))}
        </select>
      </div>
      )
      }

      {/* Calendario */}
      <div style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={displayedEvents}
          startAccessor="start"
          endAccessor="end"
          selectable={true}
          onSelectSlot={
            isDoctorMode ? handleAddAvailability : handleBookAppointment
          }
          onSelectEvent={isDoctorMode ? handleAddAvailability : handleBookAppointment}
          style={{ height: 500 }}
          // Establecer el horario de inicio y fin del calendario
          min={moment().set({ hours: 8, minutes: 0, seconds: 0, milliseconds: 0 })}
          max={moment().set({ hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })}
          views={["week", "day", "agenda"]} // Configuración de vistas
          defaultView={Views.WEEK} // Vista predeterminada


        />
      </div>
    </div>
  );
};

export default Calendario;
