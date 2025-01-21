const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear y guardar usuario
        user = new User({
            nombre,
            email,
            password: hashedPassword,
            telefono
        });

        await user.save();

        console.log('Usuario creado:', {
            email,
            passwordOriginal: password,
            passwordGuardado: hashedPassword
        });

        res.status(201).json({ 
            msg: 'Usuario creado exitosamente',
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        console.log('Intento de login:', {
            email,
            passwordIntentada: password,
            passwordGuardada: user.password
        });

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('¿Contraseña coincide?:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Generar token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'tu_secret_temporal',
            { expiresIn: '1h' }
        );

        res.json({ 
            msg: 'Login exitoso',
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
}; 