// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container fluid className="admin-container">
      <Row className="min-vh-100">
        {/* Sidebar */}
        <Col md={3} lg={2} className="admin-sidebar p-0">
          <div className="admin-brand p-3">
            <h3 className="mb-0">GowaFly Admin</h3>
          </div>
          <div className="admin-user-info p-3">
            <div className="d-flex align-items-center">
              <div className="admin-avatar me-2">
                <i className="fas fa-user-circle"></i>
              </div>
              <div>
                <div className="admin-name">{user?.fullName || 'Admin User'}</div>
                <div className="admin-role">Administrator</div>
              </div>
            </div>
          </div>
          <Nav className="flex-column admin-nav">
            <NavLink to="/admin" end className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }>
              <i className="fas fa-tachometer-alt me-2"></i>
              แดชบอร์ด
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }>
              <i className="fas fa-users me-2"></i>
              จัดการผู้ใช้
            </NavLink>
            <NavLink to="/admin/flights" className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }>
              <i className="fas fa-plane me-2"></i>
              จัดการเที่ยวบิน
            </NavLink>
            <NavLink to="/admin/bookings" className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }>
              <i className="fas fa-ticket-alt me-2"></i>
              จัดการการจอง
            </NavLink>
            <NavLink to="/admin/airports" className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }>
              <i className="fas fa-building me-2"></i>
              จัดการสนามบิน
            </NavLink>
            <hr className="admin-nav-divider" />
            <Button 
              variant="link" 
              className="admin-nav-link text-start text-danger" 
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              ออกจากระบบ
            </Button>
            <NavLink to="/" className="admin-nav-link">
              <i className="fas fa-home me-2"></i>
              กลับสู่หน้าหลัก
            </NavLink>
          </Nav>
        </Col>
        
        {/* Main content */}
        <Col md={9} lg={10} className="admin-content p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;