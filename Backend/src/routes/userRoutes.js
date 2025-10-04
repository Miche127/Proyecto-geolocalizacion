// backend/src/routes/userRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addVideoToHistory, getHistory } = require('../controllers/userController');

const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const user = require('../models/user'); 

router.post('/history', protect, addVideoToHistory);
router.get('/history', protect, getHistory);

module.exports = router;