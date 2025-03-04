import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

// นำเข้า Modal components
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginClose = () => setShowLoginModal(false);
  const handleLoginShow = () => setShowLoginModal(true);
  
  const handleRegisterClose = () => setShowRegisterModal(false);
  const handleRegisterShow = () => setShowRegisterModal(true);

  return (
    <header className="site-header">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="brand-text">GowaFly</span>
            <span className="small-text">ระบบจองตั๋วเครื่องบินออนไลน์</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">หน้าหลัก</Nav.Link>
              <Nav.Link as={Link} to="/manage-booking">การจองของฉัน</Nav.Link>
              <Nav.Link as={Link} to="/promotions">โปรโมชั่น</Nav.Link>
              <Nav.Link as={Link} to="/help">ช่วยเหลือ</Nav.Link>
            </Nav>
            <div className="d-flex">
              <Button variant="outline-light" className="me-2" onClick={handleLoginShow}>เข้าสู่ระบบ</Button>
              <Button variant="warning" onClick={handleRegisterShow}>สมัครสมาชิก</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Modal components */}
      <LoginModal show={showLoginModal} onHide={handleLoginClose} onRegisterClick={() => {handleLoginClose(); handleRegisterShow();}} />
      <RegisterModal show={showRegisterModal} onHide={handleRegisterClose} onLoginClick={() => {handleRegisterClose(); handleLoginShow();}} />
    </header>
  );
};

export default Header;