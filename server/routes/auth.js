const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Ruta para ver usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});

router.post('/signup', async (req, res) => {
    try {
        console.log('1. Recibida petición de registro');
        console.log('Datos recibidos:', req.body);

        const { nombre, email, password, telefono } = req.body;

        // Validar que todos los campos necesarios estén presentes
        if (!nombre || !email || !password || !telefono) {
            console.log('2. Faltan campos requeridos');
            return res.status(400).json({
                message: 'Todos los campos son requeridos',
                missingFields: {
                    nombre: !nombre,
                    email: !email,
                    password: !password,
                    telefono: !telefono
                }
            });
        }

        console.log('3. Verificando si el email ya existe');
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log('4. Email ya registrado');
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        console.log('5. Hasheando contraseña');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('6. Creando nuevo usuario');
        const user = new User({
            nombre,
            email,
            telefono,
            password: hashedPassword,
            tennis: { activo: false, nivel: '' },
            padel: { activo: false, nivel: '' }
        });

        console.log('7. Guardando usuario en la base de datos');
        const savedUser = await user.save();
        console.log('8. Usuario guardado:', savedUser);

        console.log('9. Generando token');
        const token = jwt.sign(
            { userId: savedUser._id, email: savedUser.email },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        console.log('10. Enviando respuesta');
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: savedUser._id,
                nombre: savedUser.nombre,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Error en el proceso de registro:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Error al registrar usuario',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

router.post('/login', login);

module.exports = router; 