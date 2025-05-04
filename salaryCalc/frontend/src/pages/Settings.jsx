import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const POSITIONS = ['Manager', 'Developer', 'Designer', 'Accountant', 'Clerk'];

const Settings = () => {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [settings, setSettings] = useState({
    baseSalary: 0,
    epfPercentage: 8,
    etfPercentage: 3,
    transportAllowance: 2500,
    overtimeRate: 500
  });

  const [positionSettings, setPositionSettings] = useState(() => {
    const savedSettings = localStorage.getItem('positionSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      Manager: {
        baseSalary: 120000,
        epfPercentage: 8,
        etfPercentage: 3,
        transportAllowance: 5000,
        overtimeRate: 1000
      },
      Developer: {
        baseSalary: 90000,
        epfPercentage: 8,
        etfPercentage: 3,
        transportAllowance: 4000,
        overtimeRate: 800
      },
      Designer: {
        baseSalary: 80000,
        epfPercentage: 8,
        etfPercentage: 3,
        transportAllowance: 3500,
        overtimeRate: 700
      },
      Accountant: {
        baseSalary: 75000,
        epfPercentage: 8,
        etfPercentage: 3,
        transportAllowance: 3000,
        overtimeRate: 600
      },
      Clerk: {
        baseSalary: 60000,
        epfPercentage: 8,
        etfPercentage: 3,
        transportAllowance: 2500,
        overtimeRate: 500
      }
    };
  });

  useEffect(() => {
    if (selectedPosition) {
      setSettings(positionSettings[selectedPosition]);
    }
  }, [selectedPosition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPosition) {
      alert('Please select a position first');
      return;
    }
    
    // Update settings for the selected position
    const updatedPositionSettings = {
      ...positionSettings,
      [selectedPosition]: settings
    };
    
    setPositionSettings(updatedPositionSettings);
    localStorage.setItem('positionSettings', JSON.stringify(updatedPositionSettings));
    alert('Settings saved successfully!');
  };

  return (
    <Card className="p-4">
      <h2>Position-based Salary Settings</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Position</Form.Label>
          <Form.Select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            required
          >
            <option value="">Choose a position</option>
            {POSITIONS.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedPosition && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Salary (Rs.)</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    value={settings.baseSalary}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Transport Allowance (Rs.)</Form.Label>
                  <Form.Control
                    type="number"
                    name="transportAllowance"
                    value={settings.transportAllowance}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>EPF Percentage (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="epfPercentage"
                    value={settings.epfPercentage}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ETF Percentage (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="etfPercentage"
                    value={settings.etfPercentage}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Overtime Rate (Rs./hour)</Form.Label>
              <Form.Control
                type="number"
                name="overtimeRate"
                value={settings.overtimeRate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Settings for {selectedPosition}
            </Button>
          </>
        )}
      </Form>
    </Card>
  );
};

export default Settings; 