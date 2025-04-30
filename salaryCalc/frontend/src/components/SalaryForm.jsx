import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import EmployeeList from "./EmployeeList";

const POSITION_SALARY_MAP = {
  Manager: 120000,
  Developer: 90000,
  Designer: 80000,
  Accountant: 75000,
  Clerk: 60000,
};

const SalaryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    baseSalary: "",
    overtimeHours: 0,
    salaryMonth: "",
    jobStartYear: new Date().getFullYear(),
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const navigate = useNavigate();

  const calculateExperience = (startYear) => {
    const currentYear = new Date().getFullYear();
    const validStartYear = parseInt(startYear) || currentYear;
    return currentYear - validStartYear;
  };

  const generateEmployeeId = () => {
    const lastEmployee = employees[employees.length - 1];
    if (!lastEmployee) return "EMP001";

    const lastIdNumber = parseInt(lastEmployee.id.replace("EMP", ""));
    const nextIdNumber = lastIdNumber + 1;
    return `EMP${nextIdNumber.toString().padStart(3, "0")}`;
  };

  const handleToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 3000);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (error) {
        handleToast("Failed to fetch employee data", "danger");
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "position") {
      const defaultSalary = POSITION_SALARY_MAP[value] || 0;
      setFormData((prev) => ({
        ...prev,
        position: value,
        baseSalary: defaultSalary,
      }));
      return;
    }

    if (["baseSalary", "overtimeHours"].includes(name)) {
      updatedValue = parseFloat(value) || 0;
    } else if (name === "jobStartYear") {
      updatedValue = parseInt(value) || new Date().getFullYear();
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData = {
        ...formData,
        id: generateEmployeeId(),
        experience: calculateExperience(formData.jobStartYear),
      };

      const response = await axios.post("http://localhost:5000/api/add-employee", employeeData);
      setEmployees([...employees, response.data]);
      handleToast("Employee added successfully!");

      setFormData({
        name: "",
        position: "",
        baseSalary: "",
        overtimeHours: 0,
        salaryMonth: "",
        jobStartYear: new Date().getFullYear(),
      });
    } catch (error) {
      handleToast("Failed to add employee", "danger");
    } finally {
      setLoading(false);
    }
  };

  const totalSalary =
    parseFloat(formData.baseSalary || 0) + parseFloat(formData.overtimeHours || 0) * 150;

  return (
    <div className="container mt-5">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Add New Employee</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select position</option>
                    {Object.keys(POSITION_SALARY_MAP).map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Start Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="jobStartYear"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={formData.jobStartYear}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Experience: {calculateExperience(formData.jobStartYear)} years
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salary Month</Form.Label>
                  <Form.Control
                    type="month"
                    name="salaryMonth"
                    value={formData.salaryMonth}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    min="0"
                    step="0.01"
                    value={formData.baseSalary}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Overtime Hours</Form.Label>
                  <Form.Control
                    type="number"
                    name="overtimeHours"
                    min="0"
                    value={formData.overtimeHours}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3">
              <strong>Basic Salary (Preview): Rs. {totalSalary.toLocaleString()}</strong>
            </div>

            <Button variant="primary" type="submit" disabled={loading || !formData.position}>
              {loading ? "Adding..." : "Add Employee"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <EmployeeList employees={employees} />

      {/* Toast Notifications */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SalaryForm;
