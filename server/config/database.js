const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Conexión simple sin autenticación
        await mongoose.connect('mongodb://127.0.0.1:27017/club_deportivo_garraf');
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;