import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Toast, ToastContainer, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaBriefcase, FaCode, FaPaintBrush, FaCalculator, FaUserAlt } from 'react-icons/fa';

const POSITIONS = ['Manager', 'Developer', 'Designer', 'Accountant', 'Clerk'];

const Settings = () => {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [showToast, setShowToast] = useState(false);
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
      const positionSetting = positionSettings[selectedPosition] || {
        baseSalary: 0,
        epfPercentage: 8,
        etfPercentage: 3,
        transportAllowance: 2500,
        overtimeRate: 500
      };
      setSettings(positionSetting);
    }
  }, [selectedPosition, positionSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
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
    
    // Trigger both storage event and custom event
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('positionSettingsUpdated'));
    
    setShowToast(true);
  };

  return (
    <>
      <Card className="p-4 shadow-lg rounded-3" style={{ backgroundColor: '#f9fafb' }}>
        <h3 className="text-center mb-3" style={{ color: '#402978', fontFamily: 'Axteno, sans-serif' }}>
          Position-Based Salary Settings
        </h3>
        <p className="text-muted text-center mb-4" style={{ fontSize: '14px' }}>
          Select a job position to customize salary details including base salary, EPF/ETF rates, allowances, and overtime rate. 
          These values will be auto-applied when adding a new employee.
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Position</Form.Label>
            <Form.Select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              required
              autoFocus
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
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Base salary for the selected position</Tooltip>}
                    >
                      <span className="d-inline-block ms-2" style={{ fontSize: '16px', cursor: 'help' }}>?</span>
                    </OverlayTrigger>
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

              <div className="text-end">
                <Button variant="primary" type="submit" style={{ backgroundColor: '#402978', borderColor: '#402978' }}>
                  Save Settings for {selectedPosition}
                </Button>
              </div>
            </>
          )}
        </Form>
      </Card>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={2500} autohide bg="success">
          <Toast.Body className="text-white">Settings saved successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Settings;
