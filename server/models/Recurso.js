import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const recursoSchema = new Schema({
    nombre: { type: String, required: true },
    usuario: { 
        ref: 'Usuario',
        type: Schema.Types.ObjectId 
    },
    fechaAlta: { type: Date, default: Date.now() },
    url: { type: String, required: true },
    publico: { type: Boolean, required: true },
    formato: { type: String, required: true },
    tipo: { type: String, required: true },
    fechaReferencia: { type: Date, required: true },
    descripcion: { type: String, required: true }
}, {
    versionKey: false
});

export default model('Recurso', recursoSchema);
