import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const terapiaSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    tipo: { type: String, required: true }, // publica o privada
    recursos: [{ 
        ref: 'Recurso', 
        type: Schema.Types.ObjectId
    }]
}, {
    versionKey: false
});

export default model('Terapia', terapiaSchema);
