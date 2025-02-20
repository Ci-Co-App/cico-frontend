'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

import InputField from '../components/InputField';
import ButtonProps from '../components/ButtonProps';
import { loginUser } from '../api/authService';
import { User } from '../models/user';

const LoginPage = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('❌ Please fill in all fields', { position: 'top-center', theme: 'colored' });
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(formData.email, formData.password);
      console.log('Login response data:', data); // Debugging step
      localStorage.setItem('token', data.token);

      toast.success('🎉 Login successful!', { position: 'top-center', theme: 'colored' });

      // Assuming the response contains the user role
      const userRole = data.role;
      console.log('User role:', userRole); // Debugging step

      setTimeout(() => {
        if (userRole === 'admin') {
          router.push('/dashboard');
        } else if (userRole === 'employee') {
          router.push('/cico');
        } else {
          console.error('Unknown user role:', userRole); // Debugging step
        }
      }, 2000);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { position: 'top-center', theme: 'colored' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] text-white px-6">
      <ToastContainer autoClose={3000} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/20 w-full max-w-lg"
      >
        <h2 className="text-4xl font-extrabold text-center mb-6 text-yellow-300 drop-shadow-md">🚀 Welcome Back</h2>
        <p className="text-center text-gray-200 mb-6">Login to access your dashboard</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          
          <ButtonProps 
            type="submit" 
            text={loading ? '🔄 Logging in...' : '🚀 Login'} 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 rounded-lg hover:from-orange-500 hover:to-yellow-400 transition-all transform hover:scale-105"
          />
        </form>

        <div className="text-center mt-6 text-gray-300">
          <p>
            Don't have an account? 
            <span 
              className="text-yellow-400 hover:underline cursor-pointer" 
              onClick={() => router.push('/register')}
            > Register here</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;