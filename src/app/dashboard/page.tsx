"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MenuItem,
  Avatar,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Modal,
  Box,
  Typography,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import configDev from "../api/config";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [employees, setEmployees] = useState<
    {
      id: string | number;
      name: string;
      department: string;
      status: string;
      role: string;
    }[]
  >([]);
  const [attendance, setAttendance] = useState<
    {
      id: string | number;
      user_id: string | number;
      clock_in: string;
      clock_out: string;
      location_clockin: string;
      location_clockout: string;
      createdAt: string;
      evidence_photo_clockin: string;
      evidence_photo_clockout: string;
    }[]
  >([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [inactiveEmployees, setInactiveEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string | number;
    name: string;
    email: string;
    department: string;
    position: string;
    photo_profile: string;
    role: string;
  } | null>(null);
  const [searchName, setSearchName] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${configDev.admin}/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setEmployees(response.data.data);
        setTotalEmployees(response.data.count);
        setInactiveEmployees(
          response.data.data.filter(
            (emp: { status: string }) => emp.status !== "active",
          ).length,
        );
      })
      .catch((error) => console.error("Error fetching employees:", error));

    axios
      .get(`${configDev.admin}/employee/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAttendance(response.data.data);
        const today = new Date().toISOString().split("T")[0];
        const todayAttendance = response.data.data.filter((att: any) =>
          att.createdAt.startsWith(today),
        );
        setPresentToday(
          new Set(todayAttendance.map((att: any) => att.user_id)).size,
        );
      })
      .catch((error) => console.error("Error fetching attendance:", error));
  }, [router]);

  const data = {
    labels: ["Total Employees", "Inactive Employees", "Present Today"],
    datasets: [
      {
        label: "Employee Stats",
        data: [totalEmployees, inactiveEmployees, presentToday],
        backgroundColor: ["#4CAF50", "#FF5733", "#3498DB"],
      },
    ],
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          | HTMLInputElement
          | HTMLTextAreaElement
          | { name?: string; value: unknown }
        >
      | SelectChangeEvent<string>,
  ) => {
    if (!selectedEmployee) return;

    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | { name?: string; value: unknown };
    setSelectedEmployee((prevEmployee) =>
      prevEmployee ? { ...prevEmployee, [name as string]: value } : null,
    );
  };

  const handleViewProfile = async (id: string | number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${configDev.admin}/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employee = response.data.data;
      setSelectedEmployee(employee);
      setModalContent(
        <form>
          <Typography variant="h6">Update Employee Details</Typography>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedEmployee?.name || ""}
            onChange={handleInputChange}
          />

          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedEmployee?.email || ""}
            onChange={handleInputChange}
          />

          <TextField
            label="Department"
            name="department"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedEmployee?.department || ""}
            onChange={handleInputChange}
          />

          <TextField
            label="Position"
            name="position"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedEmployee?.position || ""}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={selectedEmployee?.role || ""}
              onChange={handleInputChange}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <img
            src={employee.photo_profile}
            alt="Profile"
            className="w-24 h-24 rounded-full mt-2"
          />
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </form>,
      );
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg flex justify-center">
          <Bar data={data} />
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex gap-4">
          <TextField
            label="Search Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Attendance Table */}
        <TableContainer component={Paper} className="mt-6 max-w-6xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Photo In</TableCell>
                <TableCell>Clock In</TableCell>
                <TableCell>Location In</TableCell>
                <TableCell>Photo Out</TableCell>
                <TableCell>Clock Out</TableCell>
                <TableCell>Location Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance
                .filter(
                  (att) =>
                    (searchName
                      ? employees
                          .find((emp) => emp.id === att.user_id)
                          ?.name.toLowerCase()
                          .includes(searchName.toLowerCase())
                      : true) &&
                    (departmentFilter
                      ? employees.find((emp) => emp.id === att.user_id)
                          ?.department === departmentFilter
                      : true) &&
                    (dateFilter ? att.createdAt.startsWith(dateFilter) : true),
                )
                .map((att) => {
                  const user = employees.find((emp) => emp.id === att.user_id);
                  return (
                    <TableRow key={att.id}>
                      <TableCell>{user?.name || ""}</TableCell>
                      <TableCell>{user?.department || ""}</TableCell>
                      <TableCell>
                        <img
                          src={att.evidence_photo_clockin}
                          alt="Clock In"
                          className="w-16 h-16"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(att.clock_in).toLocaleString()}
                      </TableCell>
                      <TableCell>{att.location_clockin}</TableCell>
                      <TableCell>
                        <img
                          src={att.evidence_photo_clockout}
                          alt="Clock Out"
                          className="w-16 h-16"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(att.clock_out).toLocaleString()}
                      </TableCell>
                      <TableCell>{att.location_clockout}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Employee Detail Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {modalContent}
        </Box>
      </Modal>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
