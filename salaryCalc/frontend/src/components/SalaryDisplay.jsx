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

  // Load position settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('positionSettings');
      if (savedSettings) {
        const positionSettings = JSON.parse(savedSettings);
        if (position && positionSettings[position]) {
          setSettings(positionSettings[position]);
        } else {
          // Use default settings if position settings not found
          setSettings({
            epfPercentage: 8,
            etfPercentage: 3,
            transportAllowance: 2500,
            overtimeRate: 500
          });
        }
      }
    };

    // Load settings initially
    loadSettings();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'positionSettings') {
        loadSettings();
      }
    };

    // Add event listener for custom storage event
    const handleCustomStorageEvent = () => {
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('positionSettingsUpdated', handleCustomStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('positionSettingsUpdated', handleCustomStorageEvent);
    };
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
        <p><strong>Base Salary:</strong> Rs. {baseSalary.toLocaleString()}</p>
        <p><strong>Overtime Pay:</strong> Rs. {overtimePay.toLocaleString()}</p>
        <p><strong>Transport Allowance:</strong> Rs. {settings.transportAllowance.toLocaleString()}</p>
        <p><strong>EPF ({settings.epfPercentage}%):</strong> Rs. {epf.toLocaleString()}</p>
        <p><strong>ETF ({settings.etfPercentage}%):</strong> Rs. {etf.toLocaleString()}</p>
        <h5><strong>Net Salary:</strong> Rs. {netSalary.toLocaleString()}</h5>
      </Card.Body>
    </Card>
  );
};

export default SalaryDisplay;
