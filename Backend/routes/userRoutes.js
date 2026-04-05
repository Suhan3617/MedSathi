const express = require('express');
const { deactivateAccount, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ... existing routes
router.put('/deactivate', protect, deactivateAccount);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;