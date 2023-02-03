import { Router } from 'express';
const router = Router();

import * as pacienteController from '../controllers/paciente.controller.js';

// Obtener recursos
router.get('/', pacienteController.obtenerPacientes);

// Obtener recurso por id
router.get('/:id', pacienteController.obtenerPaciente);

// Guardar recurso
router.post('/', pacienteController.guardarPaciente);

// Actualizar recurso
router.put('/:id', pacienteController.actualizarPaciente);

// Eliminar recurso
router.delete('/:id', pacienteController.eliminarPaciente);

export default router;
