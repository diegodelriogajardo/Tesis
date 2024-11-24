import Cita from '../models/citas.js';
//import Paciente from '../models/paciente.js';
//import Especialista from '../models/especialista.js';
import Usuario from '../models/usuario.js';

// Controlador para obtener todas las citas con información de pacientes y especialistas asociados
const obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'Paciente', // Alias para el paciente
                    attributes: ['nombre', 'rut', 'rol']
                },
                {
                    model: Usuario,
                    as: 'Especialista', // Alias para el especialista
                    attributes: ['nombre', 'especialidad', 'rol']
                }
            ]
        });
        console.log(citas)
        if (!citas) {
            return res.status(404).json({ error: 'No hay citas registradas' });
        }

        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas',motivo:error });

    }
};

// Controlador para crear una nueva cita asociada a un paciente y un especialista
const crearCita = async (req, res) => {
    try {
        const { id_paciente, id_especialista, fecha_cita, estado, title } = req.body;

        // Verificar que el paciente y el especialista existen
        const paciente = await Usuario.findByPk(id_paciente);
        //
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        const especialista = await Usuario.findByPk(id_especialista);
        if(especialista.rol=='especialista'){

            if (!especialista) {
                return res.status(404).json({ error: 'Especialista no encontrado' });
            }
    
            const cita = await Cita.create({
                id_paciente,
                id_especialista,
                fecha_cita,
                estado,
                title
            });
    
            res.status(201).json(cita);
        }else{
            return res.status(401).json({ error: 'Especialista no autorizado' });
        }


    } catch (error) {
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};

// Controlador para obtener una cita por su ID con información de paciente y especialista
const obtenerCitaPorId = async (req, res) => {
    const result = Number(req.params.id);

    try {
        const cita = await Cita.findByPk(result, {
            include: [
                {
                    model: Usuario,
                    as: 'Paciente', // Alias para el paciente
                    attributes: ['nombre', 'rut', 'rol']
                },
                {
                    model: Usuario,
                    as: 'Especialista', // Alias para el especialista
                    attributes: ['nombre', 'especialidad', 'rol']
                }
            ]
        });

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json(cita);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la cita' });
    }
};


// Controlador para actualizar una cita existente
const actualizarCita = async (req, res) => {
    const { id } = req.params; // Obtener ID de la cita desde los parámetros
    const { title, fecha, hora } = req.body; // Datos enviados desde el frontend

    try {
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Combinar fecha y hora en el formato requerido
        const nuevaFechaHora = `${fecha} ${hora}:00`;

        // Actualizar los campos relevantes
        cita.title = title;
        cita.fecha_cita = nuevaFechaHora; // Asegúrate de que el campo en la BD coincida
        await cita.save();

        res.status(200).json({ message: 'Cita actualizada correctamente', cita });
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
};



// Controlador para eliminar una cita
const eliminarCita = async (req, res) => {
    const result = Number(req.params.id);
    try {
        const eliminado = await Cita.destroy({
            where: { id_cita: result }
        });

        if (!eliminado) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ mensaje: 'Cita eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};

export {
    obtenerCitas,
    crearCita,
    obtenerCitaPorId,
    actualizarCita,
    eliminarCita
};
