import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Nav, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [validated, setValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // จำลองการเรียกข้อมูลการจองจาก API
  useEffect(() => {
    // ในโปรเจ็คจริงจะเชื่อมต่อกับ API
    setTimeout(() => {
      // ข้อมูลจำลองของการจอง
      const mockBooking = {
        id: bookingId,
        flight: {
          id: 'FD456',
          airline: 'Thai AirAsia',
          airlineCode: 'FD',
          from: 'กรุงเทพฯ (DMK)',
          to: 'เชียงใหม่ (CNX)',
          departureTime: '10:45',
          arrivalTime: '12:15',
          departureDate: '3 มีนาคม 2566',
          flightNumber: 'FD456'
        },
        passengers: [
          {
            id: 1,
            title: 'นาย',
            firstName: 'สมชาย',
            lastName: 'ใจดี'
          }
        ],
        contact: {
          email: 'somchai@example.com',
          phone: '0891234567'
        },
        price: {
          fare: 990,
          tax: 0,
          total: 990
        }
      };
      
      setBooking(mockBooking);
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setIsProcessing(true);
    
    // จำลองการประมวลผลการชำระเงิน
    setTimeout(() => {
      navigate(`/confirmation/${bookingId}`);
    }, 2000);
  };

  if (loading) {
    return (
      <Container className="my-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลการชำระเงิน...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="payment-title">ชำระเงิน</h2>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">เลือกวิธีการชำระเงิน</h5>
            </Card.Header>
            <Card.Body>
              <Tab.Container id="payment-methods" defaultActiveKey="credit_card">
                <Nav variant="pills" className="payment-methods-nav mb-3">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="credit_card" 
                      onClick={() => setPaymentMethod('credit_card')}
                      className="payment-method-tab"
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      บัตรเครดิต/เดบิต
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="bank_transfer" 
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className="payment-method-tab"
                    >
                      <i className="fas fa-university me-2"></i>
                      โอนเงินผ่านธนาคาร
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="qr_code" 
                      onClick={() => setPaymentMethod('qr_code')}
                      className="payment-method-tab"
                    >
                      <i className="fas fa-qrcode me-2"></i>
                      QR Code
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="credit_card">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>หมายเลขบัตร <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="กรอกหมายเลขบัตร"
                            />
                            <Form.Control.Feedback type="invalid">
                              กรุณากรอกหมายเลขบัตร
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>ชื่อบนบัตร <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="กรอกชื่อบนบัตร"
                            />
                            <Form.Control.Feedback type="invalid">
                              กรุณากรอกชื่อบนบัตร
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>วันหมดอายุ <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="MM/YY"
                            />
                            <Form.Control.Feedback type="invalid">
                              กรุณากรอกวันหมดอายุ
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="CVV"
                            />
                            <Form.Control.Feedback type="invalid">
                              กรุณากรอก CVV
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="card-icons mt-2 mb-4">
                        <span className="card-icon">VISA</span>
                        <span className="card-icon">MasterCard</span>
                        <span className="card-icon">JCB</span>
                        <span className="card-icon">AMEX</span>
                      </div>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-100 pay-button"
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            กำลังประมวลผล...
                          </>
                        ) : (
                          <>ชำระเงิน ฿{booking.price.total.toLocaleString()}</>
                        )}
                      </Button>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="bank_transfer">
                    <Alert variant="info">
                      <i className="fas fa-info-circle me-2"></i>
                      กรุณาโอนเงินไปยังบัญชีด้านล่างนี้ และอัพโหลดหลักฐานการโอนเงิน
                    </Alert>
                    <div className="bank-accounts mb-4">
                      <div className="bank-account">
                        <div className="bank-logo">SCB</div>
                        <div className="bank-details">
                          <div className="bank-name">ธนาคารไทยพาณิชย์</div>
                          <div className="account-number">xxx-x-xxxxx-x</div>
                          <div className="account-name">บริษัท ไทยสกาย จำกัด</div>
                        </div>
                      </div>
                      <div className="bank-account">
                        <div className="bank-logo">KBank</div>
                        <div className="bank-details">
                          <div className="bank-name">ธนาคารกสิกรไทย</div>
                          <div className="account-number">xxx-x-xxxxx-x</div>
                          <div className="account-name">บริษัท ไทยสกาย จำกัด</div>
                        </div>
                      </div>
                      <div className="bank-account">
                        <div className="bank-logo">BBL</div>
                        <div className="bank-details">
                          <div className="bank-name">ธนาคารกรุงเทพ</div>
                          <div className="account-number">xxx-x-xxxxx-x</div>
                          <div className="account-name">บริษัท ไทยสกาย จำกัด</div>
                        </div>
                      </div>
                    </div>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>อัพโหลดหลักฐานการโอนเงิน</Form.Label>
                        <Form.Control type="file" />
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 pay-button"
                      >
                        ยืนยันการชำระเงิน
                      </Button>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="qr_code">
                    <div className="qr-payment text-center py-3">
                      <div className="qr-container mb-3">
                        <div className="qr-code-placeholder">
                          QR Code สำหรับชำระเงิน
                        </div>
                      </div>
                      <p>สแกน QR Code เพื่อชำระเงินจำนวน ฿{booking.price.total.toLocaleString()}</p>
                      <p className="small text-muted mb-4">QR Code จะหมดอายุใน 15 นาที</p>
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(`/confirmation/${bookingId}`)}
                        className="w-100 pay-button"
                      >
                        ฉันชำระเงินแล้ว
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-between mt-4 mb-5">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              ย้อนกลับ
            </Button>
          </div>
        </Col>
        
        <Col md={4}>
          <Card className="booking-summary-card sticky-top">
            <Card.Header>
              <h5 className="mb-0">สรุปการจอง</h5>
            </Card.Header>
            <Card.Body>
              <div className="booking-id mb-3">
                <strong>รหัสการจอง:</strong> {booking.id}
              </div>
              
              <div className="flight-summary-small mb-3">
                <h6>เที่ยวบินไป</h6>
                <div className="d-flex mb-2">
                  <div className="airline-logo-small me-2">
                    {booking.flight.airlineCode}
                  </div>
                  <div>
                    <div className="flight-route-small">{booking.flight.from} - {booking.flight.to}</div>
                    <div className="flight-details-small">
                      {booking.flight.departureDate} • {booking.flight.departureTime}-{booking.flight.arrivalTime}
                    </div>
                  </div>
                </div>
                <div className="passenger-count-small">
                  ผู้โดยสาร: {booking.passengers.length} คน
                </div>
              </div>
              
              <hr />
              
              <div className="price-summary">
                <div className="price-item d-flex justify-content-between">
                  <span>ราคาตั๋ว ({booking.passengers.length} x ฿{booking.price.fare.toLocaleString()})</span>
                  <span>฿{(booking.price.fare * booking.passengers.length).toLocaleString()}</span>
                </div>
                <div className="price-item d-flex justify-content-between">
                  <span>ภาษีและค่าธรรมเนียม</span>
                  <span>รวมแล้ว</span>
                </div>
                <div className="price-item d-flex justify-content-between total-price">
                  <span>ราคารวมทั้งสิ้น</span>
                  <span className="total-amount">฿{booking.price.total.toLocaleString()}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;