import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Confirmation.css';

const Confirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // จำลองการเรียกข้อมูลการจองจาก API
  useEffect(() => {
    // ในโปรเจ็คจริงจะเชื่อมต่อกับ API
    setTimeout(() => {
      // ข้อมูลจำลองของการจอง
      const mockBooking = {
        id: bookingId,
        status: 'confirmed',
        confirmationCode: 'TH' + Math.floor(Math.random() * 1000000),
        flight: {
          id: 'FD456',
          airline: 'Thai AirAsia',
          airlineCode: 'FD',
          from: 'กรุงเทพฯ (DMK)',
          to: 'เชียงใหม่ (CNX)',
          departureTime: '10:45',
          arrivalTime: '12:15',
          duration: '1h 30m',
          departureDate: '3 มีนาคม 2566',
          flightNumber: 'FD456',
          terminal: 'T1'
        },
        passengers: [
          {
            id: 1,
            title: 'นาย',
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            seatNumber: '15A'
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
        },
        paymentMethod: 'บัตรเครดิต',
        paymentDate: '2 มีนาคม 2566 15:30:25'
      };
      
      setBooking(mockBooking);
      setLoading(false);
    }, 1000);
  }, [bookingId]);

  if (loading) {
    return (
      <Container className="my-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลการยืนยัน...</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <div className="confirmation-header text-center mb-4">
        <div className="confirmation-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="confirmation-title">การจองเสร็จสมบูรณ์!</h2>
        <p className="confirmation-message">
          ขอบคุณสำหรับการจองกับเรา รายละเอียดการจองได้ถูกส่งไปยังอีเมล {booking.contact.email} แล้ว
        </p>
      </div>
      
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">รายละเอียดการจอง</h5>
            <div className="booking-reference">
              รหัสการจอง: <strong>{booking.confirmationCode}</strong>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flight-details mb-4">
            <div className="flight-route d-flex justify-content-between align-items-center mb-3">
              <div className="route-details">
                <div className="route-airports">
                  <span className="airport-code">{booking.flight.from.split(' ')[1].replace(/[()]/g, '')}</span>
                  <span className="route-arrow"><i className="fas fa-arrow-right"></i></span>
                  <span className="airport-code">{booking.flight.to.split(' ')[1].replace(/[()]/g, '')}</span>
                </div>
                <div className="route-cities">
                  {booking.flight.from.split(' ')[0]} ไป {booking.flight.to.split(' ')[0]}
                </div>
              </div>
              <div className="flight-date">
                {booking.flight.departureDate}
              </div>
            </div>
            
            <div className="flight-timeline d-flex align-items-center mb-3">
              <div className="time-info text-center">
                <div className="departure-time">{booking.flight.departureTime}</div>
                <div className="airport-code">{booking.flight.from.split(' ')[1].replace(/[()]/g, '')}</div>
              </div>
              <div className="flight-duration flex-grow-1 text-center">
                <div className="duration-line">
                  <div className="duration-time">{booking.flight.duration}</div>
                </div>
                <div className="airline-info">
                  {booking.flight.airline} {booking.flight.flightNumber}
                </div>
              </div>
              <div className="time-info text-center">
                <div className="arrival-time">{booking.flight.arrivalTime}</div>
                <div className="airport-code">{booking.flight.to.split(' ')[1].replace(/[()]/g, '')}</div>
              </div>
            </div>
            
            <div className="terminal-info d-flex justify-content-between">
              <div>
                <strong>Terminal:</strong> {booking.flight.terminal}
              </div>
              <div>
                <strong>Gate:</strong> TBA
              </div>
            </div>
          </div>
          
          <h6 className="mb-3">ผู้โดยสาร</h6>
          <Table responsive className="passenger-table mb-4">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อ-นามสกุล</th>
                <th>ที่นั่ง</th>
                <th>น้ำหนักสัมภาระ</th>
              </tr>
            </thead>
            <tbody>
              {booking.passengers.map((passenger, idx) => (
                <tr key={passenger.id}>
                  <td>{idx + 1}</td>
                  <td>{passenger.title} {passenger.firstName} {passenger.lastName}</td>
                  <td>{passenger.seatNumber}</td>
                  <td>20 กก.</td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <h6 className="mb-3">รายละเอียดการชำระเงิน</h6>
          <Table responsive className="payment-table mb-4">
            <tbody>
              <tr>
                <td><strong>วิธีการชำระเงิน:</strong></td>
                <td>{booking.paymentMethod}</td>
              </tr>
              <tr>
                <td><strong>วันที่ชำระเงิน:</strong></td>
                <td>{booking.paymentDate}</td>
              </tr>
              <tr>
                <td><strong>จำนวนเงินทั้งหมด:</strong></td>
                <td>฿{booking.price.total.toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>สถานะการชำระเงิน:</strong></td>
                <td><span className="payment-status success">สำเร็จ</span></td>
              </tr>
            </tbody>
          </Table>
          
          <Alert variant="info">
            <i className="fas fa-info-circle me-2"></i>
            กรุณาเดินทางมาถึงสนามบินอย่างน้อย 2 ชั่วโมงก่อนเวลาออกเดินทางสำหรับเที่ยวบินภายในประเทศ และ 3 ชั่วโมงสำหรับเที่ยวบินระหว่างประเทศ
          </Alert>
        </Card.Body>
      </Card>
      
      <div className="action-buttons d-flex justify-content-between mb-5">
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          กลับสู่หน้าหลัก
        </Button>
        <div>
          <Button variant="primary" className="me-2">
            <i className="fas fa-print me-2"></i>
            พิมพ์เอกสารการจอง
          </Button>
          <Button variant="success">
            <i className="fas fa-download me-2"></i>
            ดาวน์โหลด E-Ticket
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Confirmation;