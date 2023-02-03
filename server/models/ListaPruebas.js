import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const listaPruebasSchema = new Schema({
    prueba: { type: String }
}, {
    versionKey: false
});

export default model('ListaPruebas', listaPruebasSchema);
