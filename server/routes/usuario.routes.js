import { Router } from 'express';
const router = Router();

import * as usuarioController from '../controllers/usuario.controller.js';

// Obtener usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Obtener usuario por id
router.get('/:id', usuarioController.obtenerUsuario);

// Guardar usuario
router.post('/', usuarioController.guardarUsuario);

// Verificar email
router.post('/verificar-cuenta', usuarioController.verificarCuenta);

// Recuperar password
router.post('/recuperar-password', usuarioController.recuperarPassword);

// Validar reset token
router.post('/validar-reset-token', usuarioController.validarResetToken);

// Resetear password
router.post('/nuevo-password', usuarioController.resetearPassword);

// Iniciar sesión
router.post('/login', usuarioController.login);

// Actualizar usuario
router.put('/:id', usuarioController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', usuarioController.eliminarUsuario);

export default router;
