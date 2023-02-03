import { Router } from 'express';
const router = Router();

import * as indexController from '../controllers/index.controller.js';

// Página de inicio
router.get('/', indexController.index);

// Obtener lista de pruebas 
router.get('/lista-pruebas', indexController.obtenerListaPruebas);

// Obtener lista de actividades laborales 
router.get('/lista-actividades-laborales', indexController.obtenerListaActividadesLaborales);

export default router;
