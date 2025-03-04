import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const RegisterModal = ({ show, onHide, onLoginClick }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>สมัครสมาชิก</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label>ชื่อ-นามสกุล</Form.Label>
            <Form.Control type="text" placeholder="กรอกชื่อ-นามสกุล" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>อีเมล</Form.Label>
            <Form.Control type="email" placeholder="กรอกอีเมล" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerPhone">
            <Form.Label>เบอร์โทรศัพท์</Form.Label>
            <Form.Control type="tel" placeholder="กรอกเบอร์โทรศัพท์" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control type="password" placeholder="กรอกรหัสผ่าน" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
            <Form.Control type="password" placeholder="กรอกรหัสผ่านอีกครั้ง" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="termsAgreement">
            <Form.Check 
              type="checkbox" 
              label="ฉันยอมรับเงื่อนไขและข้อตกลงในการใช้บริการ" 
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit">
              สมัครสมาชิก
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <div className="text-center w-100">
          <p className="mb-0">มีบัญชีอยู่แล้ว? <Button variant="link" onClick={onLoginClick}>เข้าสู่ระบบ</Button></p>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterModal;