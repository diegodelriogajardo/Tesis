import { Router } from 'express';
import { crearTratamiento, obtenerTratamientoPorId, obtenerTratamientos, eliminarTratamiento , actualizarTratamiento} from '../controllers/tratamiento.controller.js';
const router = Router();
import { authentication } from '../middleware/auth.js';
// Ruta para obtener todos los tratamientos
router.get('/', authentication,obtenerTratamientos);

// Ruta para obtener un tratamiento por su ID
router.get('/:id', authentication, obtenerTratamientoPorId);

// Ruta para crear un nuevo tratamiento
router.post('/',authentication, crearTratamiento);

// Ruta para actualizar un tratamiento existente
router.put('/:id', authentication,actualizarTratamiento);

// Ruta para eliminar un tratamiento
router.delete('/:id',authentication, eliminarTratamiento);

export default router;
