import React, { useState, useEffect } from "react";
import SalaryDisplay from "../components/SalaryDisplay";
import { Container, Row, Col, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/employees")
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setError("Failed to load employee data");
        setLoading(false);
        toast.error("Failed to load employee data"); // Show error toast
      });
  }, []);

  // Delete employee
  const handleDeleteEmployee = (id) => {
    axios.delete(`http://localhost:5000/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(employee => employee.id !== id));
        toast.success("Employee deleted successfully"); // Show success toast
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee"); // Show error toast
      });
  };

  // Open Edit Modal with Employee Data
  const handleEditEmployee = (employee) => {
    setEditEmployee(employee);
    setShowEditModal(true);
  };

  // Update Employee Data with validation
  const handleSaveEdit = () => {
    if (!editEmployee.name.trim()) {
      toast.error("Name cannot be empty"); // Show error toast
      return;
    }

    if (editEmployee.baseSalary <= 0) {
      toast.error("Base salary must be a positive number"); // Show error toast
      return;
    }

    if (editEmployee.overtimeHours < 0) {
      toast.error("Overtime hours cannot be negative"); // Show error toast
      return;
    }

    axios.put(`http://localhost:5000/api/employees/${editEmployee.id}`, editEmployee)
      .then((response) => {
        setEmployees(employees.map(emp => (emp.id === editEmployee.id ? response.data.employee : emp)));
        setShowEditModal(false);
        toast.success("Employee updated successfully"); // Show success toast
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        toast.error("Failed to update employee"); // Show error toast
      });
  };

  // Function to export employee data as CSV
  const downloadCSV = () => {
    const headers = ["ID", "Name", "Base Salary", "Overtime Hours", "Experience"];
    const rows = employees.map((employee) => [
      employee.id,
      employee.name,
      employee.baseSalary,
      employee.overtimeHours,
      employee.experience,
    ]);

    // Creating CSV string
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");

    // Creating a Blob for CSV and triggering download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees.csv"; // Default file name
    link.click(); // Programmatically click the link to trigger download
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <h1 className="text-center fw-bold">Welcome to Axento Books</h1>
      <p className="text-center lead">Smart Accounting Assistant for Salary Calculation</p>

      <input
        type="text"
        placeholder="Search by Name or ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />

      <Button onClick={downloadCSV} variant="success" className="mb-3">
        Download CSV
      </Button>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading employees...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          {filteredEmployees.map((employee) => (
            <Col key={employee.id} md={4} className="mb-3">
              <SalaryDisplay employee={employee} />
              <Button onClick={() => handleEditEmployee(employee)} variant="warning" className="m-1">
                Edit
              </Button>
              <Button onClick={() => handleDeleteEmployee(employee.id)} variant="danger" className="m-1">
                Delete
              </Button>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEmployee && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Base Salary</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={editEmployee.baseSalary}
                  onChange={(e) => setEditEmployee({ ...editEmployee, baseSalary: Number(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Overtime Hours</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={editEmployee.overtimeHours}
                  onChange={(e) => setEditEmployee({ ...editEmployee, overtimeHours: Number(e.target.value) })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Experience (Years)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={editEmployee.experience}
                  onChange={(e) => setEditEmployee({ ...editEmployee, experience: Number(e.target.value) })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast container for showing messages */}
      <ToastContainer />
    </Container>
  );
};

export default Home;
