// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser,googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); 
const User = require('../models/user'); 

const router = express.Router();

// @route   POST api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', loginUser);

router.post('/google', googleLogin); 

// @route   GET api/auth/me
// @desc    Obtener datos del usuario logueado (incluye username)
// @access  Private

router.get('/me', protect, async (req, res) => { 
    try {
        // req.user ya está adjunto por tu middleware 'protect'
        // Contiene el objeto de usuario (sin la contraseña)
        if (!req.user) { // Esto podría pasar si el protect middleware no encuentra el usuario
            return res.status(404).json({ msg: 'Usuario no encontrado después de autenticación' });
        }
        res.json(req.user); // Devolvemos el objeto de usuario completo (sin contraseña)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;