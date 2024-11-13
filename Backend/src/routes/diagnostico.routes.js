import express from 'express';
import {
    obtenerDiagnosticos,
    crearDiagnostico,
    obtenerDiagnosticoPorId,
    actualizarDiagnostico,
    eliminarDiagnostico
} from '../controllers/diagnostico.controller.js';
import { authentication, esEspecialista } from '../middleware/auth.js';

const router = express.Router();

// Ruta para obtener todos los diagnósticos
router.get('/', esEspecialista,obtenerDiagnosticos );

// Ruta para crear un nuevo diagnóstico
router.post('/', esEspecialista,crearDiagnostico);

// Ruta para obtener un diagnóstico por su ID
router.get('/:id', esEspecialista,obtenerDiagnosticoPorId);

// Ruta para actualizar un diagnóstico por su ID
router.put('/:id', esEspecialista,actualizarDiagnostico);

// Ruta para eliminar un diagnóstico por su ID
router.delete('/:id', esEspecialista,eliminarDiagnostico);

export default router;
