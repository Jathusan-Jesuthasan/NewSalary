import React, { useState, useEffect } from "react";
import SalaryDisplay from "../components/SalaryDisplay";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaEdit, FaTrashAlt, FaDownload, FaUserAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employee data");
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete.id}`);
      setEmployees(prev => prev.filter(employee => employee.id !== employeeToDelete.id));
      toast.success("Employee deleted successfully");
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Failed to delete employee");
    } finally {
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditEmployee({ ...employee });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editEmployee.name.trim() || editEmployee.baseSalary <= 0 || editEmployee.overtimeHours < 0) {
      toast.error("Please fill out valid employee details");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${editEmployee.id}`,
        editEmployee
      );
      setEmployees(prev => 
        prev.map(emp => (emp.id === editEmployee.id ? response.data.employee : emp))
      );
      toast.success("Employee updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Failed to update employee");
    }
  };

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Base Salary", "Overtime Hours", "Salary Month", "Net Salary"];
    const rows = filteredEmployees.map(employee => {
      const { id, name, baseSalary, overtimeHours, salaryMonth } = employee;
      const overtimePay = overtimeHours * 500;
      const transportAllowance = 2500;
      const grossSalary = baseSalary + overtimePay + transportAllowance;
      const epf = baseSalary * 0.08;
      const etf = baseSalary * 0.03;
      const netSalary = grossSalary - (epf + etf);
      
      return [id, name, baseSalary, overtimeHours, salaryMonth, netSalary];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${filterMonth || 'all'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEmployees = employees.filter(employee => {
    const { name, id, salaryMonth } = employee;
    const searchTermLower = searchTerm.toLowerCase();
    
    // Convert "YYYY-MM" format to month name for filtering
    const [year, month] = salaryMonth.split('-');
    const monthIndex = parseInt(month) - 1;
    const monthName = months[monthIndex];
    
    const matchesSearch = 
      name.toLowerCase().includes(searchTermLower) ||
      id.toLowerCase().includes(searchTermLower);
    
    const matchesMonth = 
      !filterMonth || 
      monthName.toLowerCase() === filterMonth.toLowerCase();
    
    return matchesSearch && matchesMonth;
  });

  // Calculate summary statistics
  const totalSalary = filteredEmployees.reduce(
    (acc, emp) => acc + emp.baseSalary + (emp.overtimeHours * 500) + 2500, 
    0
  );
  
  const totalEPF = filteredEmployees.reduce(
    (acc, emp) => acc + (emp.baseSalary * 0.08), 
    0
  );
  
  const totalOvertimePay = filteredEmployees.reduce(
    (acc, emp) => acc + (emp.overtimeHours * 500),
    0
  );

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4" style={{ color: "#402978" }}>
        <FaUserAlt /> Employee Salary Management
      </h1>
      
      {/* Filter Controls */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <Form.Control
                type="text"
                placeholder="Search by Name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="">All Months</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                style={{ backgroundColor: '#402978', borderColor: '#402978' }}
                variant="success" 
                className="w-100"
                onClick={downloadCSV}
              >
                <FaDownload /> Export CSV
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title><MdWork /> Employees</Card.Title>
              <Card.Text className="display-6">
                {filteredEmployees.length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Total Salary</Card.Title>
              <Card.Text className="display-6">
                Rs. {totalSalary.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Total EPF</Card.Title>
              <Card.Text className="display-6">
                Rs. {totalEPF.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Overtime Pay</Card.Title>
              <Card.Text className="display-6">
                Rs. {totalOvertimePay.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Employee List */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading employee data...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredEmployees.map(employee => (
            <Col key={employee.id}>
              <SalaryDisplay employee={employee} />
              <div className="d-flex justify-content-center">
                <Button 
                  variant="outline-warning" 
                  className="me-2"
                  onClick={() => handleEditEmployee(employee)}
                >
                  <FaEdit /> Edit
                </Button>
                <Button 
                  variant="outline-danger"
                  onClick={() => handleDeleteClick(employee)}
                >
                  <FaTrashAlt /> Delete
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><FaEdit /> Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEmployee && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => 
                    setEditEmployee({ ...editEmployee, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Base Salary</Form.Label>
                <Form.Control
                  type="number"
                  value={editEmployee.baseSalary}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, baseSalary: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Overtime Hours</Form.Label>
                <Form.Control
                  type="number"
                  value={editEmployee.overtimeHours}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, overtimeHours: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {employeeToDelete?.name} (ID: {employeeToDelete?.id})?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer />
    </Container>
  );
};

export default Home;
