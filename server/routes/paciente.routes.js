import { Router } from 'express';
const router = Router();

import * as pacienteController from '../controllers/paciente.controller.js';

// Obtener pacientes
router.get('/', pacienteController.obtenerPacientes);

// Obtener paciente por id
router.get('/:id', pacienteController.obtenerPaciente);

// Guardar paciente
router.post('/', pacienteController.guardarPaciente);

// Guardar foto del paciente
router.post('/:id', pacienteController.guardarFotoPaciente);

// Actualizar paciente
router.put('/:id', pacienteController.actualizarPaciente);

// Eliminar paciente
router.delete('/:id', pacienteController.eliminarPaciente);

export default router;
