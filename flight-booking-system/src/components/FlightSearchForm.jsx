import React, { useState } from 'react';
import { Form, Row, Col, Button, Card, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/FlightSearchForm.css';

const FlightSearchForm = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    // สร้าง query string สำหรับการค้นหา
    const searchParams = new URLSearchParams({
      tripType,
      from: e.target.fromLocation.value,
      to: e.target.toLocation.value,
      departureDate: departureDate.toISOString(),
      returnDate: tripType === 'oneway' ? '' : returnDate.toISOString(),
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants
    });
    
    // นำทางไปยังหน้าผลลัพธ์การค้นหาพร้อม query parameters
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <Card className="search-card">
      <Card.Body>
        <Tab.Container defaultActiveKey="flights">
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="flights">เที่ยวบิน</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="hotels">โรงแรม</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="packages">แพ็คเกจ</Nav.Link>
            </Nav.Item>
          </Nav>
          
          <Tab.Content>
            <Tab.Pane eventKey="flights">
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Check
                    inline
                    type="radio"
                    label="ไป-กลับ"
                    name="tripType"
                    id="roundtrip"
                    checked={tripType === 'roundtrip'}
                    onChange={() => setTripType('roundtrip')}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="เที่ยวเดียว"
                    name="tripType"
                    id="oneway"
                    checked={tripType === 'oneway'}
                    onChange={() => setTripType('oneway')}
                  />
                </div>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>จาก</Form.Label>
                      <Form.Control
                        name="fromLocation"
                        type="text"
                        placeholder="เมืองหรือสนามบินต้นทาง"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>ไปยัง</Form.Label>
                      <Form.Control
                        name="toLocation"
                        type="text"
                        placeholder="เมืองหรือสนามบินปลายทาง"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={tripType === 'roundtrip' ? 6 : 12}>
                    <Form.Group>
                      <Form.Label>วันที่เดินทางไป</Form.Label>
                      <DatePicker
                        selected={departureDate}
                        onChange={date => setDepartureDate(date)}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        required
                      />
                    </Form.Group>
                  </Col>
                  {tripType === 'roundtrip' && (
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>วันที่เดินทางกลับ</Form.Label>
                        <DatePicker
                          selected={returnDate}
                          onChange={date => setReturnDate(date)}
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          minDate={departureDate}
                          required
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                
                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>ผู้ใหญ่</Form.Label>
                      <Form.Select
                        value={passengers.adults}
                        onChange={e => setPassengers({...passengers, adults: parseInt(e.target.value)})}>
                        {[...Array(10).keys()].map(i => (
                          <option key={i} value={i+1}>{i+1}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>เด็ก (2-11 ปี)</Form.Label>
                      <Form.Select
                        value={passengers.children}
                        onChange={e => setPassengers({...passengers, children: parseInt(e.target.value)})}>
                        {[...Array(10).keys()].map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>ทารก (&lt; 2 ปี)</Form.Label>
                      <Form.Select
                        value={passengers.infants}
                        onChange={e => setPassengers({...passengers, infants: parseInt(e.target.value)})}>
                        {[...Array(10).keys()].map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid">
                  <Button variant="warning" type="submit" size="lg">
                    ค้นหาเที่ยวบิน
                  </Button>
                </div>
              </Form>
            </Tab.Pane>
            
            <Tab.Pane eventKey="hotels">
              <div className="text-center py-5">
                <h5>บริการค้นหาโรงแรมจะเปิดให้บริการเร็วๆ นี้</h5>
              </div>
            </Tab.Pane>
            
            <Tab.Pane eventKey="packages">
              <div className="text-center py-5">
                <h5>บริการค้นหาแพ็คเกจจะเปิดให้บริการเร็วๆ นี้</h5>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default FlightSearchForm;