import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";

const SalaryDisplay = ({ employee }) => {
  const { baseSalary, overtimeHours, salaryMonth, experience, position } = employee;
  const [settings, setSettings] = useState({
    epfPercentage: 8,
    etfPercentage: 3,
    transportAllowance: 2500,
    overtimeRate: 500
  });

  useEffect(() => {
    // Load position-based settings from localStorage
    const savedSettings = localStorage.getItem('positionSettings');
    if (savedSettings) {
      const positionSettings = JSON.parse(savedSettings);
      if (position && positionSettings[position]) {
        setSettings(positionSettings[position]);
      }
    }
  }, [position]);

  const epf = baseSalary * (settings.epfPercentage / 100);
  const etf = baseSalary * (settings.etfPercentage / 100);
  const overtimePay = overtimeHours * settings.overtimeRate;
  const grossSalary = baseSalary + overtimePay + settings.transportAllowance;
  const netSalary = grossSalary - (epf + etf);

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title><strong>{employee.name} (ID: {employee.id})</strong></Card.Title>
        <p><strong>Position:</strong> {position}</p>
        <p><strong>Salary Month:</strong> {salaryMonth}</p>
        <p><strong>Experience:</strong> {experience} years</p>
        <p><strong>Base Salary:</strong> Rs. {baseSalary}</p>
        <p><strong>Overtime Pay:</strong> Rs. {overtimePay}</p>
        <p><strong>Transport Allowance:</strong> Rs. {settings.transportAllowance}</p>
        <p><strong>EPF ({settings.epfPercentage}%):</strong> Rs. {epf}</p>
        <p><strong>ETF ({settings.etfPercentage}%):</strong> Rs. {etf}</p>
        <h5><strong>Net Salary:</strong> Rs. {netSalary}</h5>
      </Card.Body>
    </Card>
  );
};

export default SalaryDisplay;
