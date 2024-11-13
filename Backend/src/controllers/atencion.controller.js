import Atencion from '../models/atencion.js';
//import Especialista from '../models/especialista.js';
import Ficha from '../models/ficha.js';
import Diagnostico from '../models/diagnostico.js';
import Usuario from '../models/usuario.js';

// Controlador para obtener todas las atenciones con información de los especialistas, fichas y diagnósticos asociados
const obtenerAtenciones = async (req, res) => {
    try {
        const atenciones = await Atencion.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre', 'especialidad','rol']
                },
                {
                    model: Ficha,
                    attributes: ['fecha']
                }
            ]
        });

        if (atenciones.length === 0) {
            return res.status(404).json({ error: 'No hay atenciones registradas' });
        }

        res.json(atenciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las atenciones' });
    }
};

// Controlador para crear una nueva atención asociada a un especialista, ficha y posiblemente diagnósticos
const crearAtencion = async (req, res) => {
    try {
        const { id_especialista, id_ficha, fecha_atencion, resumen, descripcion } = req.body;

        // Verificar que el especialista y la ficha existen
        const especialista = await Especialista.findByPk(id_especialista);
        if (!especialista) {
            return res.status(404).json({ error: 'Especialista no encontrado' });
        }

        const ficha = await Ficha.findByPk(id_ficha);
        if (!ficha) {
            return res.status(404).json({ error: 'Ficha no encontrada' });
        }

        const atencion = await Atencion.create({
            id_especialista,
            id_ficha,
            fecha_atencion,
            resumen,
            descripcion
        });

        res.status(201).json(atencion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la atención' });
    }
};

// Controlador para obtener una atención por su ID con información de especialista, ficha y diagnósticos
const obtenerAtencionPorId = async (req, res) => {
    const result = Number(req.params.id);
    try {
        const atencion = await Atencion.findByPk(result, {
            include: [
                {
                    model: Especialista,
                    attributes: ['nombre', 'especialidad']
                },
                {
                    model: Ficha,
                    attributes: ['fecha']
                }
            ]
        });

        if (!atencion) {
            return res.status(404).json({ error: 'Atención no encontrada' });
        }

        res.json(atencion);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la atención' });
    }
};

// Controlador para actualizar una atención existente
const actualizarAtencion = async (req, res) => {
    const result = Number(req.params.id)
    try {
        const [actualizado] = await Atencion.update(req.body, {
            where: { id_atencion: result }
        });

        if (!actualizado) {
            return res.status(404).json({ error: 'Atención no encontrada' });
        }

        res.json({ mensaje: 'Atención actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la atención' });
    }
};

// Controlador para eliminar una atención
const eliminarAtencion = async (req, res) => {
    const result= Number(req.params.id)
    try {
        const eliminado = await Atencion.destroy({
            where: { id_atencion: result }
        });

        if (!eliminado) {
            return res.status(404).json({ error: 'Atención no encontrada' });
        }

        res.json({ mensaje: 'Atención eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la atención' });
    }
};

export {
    obtenerAtenciones,
    crearAtencion,
    obtenerAtencionPorId,
    actualizarAtencion,
    eliminarAtencion
};
