// src/components/FlightSearchForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Card, Tab, Nav, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/FlightSearchForm.css';
import axios from 'axios';

const FlightSearchForm = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  
  // State for airports
  const [airports, setAirports] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  
  // Fetch airports list from Aviation Stack API
  useEffect(() => {
    const fetchAirports = async () => {
      setLoadingAirports(true);
      try {
        // Note: Aviation Stack requires a subscription to access the airports endpoint
        // For this example, we'll use a mock list of popular airports
        const mockAirports = [
          { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
          { iata: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand' },
          { iata: 'CNX', name: 'Chiang Mai International Airport', city: 'Chiang Mai', country: 'Thailand' },
          { iata: 'HKT', name: 'Phuket International Airport', city: 'Phuket', country: 'Thailand' },
          { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
          { iata: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
          { iata: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
          { iata: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan' },
          { iata: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
          { iata: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
          { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
          { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
          { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
          { iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
          { iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' }
        ];
        
        setAirports(mockAirports);
      } catch (error) {
        console.error('Error fetching airports:', error);
      } finally {
        setLoadingAirports(false);
      }
    };
    
    fetchAirports();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create search parameters for the Aviation Stack API format
    const searchParams = new URLSearchParams({
      tripType,
      departure: departureAirport,
      arrival: arrivalAirport,
      departureDate: departureDate.toISOString(),
      returnDate: tripType === 'oneway' ? '' : returnDate.toISOString(),
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants
    });
    
    // Navigate to search results page with query parameters
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
                      <Form.Select
                        value={departureAirport}
                        onChange={(e) => setDepartureAirport(e.target.value)}
                        required
                        disabled={loadingAirports}
                      >
                        <option value="">เลือกสนามบินต้นทาง</option>
                        {airports.map(airport => (
                          <option key={airport.iata} value={airport.iata}>
                            {airport.city} ({airport.iata}) - {airport.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>ไปยัง</Form.Label>
                      <Form.Select
                        value={arrivalAirport}
                        onChange={(e) => setArrivalAirport(e.target.value)}
                        required
                        disabled={loadingAirports}
                      >
                        <option value="">เลือกสนามบินปลายทาง</option>
                        {airports.map(airport => (
                          <option key={airport.iata} value={airport.iata}>
                            {airport.city} ({airport.iata}) - {airport.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={tripType === 'roundtrip' ? 6 : 12}>
                    <Form.Group>
                      <Form.Label>วันที่เดินทางไป</Form.Label>
                      <DatePicker
                        selected={departureDate}
                        onChange={(date) => setDepartureDate(date)}
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
                          onChange={(date) => setReturnDate(date)}
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
                        onChange={(e) => setPassengers({...passengers, adults: parseInt(e.target.value)})}>
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
                        onChange={(e) => setPassengers({...passengers, children: parseInt(e.target.value)})}>
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
                        onChange={(e) => setPassengers({...passengers, infants: parseInt(e.target.value)})}>
                        {[...Array(10).keys()].map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid">
                  <Button variant="warning" type="submit" size="lg" disabled={loadingAirports}>
                    {loadingAirports ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        กำลังโหลด...
                      </>
                    ) : (
                      'ค้นหาเที่ยวบิน'
                    )}
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