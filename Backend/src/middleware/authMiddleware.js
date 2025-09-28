// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;
    

    // 1. Verificar si el token está en los headers (Authorization: Bearer TOKEN)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1];

            // 2. Decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Buscar el usuario por el ID del token y adjuntarlo a la petición
            req.user = await User.findById(decoded.id).select('-password'); // No devolver la contraseña
            next(); // Continuar con la siguiente función en la cadena de rutas
        } catch (error) {
            console.error('Error en el token:', error);
            res.status(401).json({ message: 'No autorizado, token fallido.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token.' });
    }
};

module.exports = { protect };