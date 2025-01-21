const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        req.user = user;
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = {
    authenticateToken
}; 