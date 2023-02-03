import { Router } from 'express';
const router = Router();

import * as recursoController from '../controllers/recurso.controller.js';

// Obtener recursos
router.get('/', recursoController.obtenerRecursos);

// Obtener recurso por id
router.get('/:id', recursoController.obtenerRecurso);

// Guardar recurso
router.post('/', recursoController.guardarRecurso);

// Actualizar recurso
router.put('/:id', recursoController.actualizarRecurso);

// Eliminar recurso
router.delete('/:id', recursoController.eliminarRecurso);

export default router;
