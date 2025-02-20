'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography, Box, Container, Paper, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Webcam from 'react-webcam';
import Navbar from '../components/Navbar';
import configDev from '../api/config';

const CICOPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [webcamOpen, setWebcamOpen] = useState<boolean>(false);
  const [clockType, setClockType] = useState<'clock-in' | 'clock-out' | null>(null);
  const [hasClockedIn, setHasClockedIn] = useState<boolean>(false);
  const [hasClockedOut, setHasClockedOut] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    checkAttendanceStatus();
  }, []);

  const checkAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${configDev.employee}status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { status } = response.data;
      if (status === 'clocked-in') {
        setHasClockedIn(true);
      } else if (status === 'clocked-in-clocked-out') {
        setHasClockedIn(true);
        setHasClockedOut(true);
      }
    } catch (error) {
      console.error('Error checking attendance status:', error);
    }
  };

  const getLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
          (error) => reject(error),
          { enableHighAccuracy: true }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const capture = (type: 'clock-in' | 'clock-out') => {
    if ((type === 'clock-in' && hasClockedIn) || (type === 'clock-out' && hasClockedOut)) {
      toast.error(`You have already ${type === 'clock-in' ? 'clocked in' : 'clocked out'} today`, {
        position: 'top-center',
      });
      return;
    }
    setClockType(type);
    setWebcamOpen(true);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)?.[1] || '',
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const imageFile = dataURLtoFile(imageSrc, 'evidence.jpg');
        setImage(imageSrc);
        setWebcamOpen(false);

        try {
          const location = await getLocation();
          setLatitude(location.latitude);
          setLongitude(location.longitude);

          const formData = new FormData();
          formData.append('evidence_photo', imageFile);
          formData.append('latitude', location.latitude.toString());
          formData.append('longitude', location.longitude.toString());

          const endpoint =
            clockType === 'clock-in'
              ? `${configDev.employee}clock-in`
              : `${configDev.employee}clock-out`;

          const token = localStorage.getItem('token');

          await axios.post(endpoint, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          toast.success(`${clockType === 'clock-in' ? 'Clock-in' : 'Clock-out'} successful!`, {
            position: 'top-center',
          });

          if (clockType === 'clock-in') {
            setHasClockedIn(true);
          } else {
            setHasClockedOut(true);
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Error occurred, please try again', { position: 'top-center' });
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Container maxWidth="md" className="flex flex-col items-center p-6">
        <Typography variant="h3" className="mb-6 text-gray-800 font-bold text-center">
          Employee Clock In/Out
        </Typography>
        <Paper className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white flex flex-col items-center">
          <Typography variant="h6" className="mb-4">
            {hasClockedIn ? (hasClockedOut ? 'You have clocked out for today' : 'You are clocked in') : 'You have not clocked in yet'}
          </Typography>
          <Box className="flex justify-center gap-6 mb-6">
            <Button
              variant="contained"
              color="primary"
              onClick={() => capture('clock-in')}
              size="large"
              disabled={hasClockedIn}
            >
              {hasClockedIn ? 'Clocked In' : 'Clock In'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => capture('clock-out')}
              size="large"
              disabled={!hasClockedIn || hasClockedOut}
            >
              {hasClockedOut ? 'Clocked Out' : 'Clock Out'}
            </Button>
          </Box>
          <Modal open={webcamOpen} onClose={() => setWebcamOpen(false)}>
            <Box className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full max-w-md border rounded-lg shadow-md" />
              <Button variant="contained" color="success" className="mt-4" onClick={handleCapture} size="large">
                Capture
              </Button>
            </Box>
          </Modal>
          {image && <img src={image} alt="Captured" className="mt-6 w-full max-w-md border rounded-lg shadow-md" />}
        </Paper>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default CICOPage;