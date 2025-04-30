import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const EmployeeList = ({ employees }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Employee List</Card.Title>
        {employees.length > 0 ? (
          <ListGroup>
            {employees.map((employee) => (
              <ListGroup.Item 
                key={employee.id} 
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{employee.name}</strong> (ID: {employee.id})
                  <div className="text-muted small">
                    Experience: {employee.experience} years (since {employee.jobStartYear})
                  </div>
                </div>
                <div className="text-end">
                  <div>{employee.salaryMonth}</div>
                  <div className="text-muted small">
                    Base: {formatCurrency(employee.baseSalary)}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-muted">No employees found</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmployeeList;