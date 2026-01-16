const express = require('express');
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');  // ← Import adminAuth

const router = express.Router();

// All admin routes require admin authentication
router.get('/stats', adminAuth, adminController.getAdminStats);

module.exports = router;
