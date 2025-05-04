import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import SalaryForm from "./components/SalaryForm";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        {/* Section Title */}
        <div className="mb-4 text-center">
          <h2 style={{ color: "#402978" }}>Axteno Books – Smart Accounting Assistant</h2>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Navigate through salary details, add employee records, and configure position-based salary settings.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          <Link to="/" className="btn btn-outline-primary">Salary Details</Link>
          <Link to="/add-employee" className="btn btn-outline-success">Add Employee</Link>
          <Link to="/settings" className="btn btn-outline-primary">Settings</Link>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-employee" element={<SalaryForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/crud" element={<div>CRUD Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
