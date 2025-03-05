// src/pages/FlightDetails.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Nav, Tab, Alert, Spinner } from 'react-bootstrap';
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
    if (!dateString) return '';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('th-TH', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    try {
      return new Date(dateString).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </Spinner>
        <p className="mt-3">กำลังโหลดข้อมูลเที่ยวบิน...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">
          <Alert.Heading>เกิดข้อผิดพลาด</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate(-1)}>
            ย้อนกลับ
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!flight) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          <Alert.Heading>ไม่พบข้อมูลเที่ยวบิน</Alert.Heading>
          <p>ไม่พบข้อมูลเที่ยวบินที่คุณค้นหา</p>
          <Button variant="outline-warning" onClick={() => navigate(-1)}>
            ย้อนกลับ
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="flight-header-card mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="mb-2">
                <div className="flight-route">
                  {flight.from} - {flight.to}
                </div>
                <div className="flight-date">
                  {formatDate(flight.departureTime)}
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <div className="airline-logo-small me-3">
                  {flight.airlineCode}
                </div>
                <div>
                  <div className="fw-bold">{flight.airline}</div>
                  <div className="small text-muted">เที่ยวบิน {flight.flightNumber}</div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <div className="text-center">
                  <div className="fs-3 fw-bold">{formatTime(flight.departureTime)}</div>
                  <div className="small text-muted">{flight.departureAirport?.city || flight.from}</div>
                </div>
                <div className="align-self-center text-center">
                  <div className="small text-muted">ระยะเวลาบิน</div>
                  <div className="fw-bold">{flight.duration}</div>
                </div>
                <div className="text-center">
                  <div className="fs-3 fw-bold">{formatTime(flight.arrivalTime)}</div>
                  <div className="small text-muted">{flight.arrivalAirport?.city || flight.to}</div>
                </div>
              </div>
            </Col>
            <Col md={4} className="d-flex flex-column justify-content-center align-items-center">
              <div className="fs-2 fw-bold text-secondary mb-2">฿{flight.price.toLocaleString()}</div>
              <div className="small text-muted mb-3">ต่อคน รวมภาษีแล้ว</div>
              <Button 
                variant="warning"
                size="lg"
                className="px-4"
                onClick={handleBooking}
              >
                จองตอนนี้
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Tab.Container defaultActiveKey="details">
        <Card>
          <Card.Header>
            <Nav variant="tabs" className="card-header-tabs">
              <Nav.Item>
                <Nav.Link eventKey="details">รายละเอียดเที่ยวบิน</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="baggage">ข้อมูลสัมภาระ</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="policies">นโยบายและเงื่อนไข</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <h5 className="mb-3">รายละเอียดเที่ยวบิน</h5>
                <Table responsive className="flight-details-table">
                  <tbody>
                    <tr>
                      <td width="30%"><strong>สายการบิน:</strong></td>
                      <td>{flight.airline}</td>
                    </tr>
                    <tr>
                      <td><strong>รหัสเที่ยวบิน:</strong></td>
                      <td>{flight.flightNumber}</td>
                    </tr>
                    <tr>
                      <td><strong>วันที่เดินทาง:</strong></td>
                      <td>{formatDate(flight.departureTime)}</td>
                    </tr>
                    <tr>
                      <td><strong>ออกเดินทาง:</strong></td>
                      <td>
                        {formatTime(flight.departureTime)} - {flight.departureAirport?.airportName || flight.from}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>ถึงที่หมาย:</strong></td>
                      <td>
                        {formatTime(flight.arrivalTime)} - {flight.arrivalAirport?.airportName || flight.to}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>ระยะเวลาบิน:</strong></td>
                      <td>{flight.duration}</td>
                    </tr>
                    <tr>
                      <td><strong>ประเภทเครื่องบิน:</strong></td>
                      <td>Boeing 737-800 (หรือเทียบเท่า)</td>
                    </tr>
                    <tr>
                      <td><strong>ชั้นโดยสาร:</strong></td>
                      <td>ชั้นประหยัด (Economy)</td>
                    </tr>
                    <tr>
                      <td><strong>จำนวนที่นั่งว่าง:</strong></td>
                      <td>{flight.availableSeats} ที่นั่ง</td>
                    </tr>
                  </tbody>
                </Table>
                
                <h5 className="mt-4 mb-3">สิ่งอำนวยความสะดวกบนเครื่อง</h5>
                <div className="amenities-section">
                  <div className="amenity-item">
                    <i className="fas fa-wifi available"></i>
                    <span>Wi-Fi</span>
                  </div>
                  <div className="amenity-item">
                    <i className="fas fa-plug available"></i>
                    <span>ปลั๊กไฟ</span>
                  </div>
                  <div className="amenity-item">
                    <i className="fas fa-tv available"></i>
                    <span>เครื่องบันเทิง</span>
                  </div>
                  <div className="amenity-item">
                    <i className="fas fa-utensils available"></i>
                    <span>อาหาร/เครื่องดื่ม</span>
                  </div>
                  <div className="amenity-item">
                    <i className="fas fa-couch available"></i>
                    <span>ที่นั่งปรับเอนได้</span>
                  </div>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="baggage">
                <h5 className="mb-3">น้ำหนักสัมภาระที่รวมในราคา</h5>
                <div className="baggage-info-container">
                  <div className="baggage-card">
                    <i className="fas fa-suitcase baggage-icon"></i>
                    <div>
                      <div className="baggage-weight">กระเป๋าโหลด 20 กก.</div>
                      <p className="baggage-note">สามารถโหลดกระเป๋าได้ไม่เกิน 20 กิโลกรัม</p>
                    </div>
                  </div>
                  <div className="baggage-card">
                    <i className="fas fa-briefcase baggage-icon"></i>
                    <div>
                      <div className="baggage-weight">กระเป๋าถือขึ้นเครื่อง 7 กก.</div>
                      <p className="baggage-note">ขนาดไม่เกิน 56 x 36 x 23 ซม.</p>
                    </div>
                  </div>
                </div>
                
                <h5 className="mt-4 mb-3">บริการสัมภาระเพิ่มเติม</h5>
                <p>คุณสามารถซื้อน้ำหนักสัมภาระเพิ่มได้ในขั้นตอนการจอง:</p>
                <div className="extra-baggage-options">
                  <div className="extra-baggage-option">
                    <div className="option-weight">+5 กก.</div>
                    <div className="option-price">฿500</div>
                  </div>
                  <div className="extra-baggage-option">
                    <div className="option-weight">+10 กก.</div>
                    <div className="option-price">฿900</div>
                  </div>
                  <div className="extra-baggage-option">
                    <div className="option-weight">+15 กก.</div>
                    <div className="option-price">฿1,200</div>
                  </div>
                  <div className="extra-baggage-option">
                    <div className="option-weight">+20 กก.</div>
                    <div className="option-price">฿1,500</div>
                  </div>
                </div>
              </Tab.Pane>
              
              <Tab.Pane eventKey="policies">
                <h5 className="mb-3">นโยบายการคืนเงินและการเปลี่ยนแปลง</h5>
                <div className="policy-item">
                  <h6>การเปลี่ยนแปลงการจอง</h6>
                  <p>สามารถเปลี่ยนแปลงวันเดินทางและชื่อผู้โดยสารได้ โดยมีค่าธรรมเนียมดังนี้:</p>
                  <ul>
                    <li>เปลี่ยนแปลงก่อนเดินทาง 24 ชั่วโมง: ฿1,000 ต่อคนต่อเที่ยว + ส่วนต่างของราคาตั๋ว (ถ้ามี)</li>
                    <li>เปลี่ยนแปลงภายใน 24 ชั่วโมงก่อนเดินทาง: ฿1,500 ต่อคนต่อเที่ยว + ส่วนต่างของราคาตั๋ว (ถ้ามี)</li>
                  </ul>
                </div>
                
                <div className="policy-item">
                  <h6>การขอคืนเงิน</h6>
                  <p>สามารถขอคืนเงินได้ตามเงื่อนไขดังนี้:</p>
                  <ul>
                    <li>ยกเลิกการจองภายใน 24 ชั่วโมงหลังจากทำการจอง: คืนเงินเต็มจำนวน (ตั๋วต้องมีวันเดินทางห่างออกไปมากกว่า 7 วัน)</li>
                    <li>ยกเลิกการจองก่อนเดินทาง 7 วันขึ้นไป: คืนเงิน 75% ของราคาตั๋ว</li>
                    <li>ยกเลิกการจองก่อนเดินทาง 3-7 วัน: คืนเงิน 50% ของราคาตั๋ว</li>
                    <li>ยกเลิกการจองภายใน 48 ชั่วโมงก่อนเดินทาง: ไม่สามารถขอคืนเงินได้</li>
                  </ul>
                </div>
                
                <div className="policy-item">
                  <h6>นโยบายอื่นๆ</h6>
                  <ul>
                    <li>ผู้โดยสารควรมาถึงสนามบินอย่างน้อย 2 ชั่วโมงก่อนเวลาเครื่องออก</li>
                    <li>การเช็คอินปิดก่อนเวลาเครื่องออก 45 นาที</li>
                    <li>ผู้โดยสารต้องแสดงบัตรประชาชนหรือหนังสือเดินทางที่มีอายุการใช้งานเหลือไม่น้อยกว่า 6 เดือน</li>
                  </ul>
                </div>
                
                <div className="policy-note mt-4">
                  <Alert variant="info">
                    <i className="fas fa-info-circle me-2"></i>
                    เพื่อความสะดวกในการเดินทาง แนะนำให้อ่านนโยบายและเงื่อนไขให้ครบถ้วนก่อนทำการจอง
                  </Alert>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
      
      <div className="d-flex justify-content-between mt-4 mb-5">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i>
          ย้อนกลับไปหน้าค้นหา
        </Button>
        <Button variant="warning" onClick={handleBooking}>
          <i className="fas fa-shopping-cart me-2"></i>
          จองตอนนี้
        </Button>
      </div>
    </Container>
  );
};

export default FlightDetails;