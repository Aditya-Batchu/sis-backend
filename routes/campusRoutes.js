const express = require('express');
const router = express.Router();
const {
  getCampuses,
  getCampusStats,
  getCampusById,
  createCampus,
  updateCampus,
  deleteCampus,
} = require('../controllers/campusController');

// Stats route (place before /:id to prevent routing collision)
router.get('/stats', getCampusStats);

// Base CRUD routes
router.route('/')
  .get(getCampuses)
  .post(createCampus);

router.route('/:id')
  .get(getCampusById)
  .put(updateCampus)
  .delete(deleteCampus);

module.exports = router;
