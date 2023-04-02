import path from 'path';
import fs from 'fs-extra';

import Paciente from "../models/Paciente.js";
import { generarErrorResponse, generarOkResponse, printError, randomName } from "../utils/functions.js";

// Obtener todos los pacientes
export const obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find().populate('terapias');
        if (pacientes.length === 0) throw new Error('No hay ningún paciente creado.');

        return res.status(200).json(generarOkResponse(`Se han encontrado ${pacientes.length} pacientes.`, pacientes));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Obtener un paciente por id
export const obtenerPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id).populate('terapias');
        if (!paciente) throw new Error(`El paciente con id = ${req.params.id} no existe.`);

        return res.status(200).json(generarOkResponse('Paciente encontrado.', paciente));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Guardar un paciente
export const guardarPaciente = async (req, res) => {
    
    const {
        fechaNacimiento, nombre, apellido1, apellido2, fechaAlta, 
        institucionalizado, institucion, direccion, diagnosticos, valoracionesYpruebas,
        lugarNacimiento, lugarResidencia, nivelEstudios, estudios, actividadLaboral, aficiones, terapias
    } = req.body;

    try {
        // Validaciones
        if (!fechaNacimiento || !nombre || !apellido1 || !fechaAlta || !institucionalizado || !lugarNacimiento || 
            !lugarResidencia || !nivelEstudios || !estudios || !actividadLaboral || !aficiones || !terapias) {
            
            throw new Error('Faltan campos obligatorios.');
        }

        // Creación del paciente
        const nuevoPaciente = new Paciente({
            fechaNacimiento: fechaNacimiento,
            nombre: nombre,
            apellido1: apellido1,
            apellido2: apellido2,
            fechaAlta: fechaAlta,
            institucionalizado: institucionalizado,
            institucion: institucion,
            direccion: direccion,
            diagnosticos: diagnosticos,
            valoracionesYpruebas: valoracionesYpruebas,
            lugarNacimiento: lugarNacimiento,
            lugarResidencia: lugarResidencia,
            nivelEstudios: nivelEstudios,
            estudios: estudios,
            actividadLaboral: actividadLaboral,
            aficiones: aficiones,
            terapias: terapias,
        });

        // Guardar paciente
        const pacienteGuardado = await nuevoPaciente.save();
        if (!pacienteGuardado) throw new Error('Error al guardar el paciente.');         
        
        return res.status(201).json(generarOkResponse('Paciente guardado correctamente.', pacienteGuardado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

export const guardarFotoPaciente = async (req, res) => {
    try {
        console.log(req.file);
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) throw new Error(`El paciente con id = ${req.params.id} no existe.`);

        // Si el paciente tiene foto, se borra antes de guardar la nueva
        if (paciente.foto.path != "" && paciente.foto.filename != "") {
            if (fs.pathExists(paciente.foto.path)) {
                fs.remove(paciente.foto.path);
            }
        }

        const imageTempPath = req.file.path;
        const nameImg = randomName();
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`server/public/upload/fotosPacientes/${nameImg + ext}`);
        let foto = {};
        
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            
            await fs.rename(imageTempPath, targetPath);

            foto = {
                path: targetPath,
                filename: nameImg + ext
            }

            const pacienteActualizado = await Paciente.findByIdAndUpdate(
                paciente._id,
                { foto }, 
                { new: true }
            );

            if (!pacienteActualizado) throw new Error('Error al guardar la foto del paciente.');
        }
        else {
            await fs.unlink(imageTempPath);
            throw new Error('El tipo de imagen no es un tipo válido: [.jpg,.jpeg,.png]');
        }
        
        return res.status(202).json(generarOkResponse('Foto del paciente guardada correctamente.', foto));
    } 
    catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Actualizar un paciente
export const actualizarPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) throw new Error(`El paciente con id = ${req.params.id} no existe.`);

        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true }
        );
        if (!pacienteActualizado) throw new Error('Error al actualizar el paciente.');

        return res.status(202).json(generarOkResponse('Paciente actualizado correctamente.', pacienteActualizado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Eliminar un paciente
export const eliminarPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.id);
        if (!paciente) throw new Error(`El paciente con id = ${req.params.id} no existe.`);

        const pacienteEliminado = await Paciente.findByIdAndDelete(req.params.id);
        if (!pacienteEliminado) throw new Error('Error al eliminar el paciente.');

        return res.status(202).json(generarOkResponse('Paciente eliminado correctamente.', pacienteEliminado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}
