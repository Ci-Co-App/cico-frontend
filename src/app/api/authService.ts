import axios from 'axios';
import configDev from '../api/config';

export const loginUser = async (email: string, password: string) => {
  try {
    const apiUrl = `${configDev.authentication}/login`;

    console.log("Sending login request to:", apiUrl);

    const response = await axios.post(apiUrl, { email, password });

    return response.data; // Ensure this includes { token, role }
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Login failed. Please try again.');
  }
};

export const registerUser = async (name: string, email: string, password: string, role: string) => {
  try {
    const apiUrl = `${configDev.authentication}/register`;

    console.log("Sending registration request to:", apiUrl);

    const response = await axios.post(apiUrl, { name, email, password, role });

    return response.data; // Expected response: { message, user }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Registration failed. Please try again.');
  }
};