const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const User = require('./models/User');
const mongoose = require('mongoose');

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, 'tu_secreto_jwt');
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error en el registro' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user._id }, 'tu_secreto_jwt');
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error en el login' });
    }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, 'tu_secreto_jwt', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

app.get('/api/private', authenticateToken, (req, res) => {
    res.json({ message: 'Estás logueado!' });
});

// Verificar si ya hay una conexión activa
if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost:27017/club_deportivo')
        .then(() => console.log('MongoDB conectado exitosamente'))
        .catch(err => console.error('Error conectando a MongoDB:', err));
}

// Middleware para logging de todas las peticiones
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
    console.log('Rutas disponibles:');
    app._router.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
        } else if (r.name === 'router') {
            console.log('Router middleware:', r.regexp);
        }
    });
}); 