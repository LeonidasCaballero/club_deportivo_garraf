const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
// ... otros imports

const app = express();

// Middleware para logging de todas las peticiones
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Configurar CORS antes de las rutas
app.use(cors({
    origin: 'http://localhost:5173', // URL de tu frontend en Vite
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas
console.log('Registrando rutas de usuarios en /api/users');
app.use('/api/users', userRoutes);

console.log('Registrando rutas de autenticación en /api/auth');
app.use('/api/auth', authRoutes);

// Middleware para manejo de rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.url}` });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

module.exports = app; 