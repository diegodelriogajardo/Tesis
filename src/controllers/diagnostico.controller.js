import Diagnostico from '../models/diagnostico.js';
import Atencion from '../models/atencion.js';
import Tratamiento from '../models/tratamiento.js';

// Controlador para obtener todos los diagnósticos con información de atenciones y tratamientos relacionados
const obtenerDiagnosticos = async (req, res) => {
    try {
        const diagnosticos = await Diagnostico.findAll({
            include: [
                {
                    model: Atencion,
                    attributes: ['fecha_atencion', 'resumen','descripcion']
                }
            ]
        });

        if (diagnosticos.length === 0) {
            return res.status(404).json({ error: 'No hay diagnósticos registrados' });
        }

        res.json(diagnosticos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los diagnósticos' });
    }
};

// Controlador para crear un nuevo diagnóstico
const crearDiagnostico = async (req, res) => {
    try {
        const { descripcion, fecha_diagnostico, id_atencion} = req.body;

        const diagnostico = await Diagnostico.create({
            descripcion,
            fecha_diagnostico,
            id_atencion
        });

        res.status(201).json(diagnostico);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el diagnóstico' });
    }
};

// Controlador para obtener un diagnóstico por su ID con información de atenciones y tratamientos relacionados
const obtenerDiagnosticoPorId = async (req, res) => {
    const result= Number(req.params.id)
    try {
        const diagnostico = await Diagnostico.findByPk(result, {
            include: [
                {
                    model: Atencion,
                    attributes: ['fecha_atencion', 'resumen','descripcion']
                }
            ]
        });

        if (!diagnostico) {
            return res.status(404).json({ error: 'Diagnóstico no encontrado' });
        }

        res.json(diagnostico);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el diagnóstico' });
    }
};

// Controlador para actualizar un diagnóstico existente
const actualizarDiagnostico = async (req, res) => {
    const result = Number(req.params.id)
    try {
        const [actualizado] = await Diagnostico.update(req.body, {
            where: { id_diagnostico : result}
        });

        if (!actualizado) {
            return res.status(404).json({ error: 'Diagnóstico no encontrado' });
        }

        res.json({ mensaje: 'Diagnóstico actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el diagnóstico' });
    }
};

// Controlador para eliminar un diagnóstico
const eliminarDiagnostico = async (req, res) => {
    const result= Number(req.params.id)
    try {
        const eliminado = await Diagnostico.destroy({
            where: { id_diagnostico: result }
        });

        if (!eliminado) {
            return res.status(404).json({ error: 'Diagnóstico no encontrado' });
        }

        res.json({ mensaje: 'Diagnóstico eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el diagnóstico' });
    }
};

export {
    obtenerDiagnosticos,
    crearDiagnostico,
    obtenerDiagnosticoPorId,
    actualizarDiagnostico,
    eliminarDiagnostico
};
