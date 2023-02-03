import Recurso from "../models/Recurso.js";
import { generarErrorResponse, generarOkResponse, printError } from "../utils/functions.js";

// Obtener todos los recursos
export const obtenerRecursos = async (req, res) => {
    try {
        const recursos = await Recurso.find().populate('usuario');
        if (recursos.length === 0)throw new Error('No hay recursos en la base de datos'); 

        return res.status(200).json(generarOkResponse(`Se han encontrado ${recursos.length} recursos.`, recursos));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Obtener un recurso por id
export const obtenerRecurso = async (req, res) => {
    try {
        const recurso = Recurso.findById(req.params.id).populate('usuario');
        if (!recurso) throw new Error(`El recurso con id = ${req.params.id} no existe.`);

        return res.status(200).json('Recurso encontrado.', recurso);

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Guardar un recurso
export const guardarRecurso = async (req, res) => {

    const { nombre, usuario, url, publico, formato, tipo, fechaReferencia, descripcion } = req.body;

    try {
        // Validaciones
        const existeRecurso = await Recurso.findOne({ url: url });
        if (existeRecurso) throw new Error(`El recurso ${url} ya existe.`);

        if (!nombre || !usuario || !url || !publico || !formato || !tipo || !fechaReferencia || !descripcion) {
            throw new Error('Faltan campos obligatorios');
        }

        // Creación del recurso
        const nuevoRecurso = new Recurso({
            nombre: nombre,
            usuario: usuario,
            url: url,
            publico: publico,
            formato: formato,
            tipo: tipo,
            fechaReferencia: fechaReferencia,
            descripcion: descripcion
        });

        // Guardar recurso
        const recursoGuardado = await nuevoRecurso.save(); 
        if (!recursoGuardado) throw new Error('Error al guardar el recurso'); 

        return res.status(201).json(generarOkResponse('Recurso guardado correctamente.', recursoGuardado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Actualizar un recurso
export const actualizarRecurso = async (req, res) => {
    try {
        const recurso = await Recurso.findById(req.params.id);
        if (!recurso) throw new Error(`El recurso con id = ${req.params.id} no existe.`);

        const recursoActualizado = await Recurso.findByIdAndUpdate(req.params.id, req.body);
        if (!recursoActualizado) throw new Error('Error al actualizar el recurso.');

        return res.status(202).json(generarOkResponse('Recurso actualizado correctamente.', recursoActualizado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Eliminar un recurso
export const eliminarRecurso = async (req, res) => {
    try {
        const recurso = await Recurso.findById(req.params.id);
        if (!recurso) throw new Error(`El recurso con id = ${req.params.id} no existe.`);

        const recursoEliminado = await Recurso.findByIdAndDelete(req.params.id);
        if (!recursoEliminado) throw new Error('Error al eliminar el recurso.');

        return res.status(202).json(generarOkResponse('Recurso eliminado correctamente.', recursoEliminado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}
