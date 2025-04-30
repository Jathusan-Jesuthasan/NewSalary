const Employee = require('../models/Employee');


const addEmployee = async (req, res) => {
  try {
    const { id, name, baseSalary, overtimeHours, salaryMonth, experience } = req.body;

    
    const newEmployee = new Employee({
      id,
      name,
      baseSalary,
      overtimeHours,
      salaryMonth,
      experience
    });

  
    await newEmployee.save();

    res.status(201).json({
      message: 'Employee added successfully',
      employee: newEmployee
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding employee',
      error: error.message
    });
  }
};


const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching employees',
      error: error.message
    });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedEmployee = await Employee.findOneAndUpdate({ id }, updatedData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating employee',
      error: error.message
    });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findOneAndDelete({ id });

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee deleted successfully',
      employee: deletedEmployee
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

module.exports = { addEmployee, getAllEmployees, updateEmployee, deleteEmployee };
