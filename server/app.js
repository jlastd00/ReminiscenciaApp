import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT } from './utils/properties.js';
import indexRoutes from './routes/index.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import recursoRoutes from './routes/recurso.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';
import terapiaRoutes from './routes/terapia.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Settings
app.set('port', PORT);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(multer({
    dest: path.join(__dirname, '../public/upload/temp')
}).single('image'));
app.use(express.json());

// Routes
app.use('/api', indexRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/terapias', terapiaRoutes);

// Static files
app.use('/public', express.static(path.join(__dirname, '../public')));

export default app;
