import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const LoginModal = ({ show, onHide, onRegisterClick }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>เข้าสู่ระบบ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>อีเมลหรือเบอร์โทรศัพท์</Form.Label>
            <Form.Control type="email" placeholder="กรอกอีเมลหรือเบอร์โทรศัพท์" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control type="password" placeholder="กรอกรหัสผ่าน" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="rememberMe">
            <Form.Check type="checkbox" label="จดจำฉัน" />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit">
              เข้าสู่ระบบ
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <div className="text-center w-100">
          <p className="mb-0">ยังไม่มีบัญชี? <Button variant="link" onClick={onRegisterClick}>สมัครสมาชิก</Button></p>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;