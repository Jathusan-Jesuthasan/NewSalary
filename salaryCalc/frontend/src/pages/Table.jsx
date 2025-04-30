// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EmployeeTable = () => {
//   const [employees, setEmployees] = useState([]);
//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     baseSalary: '',
//     overtimeHours: '',
//     salaryMonth: 'March 2024',
//     experience: ''
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/employees');
//         setEmployees(res.data);
//       } catch (err) {
//         console.error('Error fetching employees:', err);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`http://localhost:5000/api/employees/${editingId}`, formData);
//       } else {
//         await axios.post('http://localhost:5000/api/add-employee', formData);
//       }
//       const res = await axios.get('http://localhost:5000/api/employees');
//       setEmployees(res.data);
//       resetForm();
//     } catch (err) {
//       console.error('Error saving employee:', err);
//     }
//   };

//   const handleEdit = (emp) => {
//     setFormData(emp);
//     setEditingId(emp.id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/employees/${id}`);
//       setEmployees(employees.filter(emp => emp.id !== id));
//     } catch (err) {
//       console.error('Error deleting employee:', err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       id: '',
//       name: '',
//       baseSalary: '',
//       overtimeHours: '',
//       salaryMonth: 'March 2024',
//       experience: ''
//     });
//     setEditingId(null);
//   };

//   return (
//     <div className="container">
//       <h1>Employee Management</h1>
      
//       <form onSubmit={handleSubmit} className="form-container">
//         <table className="form-table">
//           <tbody>
//             <tr>
//               <td><label>ID:</label></td>
//               <td>
//                 <input 
//                   type="text" 
//                   name="id" 
//                   value={formData.id}
//                   onChange={handleChange}
//                   required
//                   disabled={!!editingId}
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td><label>Name:</label></td>
//               <td>
//                 <input 
//                   type="text" 
//                   name="name" 
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td><label>Base Salary:</label></td>
//               <td>
//                 <input 
//                   type="number" 
//                   name="baseSalary" 
//                   value={formData.baseSalary}
//                   onChange={handleChange}
//                   required
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td><label>Overtime Hours:</label></td>
//               <td>
//                 <input 
//                   type="number" 
//                   name="overtimeHours" 
//                   value={formData.overtimeHours}
//                   onChange={handleChange}
//                   required
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td><label>Salary Month:</label></td>
//               <td>
//                 <input 
//                   type="text" 
//                   name="salaryMonth" 
//                   value={formData.salaryMonth}
//                   onChange={handleChange}
//                   required
//                 />
//               </td>
//             </tr>
//             <tr>
//               <td><label>Experience (yrs):</label></td>
//               <td>
//                 <input 
//                   type="number" 
//                   name="experience" 
//                   value={formData.experience}
//                   onChange={handleChange}
//                   required
//                 />
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <div className="form-actions">
//           <button type="submit">
//             {editingId ? 'Update' : 'Add'} Employee
//           </button>
//           {editingId && (
//             <button type="button" onClick={resetForm}>
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Employee Table */}
//       <table className="employee-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Base Salary</th>
//             <th>Overtime</th>
//             <th>Month</th>
//             <th>Experience</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map(emp => (
//             <tr key={emp.id}>
//               <td>{emp.id}</td>
//               <td>{emp.name}</td>
//               <td>${emp.baseSalary.toLocaleString()}</td>
//               <td>{emp.overtimeHours} hrs</td>
//               <td>{emp.salaryMonth}</td>
//               <td>{emp.experience} yrs</td>
//               <td>
//                 <button onClick={() => handleEdit(emp)}>Edit</button>
//                 <button 
//                   onClick={() => handleDelete(emp.id)}
//                   className="delete-btn"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <style jsx>{`
//         .container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .form-container {
//           background: #f5f5f5;
//           padding: 20px;
//           margin-bottom: 30px;
//           border-radius: 5px;
//         }
//         .form-table {
//           margin-bottom: 15px;
//         }
//         .form-table td {
//           padding: 5px 10px;
//         }
//         .form-actions button {
//           margin-right: 10px;
//           padding: 5px 15px;
//         }
//         .employee-table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         .employee-table th, 
//         .employee-table td {
//           border: 1px solid #ddd;
//           padding: 8px;
//           text-align: left;
//         }
//         .employee-table th {
//           background-color: #f2f2f2;
//         }
//         .employee-table button {
//           margin-right: 5px;
//           padding: 3px 8px;
//         }
//         .delete-btn {
//           background-color: #ff4444;
//           color: white;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EmployeeTable;