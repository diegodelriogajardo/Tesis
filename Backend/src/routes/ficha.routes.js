
import express from 'express';
import {
    obtenerFichas,
    crearFicha,
    obtenerFichaPorId,
    actualizarFicha,
    eliminarFicha
} from '../controllers/ficha.controller.js';
import { authentication } from '../middleware/auth.js';

const router = express.Router();

// Ruta para obtener todas las fichas
router.get('/',authentication, obtenerFichas);

// Ruta para crear una nueva ficha
router.post('/',authentication, crearFicha);

// Ruta para obtener una ficha por su ID
router.get('/:id',authentication, obtenerFichaPorId);

// Ruta para actualizar una ficha por su ID
router.put('/:id',authentication, actualizarFicha);

// Ruta para eliminar una ficha por su ID
router.delete('/:id',authentication, eliminarFicha);

export default router;
