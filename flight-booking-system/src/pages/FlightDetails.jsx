// src/pages/FlightDetails.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Nav, Tab, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/FlightDetails.css';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await flightService.getFlightById(id);
        setFlight(response.data);
      } catch (err) {
        console.error('Error fetching flight details:', err);
        setError('ไม่สามารถโหลดข้อมูลเที่ยวบินได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlightDetails();
  }, [id]);

  const handleBooking = () => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/booking/${id}` } } });
      return;
    }
    
    // Proceed to booking page if authenticated
    navigate(`/booking/${id}`);
  };

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Rest of the component logic and rendering is similar to your original code
  // ...

  return (
    <Container className="my-4">
      {/* Rest of JSX using the API data */}
    </Container>
  );
};

export default FlightDetails;