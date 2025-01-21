const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User');

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

router.post('/register', register);
router.post('/login', login);

module.exports = router; 