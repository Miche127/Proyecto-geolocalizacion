// backend/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Función auxiliar para generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/*login con google*/
exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        // Si el usuario no existe, lo creamos
        if (!user) {
            user = await User.create({
                username: name, // Usamos el nombre de Google como username
                email: email,
                // No guardamos contraseña, ya que es login de Google
                // Opcional: podrías generar una contraseña aleatoria y segura
                password: `google_${googleId}`, // Placeholder seguro
                country: 'Desconocido', // O intenta obtenerlo de otra forma
            });
        }

        // Si el usuario ya existe, generamos un token para él
        const payload = { id: user._id };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            country: user.country,
            token: jwtToken,
        });

    } catch (error) {
        console.error('Error de autenticación con Google en el backend:', error);
        res.status(400).json({ message: 'Token de Google inválido.' });
    }
};
// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password, country } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe con este email.' });
    }

    // VALIDACIÓN DE CONTRASEÑA
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo.',
      });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      country,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        country: user.country,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos.' });
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error del servidor al registrar.' });
  }
};

// @desc    Autenticar un usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                country: user.country,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña inválidos.' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error del servidor al iniciar sesión.' });
    }
};