const express = require('express');
const { registerPatient, registerDoctor, login, logout , changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Separate routes for patient and doctor registration
router.post('/register-patient', registerPatient);
router.post('/register-doctor', registerDoctor);

router.post('/login', login);
router.post('/logout', logout);

router.post('/change-password', protect, changePassword);

module.exports = router;