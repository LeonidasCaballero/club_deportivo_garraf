const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

console.log('Configurando ruta GET /players');

router.get('/players', authenticateToken, async (req, res) => {
    console.log('Recibida petición GET /players');
    console.log('Headers:', req.headers);
    
    try {
        const players = await User.find({
            $or: [
                { 'tennis.activo': true },
                { 'padel.activo': true }
            ]
        }, {
            _id: 1,
            nombre: 1,
            email: 1,
            'tennis.activo': 1,
            'tennis.nivel': 1,
            'padel.activo': 1,
            'padel.nivel': 1
        });
        
        console.log(`Encontrados ${players.length} jugadores`);
        res.json(players);
    } catch (error) {
        console.error('Error detallado al obtener jugadores:', error);
        res.status(500).json({ 
            message: 'Error al obtener la lista de jugadores',
            error: error.message 
        });
    }
});

// Ruta para obtener datos del usuario actual
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ message: 'Error al obtener datos del usuario' });
    }
});

// Ruta para actualizar preferencias
router.put('/preferences', authenticateToken, async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.tennis = preferences.tennis;
        user.padel = preferences.padel;

        await user.save();
        res.json({ message: 'Preferencias actualizadas correctamente', user });
    } catch (error) {
        console.error('Error al actualizar preferencias:', error);
        res.status(500).json({ message: 'Error al actualizar preferencias' });
    }
});

module.exports = router; 