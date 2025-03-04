import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // ข้อมูลจำลองของผู้ใช้
  const [user, setUser] = useState({
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai@example.com',
    phone: '0891234567',
    birthdate: '1990-05-15',
    idType: 'id_card',
    idNumber: '1234567890123',
    address: '123/45 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา',
    city: 'กรุงเทพมหานคร',
    zipCode: '10110',
    country: 'Thailand',
    memberPoints: 2500
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileEdited, setProfileEdited] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    setProfileEdited(true);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveProfile = (e) => {
    e.preventDefault();
    // ในโปรเจ็คจริงจะต้องส่งข้อมูลไปยัง API
    setShowSuccessAlert(true);
    setProfileEdited(false);
    
    // ซ่อน alert หลังจาก 3 วินาที
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };
  
  const changePassword = (e) => {
    e.preventDefault();
    // ในโปรเจ็คจริงจะต้องส่งข้อมูลไปยัง API
    setPasswordChanged(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // ซ่อน alert หลังจาก 3 วินาที
    setTimeout(() => {
      setPasswordChanged(false);
    }, 3000);
  };
  
  // รายการจำลองประวัติการจองย้อนหลัง
  const bookingHistory = [
    {
      id: 'BK123456',
      confirmationCode: 'TH789012',
      date: '2 มกราคม 2566',
      route: 'กรุงเทพฯ (DMK) - เชียงใหม่ (CNX)',
      passengers: 1,
      price: 990,
      status: 'completed'
    },
    {
      id: 'BK789012',
      confirmationCode: 'TH345678',
      date: '15 ธันวาคม 2565',
      route: 'กรุงเทพฯ (DMK) - ภูเก็ต (HKT)',
      passengers: 2,
      price: 2380,
      status: 'cancelled'
    },
    {
      id: 'BK456789',
      confirmationCode: 'TH901234',
      date: '5 พฤศจิกายน 2565',
      route: 'กรุงเทพฯ (BKK) - โตเกียว (NRT)',
      passengers: 1,
      price: 15900,
      status: 'completed'
    }
  ];
  
  return (
    <Container className="my-4">
      <h2 className="profile-title">โปรไฟล์ของฉัน</h2>
      
      <Row>
        <Col lg={3} md={4}>
          <Card className="profile-sidebar mb-4">
            <Card.Body className="text-center">
              <div className="profile-image mb-3">
                <i className="fas fa-user-circle"></i>
              </div>
              <h5 className="profile-name">{user.firstName} {user.lastName}</h5>
              <div className="membership-level">
                <span className="badge bg-primary">สมาชิก Gold</span>
              </div>
              <div className="membership-points mt-2">
                <i className="fas fa-star me-1"></i> {user.memberPoints.toLocaleString()} คะแนน
              </div>
            </Card.Body>
            <div className="profile-menu">
              <Nav variant="pills" className="flex-column">
                <Nav.Link as="button" className="text-start" onClick={() => navigate('/manage-booking')}>
                  <i className="fas fa-ticket-alt me-2"></i> การจองของฉัน
                </Nav.Link>
                <Nav.Link as="button" className="text-start" onClick={() => navigate('/wishlist')}>
                  <i className="fas fa-heart me-2"></i> รายการโปรด
                </Nav.Link>
                <Nav.Link as="button" className="text-start" onClick={() => navigate('/notifications')}>
                  <i className="fas fa-bell me-2"></i> การแจ้งเตือน
                  <span className="badge rounded-pill bg-danger ms-2">3</span>
                </Nav.Link>
                <Nav.Link as="button" className="text-start" onClick={() => navigate('/rewards')}>
                  <i className="fas fa-gift me-2"></i> คะแนนสะสม
                </Nav.Link>
              </Nav>
            </div>
          </Card>
        </Col>
        
        <Col lg={9} md={8}>
          <Tab.Container defaultActiveKey="general">
            <Card className="mb-4">
              <Card.Header className="profile-tabs">
                <Nav variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="general">ข้อมูลทั่วไป</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security">ความปลอดภัย</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="history">ประวัติการจอง</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    {showSuccessAlert && (
                      <Alert variant="success" className="mb-4">
                        <i className="fas fa-check-circle me-2"></i>
                        บันทึกข้อมูลเรียบร้อยแล้ว
                      </Alert>
                    )}
                    
                    <Form onSubmit={saveProfile}>
                      <h5 className="mb-3">ข้อมูลส่วนตัว</h5>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={user.firstName}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={user.lastName}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={user.email}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>เบอร์โทรศัพท์</Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={user.phone}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>วันเดือนปีเกิด</Form.Label>
                            <Form.Control
                              type="date"
                              name="birthdate"
                              value={user.birthdate}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>ประเภทบัตรประจำตัว</Form.Label>
                            <Form.Select
                              name="idType"
                              value={user.idType}
                              onChange={handleProfileChange}
                            >
                              <option value="id_card">บัตรประชาชน</option>
                              <option value="passport">หนังสือเดินทาง</option>
                              <option value="driver_license">ใบขับขี่</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>เลขที่บัตรประจำตัว</Form.Label>
                            <Form.Control
                              type="text"
                              name="idNumber"
                              value={user.idNumber}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <h5 className="mb-3 mt-4">ที่อยู่</h5>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>ที่อยู่</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={user.address}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>เมือง/จังหวัด</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={user.city}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>รหัสไปรษณีย์</Form.Label>
                            <Form.Control
                              type="text"
                              name="zipCode"
                              value={user.zipCode}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>ประเทศ</Form.Label>
                            <Form.Control
                              type="text"
                              name="country"
                              value={user.country}
                              onChange={handleProfileChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="d-flex justify-content-end mt-3">
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={!profileEdited}
                        >
                          บันทึกการเปลี่ยนแปลง
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="security">
                    {passwordChanged && (
                      <Alert variant="success" className="mb-4">
                        <i className="fas fa-check-circle me-2"></i>
                        เปลี่ยนรหัสผ่านเรียบร้อยแล้ว
                      </Alert>
                    )}
                    
                    <Form onSubmit={changePassword}>
                      <h5 className="mb-3">เปลี่ยนรหัสผ่าน</h5>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>รหัสผ่านปัจจุบัน</Form.Label>
                            <Form.Control
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>รหัสผ่านใหม่</Form.Label>
                            <Form.Control
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            <Form.Text className="text-muted">
                              รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรและตัวเลข
                            </Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>ยืนยันรหัสผ่านใหม่</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                              isInvalid={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              รหัสผ่านไม่ตรงกัน
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="d-flex justify-content-end mt-3">
                        <Button 
                          type="submit" 
                          variant="primary"
                          disabled={!passwordData.currentPassword || 
                                   !passwordData.newPassword || 
                                   !passwordData.confirmPassword ||
                                   passwordData.newPassword !== passwordData.confirmPassword}
                        >
                          เปลี่ยนรหัสผ่าน
                        </Button>
                      </div>
                      
                      <hr className="my-4" />
                      
                      <h5 className="mb-3">การแจ้งเตือนและความเป็นส่วนตัว</h5>
                      <Form.Check 
                        type="switch"
                        id="email-notifications"
                        label="รับการแจ้งเตือนทางอีเมล"
                        defaultChecked
                        className="mb-2"
                      />
                      <Form.Check 
                        type="switch"
                        id="sms-notifications"
                        label="รับการแจ้งเตือนทาง SMS"
                        defaultChecked
                        className="mb-2"
                      />
                      <Form.Check 
                        type="switch"
                        id="marketing-emails"
                        label="รับอีเมลเกี่ยวกับโปรโมชั่นและข่าวสาร"
                        defaultChecked
                        className="mb-2"
                      />
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="history">
                    <h5 className="mb-3">ประวัติการจอง</h5>
                    
                    {bookingHistory.length > 0 ? (
                      <div className="booking-history">
                        {bookingHistory.map(booking => (
                          <Card key={booking.id} className="booking-history-item mb-3">
                            <Card.Body>
                              <Row>
                                <Col md={8}>
                                  <div className="booking-date mb-1">{booking.date}</div>
                                  <div className="booking-code mb-2">
                                    <span className="label">รหัสการจอง:</span>
                                    <span className="value">{booking.confirmationCode}</span>
                                  </div>
                                  <div className="booking-route mb-1">{booking.route}</div>
                                  <div className="booking-passengers">
                                    ผู้โดยสาร: {booking.passengers} คน
                                  </div>
                                </Col>
                                <Col md={4} className="d-flex flex-column justify-content-between">
                                  <div className="booking-price text-md-end mb-2">
                                    ฿{booking.price.toLocaleString()}
                                  </div>
                                  <div className="booking-status text-md-end">
                                    <span className={`status-badge ${booking.status}`}>
                                      {booking.status === 'completed' ? 'เดินทางแล้ว' : 
                                      booking.status === 'cancelled' ? 'ยกเลิก' : booking.status}
                                    </span>
                                  </div>
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => navigate(`/confirmation/${booking.id}`)}
                                  >
                                    ดูรายละเอียด
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p>ไม่มีประวัติการจอง</p>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;