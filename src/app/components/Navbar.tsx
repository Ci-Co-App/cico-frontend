'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import configDev from '../api/config';

const Navbar = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    axios.get(`${configDev.authentication}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-6">
        {user?.role === 'admin' && (
          <>
            <button className="hover:underline" onClick={() => router.push('/dashboard')}>Dashboard</button>
            <button className="hover:underline" onClick={() => router.push('/cico')}>CiCo</button>
            <button className="hover:underline" onClick={() => router.push('/manage')}>Manage</button>
          </>
        )}
        {user?.role === 'employee' && (
          <button className="hover:underline" onClick={() => router.push('/cico')}>CICO</button>
        )}
      </div>
      <div className="flex items-center space-x-6">
        <IconButton onClick={handleMenuClick}>
          <Avatar alt={user?.name || 'User'} src="" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
