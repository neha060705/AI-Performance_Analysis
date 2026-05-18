const express = require('express');
const router = express.Router();
const { getRecommendation, getEmployeeRankings } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/recommend', getRecommendation);
router.get('/rankings', getEmployeeRankings);

module.exports = router;
