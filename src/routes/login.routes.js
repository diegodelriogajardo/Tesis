import express from 'express';
import {
    login
} from '../controllers/usuario.controller.js';

const router = express.Router();


// Ruta para crear un nuevo especialista
router.post('/', login);



export default router;
