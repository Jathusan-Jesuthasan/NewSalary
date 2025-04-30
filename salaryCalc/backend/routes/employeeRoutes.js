const express = require('express');
const { addEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

const router = express.Router();

router.post('/add-employee', addEmployee);
router.get('/employees', getAllEmployees);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

module.exports = router;
