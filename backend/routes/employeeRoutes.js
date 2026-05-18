const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').get(getEmployees).post(addEmployee);
router.get('/search', searchEmployees);
router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
