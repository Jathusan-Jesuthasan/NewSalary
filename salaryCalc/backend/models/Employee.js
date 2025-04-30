const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  overtimeHours: { type: Number, required: true },
  salaryMonth: { type: String, required: true },
  experience: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
