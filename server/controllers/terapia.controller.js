import Terapia from "../models/Terapia.js";
import { generarErrorResponse, generarOkResponse, printError } from "../utils/functions.js";

// Obtener todas las terapias
export const obtenerTerapias = async (req, res) => {
    try {
        const terapias = await Terapia.find().populate('recursos');
        if (terapias.length === 0) throw new Error('No hay terapias en la base de datos.'); 

        return res.status(200).json(generarOkResponse(`Se han encontrado ${terapias.length} terapias.`, terapias));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Obtener una terapia por id
export const obtenerTerapia = async (req, res) => {
    try {
        const terapia = await Terapia.findById(req.params.id).populate('recursos');
        if (!terapia) throw new Error(`La terapia con id = ${req.params.id} no existe.`); 

        return res.status(200).json(generarOkResponse('Terapia encontrada.', terapia));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Guardar una terapia
export const guardarTerapia = async (req, res) => {

    const { nombre, descripcion, tipo, recursos } = req.body;

    try {
        // Validaciones
        if (!nombre || !descripcion || !tipo) throw new Error('Faltan campos obligatorios.');
        
        // Creación de la terapia
        const nuevaTerapia = new Terapia({
            nombre: nombre,
            descripcion: descripcion,
            tipo: tipo,
            recursos: recursos
        });

        // Guardar la terapia
        const terapiaGuardada = await nuevaTerapia.save(); 
        if (!terapiaGuardada) throw new Error('Error al guardar la terapia.');
        
        return res.status(201).json(generarOkResponse('Terapia guardada correctamente', terapiaGuardada));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Actualizar una terapia
export const actualizarTerapia = async (req, res) => {
    try {
        const terapia = await Terapia.findById(req.params.id);
        if (!terapia) throw new Error(`La terapia con id = ${req.params.id} no existe.`);

        const terapiaActualizada = await Terapia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!terapiaActualizada) throw new Error('Error al actualizar la terapia.');

        return res.status(202).json(generarOkResponse('Terapia actualizada correctamente.', terapiaActualizada));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Eliminar una terapia
export const eliminarTerapia = async (req, res) => {
    try {
        const terapia = await Terapia.findById(req.params.id);
        if (!terapia) throw new Error(`La terapia con id = ${req.params.id} no existe.`);

        const terapiaEliminada = await Terapia.findByIdAndDelete(req.params.id);
        if (!terapiaEliminada) throw new Error('Error al eliminar la terapia.');

        return res.status(202).json(generarOkResponse('Terapia eliminada correctamente.', terapiaEliminada));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}
