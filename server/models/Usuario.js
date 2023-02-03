import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    verifyToken: { type: String, default: "" },
    resetToken: { type: String, default: "" },
    pacientes: [{
        ref: "Paciente",
        type: Schema.Types.ObjectId
    }]
}, {
    versionKey: false
});

usuarioSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

usuarioSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

export default model('Usuario', usuarioSchema);
