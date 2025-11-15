const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');  // ← Use destructuring

const router = express.Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  authController.login
);

router.get('/profile', auth, authController.getProfile);
router.put('/preferences', auth, authController.updatePreferences);
router.get('/stats', auth, authController.getUserStats);

module.exports = router;
