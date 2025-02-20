'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Modal, Box, Typography, Snackbar, Alert, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import configDev from '../api/config';
import Navbar from '../components/Navbar';

interface Employee {
  id: string | number;
  name: string;
  email?: string;
  password?: string;
  position: string;
  role: string;
  department: string;
  address: string;
  status: string;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: '',
    name: '',
    position: '',
    role: '',
    department: '',
    address: '',
    email: '',
    password: '',
    status: 'active',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ data: Employee[] }>(`${configDev.admin}/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleInputChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (!selectedEmployee) return;
    setSelectedEmployee({ ...selectedEmployee, [e.target.name as string]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    if (!selectedEmployee) return;
    setSelectedEmployee({ ...selectedEmployee, [e.target.name]: e.target.value });
  };

  const handleNewEmployeeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setNewEmployee({ ...newEmployee, [e.target.name as string]: e.target.value });
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${configDev.admin}/employee/${selectedEmployee.id}`, selectedEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Employee updated successfully');
      setSnackbarSeverity('success');
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      setSnackbarMessage('Error updating employee');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
      setOpenModal(false);
    }
  };

  const handleDeleteEmployee = async (id: string | number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${configDev.admin}/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Employee deleted successfully');
      setSnackbarSeverity('success');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setSnackbarMessage('Error deleting employee');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      const employeeToAdd = { ...newEmployee, password: '****' };
      await axios.post('http://localhost:3004/api/cico/admin/add-employee', employeeToAdd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Employee added successfully');
      setSnackbarSeverity('success');
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      setSnackbarMessage('Error adding employee');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
      setOpenAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Employee Management</h1>
        <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>
          Add Employee
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.address}</TableCell>
                  <TableCell>{emp.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEditEmployee(emp)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteEmployee(emp.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
          {selectedEmployee && (
            <>
              <Typography variant="h6">Edit Employee</Typography>
              <TextField
                name="name"
                label="Name"
                fullWidth
                margin="normal"
                value={selectedEmployee.name || ''}
                onChange={handleInputChange}
              />
              <TextField
                name="position"
                label="Position"
                fullWidth
                margin="normal"
                value={selectedEmployee.position || ''}
                onChange={handleInputChange}
              />
              <TextField
                name="role"
                label="Role"
                fullWidth
                margin="normal"
                value={selectedEmployee.role || ''}
                onChange={handleInputChange}
              />
              <TextField
                name="department"
                label="Department"
                fullWidth
                margin="normal"
                value={selectedEmployee.department || ''}
                onChange={handleInputChange}
              />
              <TextField
                name="address"
                label="Address"
                fullWidth
                margin="normal"
                value={selectedEmployee.address || ''}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={selectedEmployee.status || ''}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleUpdateEmployee}>Update</Button>
              <Button onClick={() => setOpenModal(false)}>Close</Button>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
          <Typography variant="h6">Add Employee</Typography>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            value={newEmployee.name}
            onChange={handleNewEmployeeChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={newEmployee.email || ''}
            onChange={handleNewEmployeeChange}
          />
          <TextField
            name="password"
            label="Password"
            fullWidth
            margin="normal"
            value={newEmployee.password || ''}
            onChange={handleNewEmployeeChange}
          />
          <TextField
            name="position"
            label="Position"
            fullWidth
            margin="normal"
            value={newEmployee.position}
            onChange={handleNewEmployeeChange}
          />
          <TextField
            name="department"
            label="Department"
            fullWidth
            margin="normal"
            value={newEmployee.department}
            onChange={handleNewEmployeeChange}
          />
          <TextField
            name="address"
            label="Address"
            fullWidth
            margin="normal"
            value={newEmployee.address}
            onChange={handleNewEmployeeChange}
          />
          <Button variant="contained" color="primary" onClick={handleAddEmployee}>Add</Button>
          <Button onClick={() => setOpenAddModal(false)}>Close</Button>
        </Box>
      </Modal>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployeeManagement;