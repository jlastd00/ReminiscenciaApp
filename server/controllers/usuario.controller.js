import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import Usuario from '../models/Usuario.js'
import { generarErrorResponse, generarOkResponse, print, printError } from '../utils/functions.js';
import { SECRET_KEY } from '../utils/properties.js';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate('pacientes');

        if (usuarios.length === 0) throw new Error('No hay usuarios en la base de datos.');
        
        return res.status(200).json(generarOkResponse(`Se han encontrado ${usuarios.length} usuarios.`, usuarios));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Obtener un usuario por id
export const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('pacientes');
        
        if (!usuario) throw new Error(`El usuario con id = ${req.params.id} no existe.`);

        return res.status(200).json(generarOkResponse('Usuario encontrado.', usuario));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }     
}

// Guardar un usuario
export const guardarUsuario = async (req, res) => {

    const { nombre, email, password, repassword, role, pacientes } = req.body;
    if (!pacientes) pacientes = [];

    try {
        // Validaciones
        if (!nombre || !email || !password || !role) throw new Error('Faltan campos obligatorios');

        const existeUsuario = await Usuario.findOne({ email: email });
        if (existeUsuario) throw new Error(`El usuario ${email} ya existe.`);

        if (password !== repassword) throw new Error('Las contraseñas no coinciden');

        // Creación del usuario
        const nuevoUsuario = new Usuario({
            nombre: nombre,
            email: email,
            password: await Usuario.encryptPassword(password),
            role: role,
            pacientes: pacientes,
            verifyToken: token
        });

        // Activacion de cuenta 
        enviarEmailActivacion(nombre, email);

        // Guardar el usuario
        const usuarioRegistrado = await nuevoUsuario.save(); 
        if (!usuarioRegistrado) throw new Error('Error al registrar el usuario');        
        
        return res.status(201).json(generarOkResponse('Usuario creado correctamente', usuarioRegistrado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    } 
}

// Verificacion de cuenta
export const verificarCuenta = async (req, res) => {

    print(`${req.protocol}://${req.get('host')}`);
    
    const { token } = req.body;
    const errormsg = 'Algo ha ido mal, no se ha verificado el email';
    const successmsg = 'El Email se ha verificado con exito, ya puede iniciar sesion';
    
    if ((req.protocol + "://localhost:4000") == ("http://" + req.get('host'))) {

        print("El dominio coincide. La informacion viene desde un Email valido");
        
        jwt.verify(token, SECRET_KEY, async (error, decoded) => {
            if (error) {
                return res.json({ resultado: "ERR", mensaje: errormsg });
            } 
            else {
                const email = decoded.email;
                
                const usuario = await Usuario.findOne({email});
                if (!usuario) { return res.json({ resultado: "ERR", mensaje: errormsg }); } 

                if (token == usuario.verifyToken) {
                    
                    const usuarioUpdated = await Usuario.findByIdAndUpdate(usuario._id, { verifyToken: "" });
                    if (!usuarioUpdated) { return res.json({resultado: "ERR", mensaje: errormsg }); } 

                    print("Email verificado");
                    return res.json({resultado: "OK", mensaje: successmsg });
                }
                else {
                    printError("Email NO verificado");
                    return res.json({resultado: "ERR", mensaje: errormsg });
                }
            }
        });
    }
    else {
        printError("Request is from unknown source");
        return res.json({
            resultado: "ERR", 
            mensaje: 'No coincide el dominio ni el host, no se puede verificar el Email'
        });
    }
    
}

// Login
export const login = async (req, res) => {
    
    const { email, password } = req.body;

    try {
        if (!email || !password) throw new Error('Falta email o contraseña.');
        
        const usuario = await Usuario.findOne({ email: email }).populate('pacientes'); 
        if (!usuario) throw new Error(`El usuario ${email} no existe.`);

        const coincidePassword = await Usuario.comparePassword(password, usuario.password);
        if (!coincidePassword) throw new Error('Contraseña incorrecta.');

        if (usuario.verifyToken !== "") 
            throw new Error('Su cuenta no esta activada, por favor revise su email para activarla.');

        const token = jwt.sign({ id: usuario._id }, SECRET_KEY, {
            expiresIn: 86400 // 24 horas
        });

        return res.status(200).json({
            resultado: "OK", 
            mensaje: "Has iniciado sesión con éxito",
            token: token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role,
                pacientes: usuario.pacientes
            }
        });

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }   
}

// Recuperar password
export const recuperarPassword = async (req, res) => { 

    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ email: email });
        if (!usuario) throw new Error(`El usuario ${email} no existe.`);

        const hash = await bcrypt.hash(email, 10);
        const token = jwt.sign({ email, hash }, SECRET_KEY);

        const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario._id, { resetToken: token });
        if (!usuarioActualizado) throw new Error('Ha ocurrido un error al actualizar el resetToken.');

        enviarEmailRecuperarPassword(token, email);

        return res.json(generarOkResponse('Solicitud recibida, revise su email para reestablecer su contraseña', null));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Validar reset token
export const validarResetToken = async (req, res) => {
    
    const { token } = req.body;

    jwt.verify(token, SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.json({ resultado: "ERR", mensaje: 'Ha ocurrido un error al validar el token.' });
        } 
        else {
            const email = decoded.email;
            
            const usuario = await Usuario.findOne({email});
            if (!usuario) { return res.json({ resultado: "ERR", mensaje: 'Ha ocurrido un error. No existe el usuario.' }); } 

            if (usuario.resetToken == "") { 
                return res.json({ resultado: "ERR", mensaje: 'Ha ocurrido un error al resetear el token.' }); 
            }

            if (token == usuario.resetToken) {          
                print("Todo correcto, se puede cambiar la contraseña");
                return res.json({ resultado: "OK", token: token, mensaje: 'Correcto, ya puede cambiar la contraseña.' });
            }
            else {
                printError("No se puede recuperar la contraseña.");
                return res.json({ resultado: "ERR", mensaje: 'Ha ocurrido un error. No se puede recuperar la contraseña.' });
            }
        }
    });    
}

// Resetear password
export const resetearPassword = async (req, res) => {
    
    const { usuarioToken, password, repassword } = req.body;
    
    jwt.verify(usuarioToken, SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.json({ resultado: "ERR", mensaje: 'Ha ocurrido un error. Token incorrecto.' });
        } 
        else {
            const email = decoded.email;
            
            const usuario = await Usuario.findOne({email});
            if (!usuario) { return res.json({ resultado: "ERR", mensaje: 'El usuario no existe.' }); } 

            if (usuarioToken !== usuario.resetToken) { return res.json({ resultado: "ERR", mensaje: 'Los token no coinciden.' }); }

            if (!password || !repassword) {
                return res.json({ resultado: "ERR", mensaje: 'Faltan campos obligatorios' });
            }
            if (password !== repassword) {
                return res.json({ resultado: "ERR", mensaje: 'Las contraseñas no coinciden' });
            }

            const existePassword = await Usuario.comparePassword(password, usuario.password);
            if (existePassword) return res.json({ resultado: "ERR", mensaje: 'La contraseña no es válida' });

            const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario._id, {
                resetToken: "",
                password: await Usuario.encryptPassword(password)
            });

            if (!usuarioActualizado) { 
                return res.json({ resultado: "ERR", mensaje: 'Ha ocurrido un error. No se ha cambiado la contraseña.' }); 
            } 

            return res.json({ 
                resultado: "OK", 
                mensaje: 'La contraseña se ha reestablecido con éxito, ya puede iniciar sesion.' 
            });
        }
    })
}

// Actualizar un usuario
export const actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) throw new Error(`El usuario con id ${req.params.id} no existe.`);

        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body);
        if (!usuarioActualizado) throw new Error('Error al actualizar el usuario.');

        return res.status(202).json(generarOkResponse('Usuario actualizado correctamente.', usuarioActualizado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) throw new Error(`El usuario con id ${req.params.id} no existe.`);

        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) throw new Error('Error al eliminar el usuario.');

        return res.status(202).json(generarOkResponse('Usuario eliminado correctamente.', usuarioEliminado));

    } catch (error) {
        printError(error);
        return res.json(generarErrorResponse(error));
    }
}

const enviarEmailActivacion = async (nombre, email) => {
    
    const token = jwt.sign({ nombre, email }, SECRET_KEY);
    const link = `http://localhost:4200/verificar-cuenta/?token=${token}`;
    print(link);

    const contentHTML = `
        <center>
            <h1>Activación de cuenta</h1>
            Hola,<br> Por favor, haz Click en el siguiente enlace para verificar tu email.<br>
            <a href="${link}">Click aqui para verificar</a>
        </center>
    `;

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'jaeden.grant12@ethereal.email',
            pass: 'kkhYKBZ7jZdytpKZUB'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"App Reminiscencia" <jaeden.grant12@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Por favor, confirma tu cuenta de Email", // Subject line
        html: contentHTML, // html body
    });

    print("Message sent: ", info.messageId);
    print("Preview URL: ", nodemailer.getTestMessageUrl(info));  
    print('Mensaje enviado');
}

const enviarEmailRecuperarPassword = async (token, email) => {

    const link = `http://localhost:4200/nuevo-password/?token=${token}`;
    print(link);

    const contentHTML = `
        <center>
            <h1>Cambio de contraseña</h1>
            Hola,<br> Por favor, haz Click en el siguiente enlace para introducir la nueva contraseña.<br>
            <a href="${link}">Cambiar contraseña</a>
        </center>
    `;
    
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'jaeden.grant12@ethereal.email',
            pass: 'kkhYKBZ7jZdytpKZUB'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Jaeden Grant" <jaeden.grant12@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Cambio de contraseña", // Subject line
        html: contentHTML, // html body
    });

    print("Message sent: ", info.messageId);
    print("Preview URL: ", nodemailer.getTestMessageUrl(info));  
    print('Mensaje enviado');
}
