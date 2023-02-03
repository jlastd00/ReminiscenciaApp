import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const listaActividadesLaboralesSchema = new Schema({
    actividad: { type: String }
}, {
    versionKey: false
});

export default model('ListaActividadesLaborales', listaActividadesLaboralesSchema);
