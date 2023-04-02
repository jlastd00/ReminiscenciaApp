import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const pacienteSchema = new Schema({
    foto: { path: String, filename: String },
    fechaNacimiento: { type: Date, required: true },
    nombre: { type: String, required: true },
    apellido1: { type: String, required: true },
    apellido2: { type: String, required: true },
    fechaAlta: { type: Date, default: Date.now() },
    institucionalizado: { type: Boolean, required: true },
    institucion: { nombre: String, localidad: String, fechaIngreso: Date },
    direccion: { nombreVia: String, numero: Number, pisoYletra: String, localidad: String, provincia: String },
    diagnosticos: [{ diagnostico: String, profesional: String, fechaDiagnostico: Date  }],
    valoracionesYpruebas: [{ nombrePrueba: String, fechaPrueba: Date }],
    lugarNacimiento: { type: String, required: true },
    lugarResidencia: [{ fechaDesde: Date, fechaHasta: Date, localidad: String, provincia: String, pais: String }],
    nivelEstudios: { type: String, required: true },
    estudios: { institucion: String, localidad: String, fechaInicio: Date, fechaFin: Date, titulacion: String },
    actividadLaboral: [{ actividad: String, empresa: String, localidad: String, provincia: String, pais: String, fechaInicio: Date, fechaFin: Date }],
    aficiones: [],
    terapias: [{ 
        ref: 'Terapia', 
        type: Schema.Types.ObjectId
    }]
}, {
    versionKey: false
});

export default model('Paciente', pacienteSchema);
