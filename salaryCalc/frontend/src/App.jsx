import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import SalaryForm from "./components/SalaryForm";


const App = () => {
  return (
    <Router>
      <div className="container mt-3">
        <nav>
          <Link to="/" className="btn btn-primary me-2">Salary Details</Link> 
          <Link to="/add-employee" className="btn btn-success me-2">Add Employee</Link>
          <Link to="/settings" className="btn btn-primary">Settings</Link><br/>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-employee" element={<SalaryForm />} />
          <Route path="/crud" element={<table />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;




