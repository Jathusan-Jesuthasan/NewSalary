import { Card } from "react-bootstrap";

const SalaryDisplay = ({ employee }) => {
  const { baseSalary, overtimeHours, salaryMonth, experience } = employee;

  const epf = baseSalary * 0.08;
  const etf = baseSalary * 0.03;
  const overtimeRate = 500;
  const overtimePay = overtimeHours * overtimeRate;
  const transportAllowance = 2500;
  const grossSalary = baseSalary + overtimePay + transportAllowance;
  const netSalary = grossSalary - (epf + etf);

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title><strong>{employee.name} (ID: {employee.id})</strong></Card.Title>
        <p><strong>Salary Month:</strong> {salaryMonth}</p>
        <p><strong>Experience:</strong> {experience} years</p>
        <p><strong>Base Salary:</strong> Rs. {baseSalary}</p>
        <p><strong>Overtime Pay:</strong> Rs. {overtimePay}</p>
        <p><strong>Transport Allowance:</strong> Rs. {transportAllowance}</p>
        <p><strong>EPF (8%):</strong> Rs. {epf}</p>
        <p><strong>ETF (3%):</strong> Rs. {etf}</p>
        <h5><strong>Net Salary:</strong> Rs. {netSalary}</h5>
      </Card.Body>
    </Card>
  );
};

export default SalaryDisplay;
