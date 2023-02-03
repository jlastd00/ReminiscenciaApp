import { Router } from 'express';
const router = Router();

import * as terapiaController from '../controllers/terapia.controller.js';

// Obtener recursos
router.get('/', terapiaController.obtenerTerapias);

// Obtener recurso por id
router.get('/:id', terapiaController.obtenerTerapia);

// Guardar recurso
router.post('/', terapiaController.guardarTerapia);

// Actualizar recurso
router.put('/:id', terapiaController.actualizarTerapia);

// Eliminar recurso
router.delete('/:id', terapiaController.eliminarTerapia);

export default router;
