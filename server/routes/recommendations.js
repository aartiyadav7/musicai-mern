const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { auth } = require('../middleware/auth');  

const router = express.Router();

router.get('/', auth, recommendationController.getRecommendations);
router.get('/mood/:mood', auth, recommendationController.getRecommendationsByMood);

module.exports = router;
