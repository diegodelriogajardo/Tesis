import Tratamiento from '../models/tratamiento.js';
//import Especialista from '../models/especialista.js';
//import Paciente from '../models/paciente.js';
import Diagnostico from '../models/diagnostico.js';
import Usuario from '../models/usuario.js';

// Controlador para obtener todos los tratamientos con información de especialistas, pacientes y diagnósticos
const obtenerTratamientos = async (req, res) => {
    try {
        const tratamientos = await Tratamiento.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre', 'email','especialidad']
                },
                {
                    model: Diagnostico,
                    attributes: ['descripcion', 'fecha_diagnostico']
                }
            ]
        });

        if (tratamientos.length === 0) {
            return res.status(404).json({ error: 'No hay tratamientos registrados' });
        }

        res.json(tratamientos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tratamientos' });
    }
};

// Controlador para crear un nuevo tratamiento
const crearTratamiento = async (req, res) => {
    try {
        const { descripcion, fecha_inicio, fecha_fin, id_especialista, id_paciente, id_diagnostico } = req.body;

        const tratamiento = await Tratamiento.create({
            descripcion,
            fecha_inicio,
            fecha_fin,
            id_especialista,
            id_paciente,
            id_diagnostico
        });

        res.status(201).json(tratamiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tratamiento' });
    }
};

// Controlador para obtener un tratamiento por su ID con información de especialista, paciente y diagnóstico
const obtenerTratamientoPorId = async (req, res) => {
    try {
        const tratamiento = await Tratamiento.findByPk(req.params.id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre', 'email','especialidad']
                },
                {
                    model: Diagnostico,
                    attributes: ['descripcion', 'fecha_diagnostico']
                }
            ]
        });

        if (!tratamiento) {
            return res.status(404).json({ error: 'Tratamiento no encontrado' });
        }

        res.json(tratamiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tratamiento' });
    }
};

// Controlador para actualizar un tratamiento existente
const actualizarTratamiento = async (req, res) => {
    const result=Number(req.params.id)
    try {
        const [actualizado] = await Tratamiento.update(req.body, {
            where: { id_tratamiento: result}
        });

        if (!actualizado) {
            return res.status(404).json({ error: 'Tratamiento no encontrado' });
        }

        res.json({ mensaje: 'Tratamiento actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el tratamiento' });
    }
};

// Controlador para eliminar un tratamiento
const eliminarTratamiento = async (req, res) => {
    const result=Number(req.params.id)
    try {
        const eliminado = await Tratamiento.destroy({
            where: { id_tratamiento: result }
        });

        if (!eliminado) {
            return res.status(404).json({ error: 'Tratamiento no encontrado' });
        }

        res.json({ mensaje: 'Tratamiento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tratamiento' });
    }
};

export {
    obtenerTratamientos,
    crearTratamiento,
    obtenerTratamientoPorId,
    actualizarTratamiento,
    eliminarTratamiento
};
