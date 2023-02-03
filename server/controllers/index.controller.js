import ListaActividadesLaborales from "../models/ListaActividadesLaborales.js";
import ListaPruebas from "../models/ListaPruebas.js";
import { generarErrorResponse, generarOkResponse, printError } from "../utils/functions.js";

// Página principal
export const index = (req, res) => {
    res.json({'msg': 'Bienvenido a Reminiscencia App'});
}

export const obtenerListaPruebas = async (req, res) => {
    try {
        const pruebas = await ListaPruebas.find();

        if (pruebas.length === 0) throw new Error('No hay ninguna prueba.');

        return res.status(200).json(generarOkResponse(`Se han encontrado ${pruebas.length} pruebas.`, pruebas));
    } 
    catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

export const obtenerListaActividadesLaborales = async (req, res) => {
    try {
        const actividades = await ListaActividadesLaborales.find();
        
        if (actividades.length === 0) throw new Error('No hay ninguna actividad laboral.');
        
        return res.status(200).json(generarOkResponse(`Se han encontrado ${actividades.length} actividades laborales.`, actividades));
    } 
    catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }  
}



