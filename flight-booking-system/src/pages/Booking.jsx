import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Booking.css';

const Booking = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerForms, setPassengerForms] = useState([{ id: 1 }]);
  const [validated, setValidated] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    confirmEmail: '',
    phone: ''
  });

  // จำลองการเรียกข้อมูลเที่ยวบินจาก API
  useEffect(() => {
    // ในโปรเจ็คจริงจะเชื่อมต่อกับ API
    setTimeout(() => {
      // ข้อมูลจำลองของเที่ยวบิน
      const mockFlight = {
        id: flightId,
        airline: 'Thai AirAsia',
        airlineCode: 'FD',
        from: 'กรุงเทพฯ (DMK)',
        to: 'เชียงใหม่ (CNX)',
        departureTime: '10:45',
        arrivalTime: '12:15',
        duration: '1h 30m',
        price: 990,
        departureDate: '3 มีนาคม 2566',
        flightNumber: `FD${flightId.replace('FD', '')}`
      };
      
      setFlight(mockFlight);
      setLoading(false);
    }, 1000);
  }, [flightId]);

  // อัพเดทฟอร์มผู้โดยสารเมื่อจำนวนผู้โดยสารเปลี่ยน
  useEffect(() => {
    const newPassengerForms = Array.from({ length: passengerCount }, (_, index) => ({
      id: index + 1
    }));
    setPassengerForms(newPassengerForms);
  }, [passengerCount]);

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // สร้าง booking ID จำลอง
      const bookingId = `BK${Math.floor(Math.random() * 1000000)}`;
      navigate(`/payment/${bookingId}`);
    }
    
    setValidated(true);
  };

  if (loading) {
    return (
      <Container className="my-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลการจอง...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="booking-title">กรอกข้อมูลการจอง</h2>
      
      <Row>
        <Col md={8}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">ข้อมูลเที่ยวบิน</h5>
              </Card.Header>
              <Card.Body>
                <div className="flight-summary">
                  <div className="d-flex mb-3">
                    <div className="airline-logo-small me-3">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <div className="flight-route">{flight.from} - {flight.to}</div>
                      <div className="flight-details-small">
                        {flight.departureDate} • {flight.departureTime}-{flight.arrivalTime} • {flight.duration} • {flight.flightNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">ข้อมูลผู้โดยสาร</h5>
                <Form.Group as={Row} className="align-items-center passenger-count-group mb-0">
                  <Form.Label column sm="auto">จำนวนผู้โดยสาร:</Form.Label>
                  <Col sm="auto">
                    <Form.Select 
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                    >
                      {[...Array(10).keys()].map(i => (
                        <option key={i} value={i+1}>{i+1}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  กรุณากรอกชื่อ-นามสกุลให้ตรงกับหนังสือเดินทางหรือบัตรประชาชน
                </Alert>
                
                {passengerForms.map((passenger, index) => (
                  <div key={passenger.id} className="passenger-form mb-4">
                    <h6 className="passenger-title">ผู้โดยสารคนที่ {index + 1}</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>คำนำหน้า <span className="text-danger">*</span></Form.Label>
                          <Form.Select required>
                            <option value="">เลือกคำนำหน้า</option>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                            <option value="เด็กชาย">เด็กชาย</option>
                            <option value="เด็กหญิง">เด็กหญิง</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            กรุณาเลือกคำนำหน้า
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>ชื่อ (ภาษาไทยหรือภาษาอังกฤษ) <span className="text-danger">*</span></Form.Label>
                          <Form.Control required type="text" placeholder="กรอกชื่อ" />
                          <Form.Control.Feedback type="invalid">
                            กรุณากรอกชื่อ
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>นามสกุล (ภาษาไทยหรือภาษาอังกฤษ) <span className="text-danger">*</span></Form.Label>
                          <Form.Control required type="text" placeholder="กรอกนามสกุล" />
                          <Form.Control.Feedback type="invalid">
                            กรุณากรอกนามสกุล
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>วันเดือนปีเกิด <span className="text-danger">*</span></Form.Label>
                          <Form.Control required type="date" />
                          <Form.Control.Feedback type="invalid">
                            กรุณาเลือกวันเดือนปีเกิด
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>สัญชาติ <span className="text-danger">*</span></Form.Label>
                          <Form.Select required>
                            <option value="">เลือกสัญชาติ</option>
                            <option value="Thai">ไทย</option>
                            <option value="Other">อื่นๆ</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            กรุณาเลือกสัญชาติ
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>ประเภทเอกสาร <span className="text-danger">*</span></Form.Label>
                          <Form.Select required>
                            <option value="">เลือกประเภทเอกสาร</option>
                            <option value="id_card">บัตรประชาชน</option>
                            <option value="passport">หนังสือเดินทาง</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            กรุณาเลือกประเภทเอกสาร
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>เลขที่เอกสาร <span className="text-danger">*</span></Form.Label>
                          <Form.Control required type="text" placeholder="กรอกเลขที่เอกสาร" />
                          <Form.Control.Feedback type="invalid">
                            กรุณากรอกเลขที่เอกสาร
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    {index + 1 < passengerForms.length && <hr className="my-4" />}
                  </div>
                ))}
                
                <h6 className="mb-3">บริการเสริม (ไม่บังคับ)</h6>
                <div className="additional-services mb-3">
                  <Form.Check 
                    type="checkbox"
                    id="seat-selection"
                    label="เลือกที่นั่ง (+฿200 ต่อที่นั่ง)"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="travel-insurance"
                    label="ประกันการเดินทาง (+฿150 ต่อคน)"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="priority-boarding"
                    label="ขึ้นเครื่องก่อน (+฿100 ต่อคน)"
                  />
                </div>
              </Card.Body>
            </Card>
            
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">ข้อมูลติดต่อ</h5>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  ข้อมูลสำหรับส่งยืนยันการจองและการแจ้งเตือนเกี่ยวกับเที่ยวบิน
                </Alert>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>อีเมล <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder="กรอกอีเมล"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleContactInfoChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอกอีเมลที่ถูกต้อง
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ยืนยันอีเมล <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder="กรอกอีเมลอีกครั้ง"
                        name="confirmEmail"
                        value={contactInfo.confirmEmail}
                        onChange={handleContactInfoChange}
                        isInvalid={contactInfo.confirmEmail && contactInfo.email !== contactInfo.confirmEmail}
                      />
                      <Form.Control.Feedback type="invalid">
                        อีเมลไม่ตรงกัน
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>เบอร์โทรศัพท์ <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        placeholder="กรอกเบอร์โทรศัพท์"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleContactInfoChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอกเบอร์โทรศัพท์
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            <div className="d-flex justify-content-between mt-4 mb-5">
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                ย้อนกลับ
              </Button>
              <Button variant="primary" type="submit">
                ดำเนินการต่อไปยังหน้าชำระเงิน
              </Button>
            </div>
          </Form>
        </Col>
        
        <Col md={4}>
          <Card className="booking-summary-card sticky-top">
            <Card.Header>
              <h5 className="mb-0">สรุปการจอง</h5>
            </Card.Header>
            <Card.Body>
              <div className="flight-summary-small mb-3">
                <h6>เที่ยวบินไป</h6>
                <div className="d-flex mb-2">
                  <div className="airline-logo-small me-2">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <div className="flight-route-small">{flight.from} - {flight.to}</div>
                    <div className="flight-details-small">
                      {flight.departureDate} • {flight.departureTime}-{flight.arrivalTime}
                    </div>
                  </div>
                </div>
                <div className="passenger-count-small">
                  ผู้โดยสาร: {passengerCount} คน
                </div>
              </div>
              
              <hr />
              
              <div className="price-summary">
                <div className="price-item d-flex justify-content-between">
                  <span>ราคาตั๋ว ({passengerCount} x ฿{flight.price.toLocaleString()})</span>
                  <span>฿{(flight.price * passengerCount).toLocaleString()}</span>
                </div>
                <div className="price-item d-flex justify-content-between">
                  <span>ภาษีและค่าธรรมเนียม</span>
                  <span>รวมแล้ว</span>
                </div>
                <div className="price-item d-flex justify-content-between total-price">
                  <span>ราคารวมทั้งสิ้น</span>
                  <span className="total-amount">฿{(flight.price * passengerCount).toLocaleString()}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Booking;