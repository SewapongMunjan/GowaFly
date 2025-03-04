import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Tab, Tabs, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageBooking.css';

const ManageBooking = () => {
  const navigate = useNavigate();
  const [bookingReference, setBookingReference] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // จำลองสถานะการล็อกอิน

  // จำลองการค้นหาการจอง
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // จำลองการเรียก API
    setTimeout(() => {
      if (bookingReference === 'TH123456' && lastName === 'ใจดี') {
        setSearchResult({
          id: 'TH123456',
          status: 'confirmed',
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
          price: {
            total: 990
          }
        });
      } else {
        setError('ไม่พบข้อมูลการจอง กรุณาตรวจสอบรหัสการจองและนามสกุลอีกครั้ง');
        setSearchResult(null);
      }
      setLoading(false);
    }, 1500);
  };

  // จำลองการดึงข้อมูลการจองของผู้ใช้ที่ล็อกอินแล้ว
  React.useEffect(() => {
    if (isLoggedIn) {
      // จำลองข้อมูลการจองที่จะเดินทาง
      setUpcomingBookings([
        {
          id: 'TH123456',
          status: 'confirmed',
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
          price: {
            total: 990
          }
        },
        {
          id: 'TH234567',
          status: 'confirmed',
          flight: {
            id: 'TG789',
            airline: 'Thai Airways',
            airlineCode: 'TG',
            from: 'กรุงเทพฯ (BKK)',
            to: 'ภูเก็ต (HKT)',
            departureTime: '14:30',
            arrivalTime: '16:00',
            departureDate: '15 มีนาคม 2566',
            flightNumber: 'TG789'
          },
          price: {
            total: 1590
          }
        }
      ]);
      
      // จำลองข้อมูลการจองที่เดินทางแล้ว
      setPastBookings([
        {
          id: 'TH987654',
          status: 'completed',
          flight: {
            id: 'PG123',
            airline: 'Bangkok Airways',
            airlineCode: 'PG',
            from: 'กรุงเทพฯ (BKK)',
            to: 'สมุย (USM)',
            departureTime: '09:30',
            arrivalTime: '10:45',
            departureDate: '15 กุมภาพันธ์ 2566',
            flightNumber: 'PG123'
          },
          price: {
            total: 2990
          }
        }
      ]);
    }
  }, [isLoggedIn]);

  // สร้างการ์ดแสดงการจอง
  const renderBookingCard = (booking) => (
    <Card key={booking.id} className="booking-card mb-3">
      <Card.Body>
        <Row>
          <Col md={2}>
            <div className="airline-logo text-center">
              <div className="airline-logo-placeholder">{booking.flight.airlineCode}</div>
              <div className="airline-name">{booking.flight.airline}</div>
            </div>
          </Col>
          <Col md={7}>
            <div className="d-flex justify-content-between mb-2">
              <div className="flight-time">
                <div className="departure-time">{booking.flight.departureTime}</div>
                <div className="airport-code">{booking.flight.from}</div>
              </div>
              <div className="flight-duration text-center">
                <div className="duration-line">
                  <hr />
                  <div className="flight-type">บินตรง</div>
                </div>
              </div>
              <div className="flight-time text-end">
                <div className="arrival-time">{booking.flight.arrivalTime}</div>
                <div className="airport-code">{booking.flight.to}</div>
              </div>
            </div>
            <div className="flight-details">
              <span className="booking-id">รหัสการจอง: {booking.id}</span>
              <span className="flight-date">• {booking.flight.departureDate}</span>
              <span className="flight-number">• เที่ยวบิน {booking.flight.flightNumber}</span>
            </div>
          </Col>
          <Col md={3}>
            <div className="booking-actions text-center">
              <div className="booking-price mb-2">฿{booking.price.total.toLocaleString()}</div>
              <Button 
                variant="primary" 
                className="w-100 mb-2"
                onClick={() => navigate(`/confirmation/${booking.id}`)}
              >
                ดูรายละเอียด
              </Button>
              {booking.status === 'confirmed' && (
                <Button 
                  variant="outline-secondary" 
                  className="w-100"
                  onClick={() => alert('ฟังก์ชันนี้ยังไม่เปิดให้บริการ')}
                >
                  แก้ไขการจอง
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="my-4">
      <h2 className="page-title">จัดการการจอง</h2>
      
      <Tabs defaultActiveKey="search" id="booking-tabs" className="mb-4">
        <Tab eventKey="search" title="ค้นหาการจอง">
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row className="align-items-end">
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>รหัสการจอง</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="กรอกรหัสการจอง" 
                        value={bookingReference}
                        onChange={(e) => setBookingReference(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>นามสกุล</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="กรอกนามสกุล" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          กำลังค้นหา...
                        </>
                      ) : 'ค้นหา'}
                    </Button>
                  </Col>
                </Row>
              </Form>
              
              {error && (
                <Alert variant="danger">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              
              {searchResult && (
                <div className="search-result mt-4">
                  <h5>ผลการค้นหา</h5>
                  {renderBookingCard(searchResult)}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="my-bookings" title="การจองของฉัน">
          {isLoggedIn ? (
            <>
              <h5 className="mb-3">การเดินทางที่จะถึง</h5>
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => renderBookingCard(booking))
              ) : (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  คุณไม่มีการจองที่จะเดินทางในอนาคต
                </Alert>
              )}
              
              <h5 className="mb-3 mt-4">ประวัติการเดินทาง</h5>
              {pastBookings.length > 0 ? (
                pastBookings.map(booking => renderBookingCard(booking))
              ) : (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  คุณไม่มีประวัติการเดินทาง
                </Alert>
              )}
            </>
          ) : (
            <Alert variant="warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              กรุณาเข้าสู่ระบบเพื่อดูการจองของคุณ
              <div className="mt-3">
                <Button variant="primary" onClick={() => setIsLoggedIn(true)}>
                  เข้าสู่ระบบ
                </Button>
              </div>
            </Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ManageBooking;