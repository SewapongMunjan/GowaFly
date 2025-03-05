// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { flightService } from '../services/api';
import FlightCard from '../components/FlightCard';
import Pagination from '../components/Pagination';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Parse search params from URL
  const searchParams = new URLSearchParams(location.search);
  
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    priceRange: [0, 20000],
    airlines: [],
    departureTime: [],
    stops: []
  });
  
  // State for airports display names
  const [departureAirportName, setDepartureAirportName] = useState('');
  const [arrivalAirportName, setArrivalAirportName] = useState('');

  // Fetch flights from Aviation Stack API
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get parameters from URL
        const departure = searchParams.get('departure');
        const arrival = searchParams.get('arrival');
        const departureDate = searchParams.get('departureDate');
        const adults = searchParams.get('adults') || 1;
        
        // Prepare search parameters for Aviation Stack API
        const params = {
          departure,
          arrival,
          date: departureDate,
          passengers: adults
        };

  // Render component based on loading/error state
  if (loading) {
    return (
      <Container className="my-4 text-center py-5">
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" role="status" className="me-2" />
          <span>กำลังค้นหาเที่ยวบินที่ดีที่สุดสำหรับคุณ...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="search-title">ผลการค้นหาเที่ยวบิน</h2>
      <p className="search-info">
        {departureAirportName || 'กรุงเทพฯ'} ไป {arrivalAirportName || 'เชียงใหม่'} | 
        {searchParams.get('departureDate') ? 
          ` ${formatDate(searchParams.get('departureDate'))}` : 
          ' วันนี้'} | 
        ผู้โดยสาร {parseInt(searchParams.get('adults') || '1', 10)} คน
      </p>
      
      {error && (
        <Alert variant="warning" className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      <Row>
        {/* Filter sidebar */}
        <Col md={3} className="mb-4">
          <Card className="filter-card">
            <Card.Header className="bg-light">
              <strong>กรองผลการค้นหา</strong>
            </Card.Header>
            <Card.Body>
              {/* Price filter */}
              <div className="mb-4">
                <h6>ราคา</h6>
                <Form.Group>
                  <Form.Label>ราคาต่ำสุด: ฿{filters.priceRange[0]}</Form.Label>
                  <Form.Range
                    name="minPrice"
                    min={0}
                    max={20000}
                    step={100}
                    value={filters.priceRange[0]}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>ราคาสูงสุด: ฿{filters.priceRange[1]}</Form.Label>
                  <Form.Range
                    name="maxPrice"
                    min={0}
                    max={20000}
                    step={100}
                    value={filters.priceRange[1]}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </div>
              
              {/* Airlines filter */}
              <div className="mb-4">
                <h6>สายการบิน</h6>
                {['TG', 'PG', 'FD', 'DD', 'WE', 'SQ', 'CX', 'JL'].map(airline => (
                  <Form.Check
                    key={airline}
                    type="checkbox"
                    id={`airline-${airline}`}
                    label={airline}
                    name="airlines"
                    value={airline}
                    checked={filters.airlines.includes(airline)}
                    onChange={handleFilterChange}
                    className="mb-2"
                  />
                ))}
              </div>
              
              {/* Departure time filter */}
              <div className="mb-4">
                <h6>เวลาออกเดินทาง</h6>
                <Form.Check
                  type="checkbox"
                  id="time-morning"
                  label="เช้า (05:00 - 11:59)"
                  name="departureTime"
                  value="morning"
                  checked={filters.departureTime.includes('morning')}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="time-afternoon"
                  label="บ่าย (12:00 - 17:59)"
                  name="departureTime"
                  value="afternoon"
                  checked={filters.departureTime.includes('afternoon')}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="time-evening"
                  label="เย็น/กลางคืน (18:00 - 04:59)"
                  name="departureTime"
                  value="evening"
                  checked={filters.departureTime.includes('evening')}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
              </div>
              
              {/* Stops filter */}
              <div className="mb-4">
                <h6>จำนวนจุดเชื่อมต่อ</h6>
                <Form.Check
                  type="checkbox"
                  id="stops-0"
                  label="บินตรง"
                  name="stops"
                  value="0"
                  checked={filters.stops.includes('0')}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="stops-1"
                  label="1 จุดเชื่อมต่อ"
                  name="stops"
                  value="1"
                  checked={filters.stops.includes('1')}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="stops-2"
                  label="2+ จุดเชื่อมต่อ"
                  name="stops"
                  value="2"
                  checked={filters.stops.includes('2')}
                  onChange={handleFilterChange}
                  className="mb-2"
                />
              </div>
              
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => {
                  setFilters({
                    priceRange: [0, 20000],
                    airlines: [],
                    departureTime: [],
                    stops: []
                  });
                }}
              >
                ล้างตัวกรอง
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Flight results */}
        <Col md={9}>
          {getCurrentPageItems().length > 0 ? (
            <>
              {getCurrentPageItems().map(flight => (
                <FlightCard 
                  key={flight.id}
                  flight={flight}
                  onSelect={() => navigate(`/flight/${flight.id}`)}
                />
              ))}
              
              {/* Pagination */}
              {filteredFlights().length > 10 && (
                <Row className="mt-4 mb-5">
                  <Col className="d-flex justify-content-center">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredFlights().length / 10)}
                      onPageChange={handlePageChange}
                    />
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <Card className="text-center py-5">
              <Card.Body>
                <h4>ไม่พบเที่ยวบินที่ตรงกับเงื่อนไขการค้นหา</h4>
                <p>กรุณาปรับเปลี่ยนเงื่อนไขการค้นหาหรือลองค้นหาในวันอื่น</p>
                <Button variant="primary" onClick={() => navigate('/')}>
                  กลับไปค้นหาใหม่
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );

  // Filter flights based on selected filters
  const filteredFlights = () => {
    return flights.filter(flight => {
      // Price filter
      const priceInRange = 
        flight.price >= filters.priceRange[0] && 
        flight.price <= filters.priceRange[1];
      
      // Airline filter
      const airlineMatch = 
        filters.airlines.length === 0 || 
        filters.airlines.includes(flight.airlineCode);
      
      // Departure time filter
      const departureTimeMatch = () => {
        if (filters.departureTime.length === 0) return true;
        
        const departureDate = new Date(flight.departureTime);
        const hour = departureDate.getHours();
        
        return filters.departureTime.some(timeRange => {
          if (timeRange === 'morning') return hour >= 5 && hour < 12;
          if (timeRange === 'afternoon') return hour >= 12 && hour < 18;
          if (timeRange === 'evening') return hour >= 18 || hour < 5;
          return false;
        });
      };
      
      // Stops filter
      const stopsMatch = 
        filters.stops.length === 0 || 
        filters.stops.includes(flight.stops.toString());
      
      return priceInRange && airlineMatch && departureTimeMatch() && stopsMatch;
    });
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const filtered = filteredFlights();
    const indexOfLastItem = currentPage * 10;
    const indexOfFirstItem = indexOfLastItem - 10;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (type === 'checkbox') {
      // For checkbox filters
      setFilters(prev => {
        const currentValues = [...prev[name]];
        
        if (checked) {
          return { ...prev, [name]: [...currentValues, value] };
        } else {
          return { ...prev, [name]: currentValues.filter(item => item !== value) };
        }
      });
    } else if (name === 'minPrice' || name === 'maxPrice') {
      // For price range filters
      const index = name === 'minPrice' ? 0 : 1;
      const newValue = parseInt(value) || 0;
      
      setFilters(prev => {
        const newPriceRange = [...prev.priceRange];
        newPriceRange[index] = newValue;
        return { ...prev, priceRange: newPriceRange };
      });
    } else {
      // For other inputs
      setFilters(prev => ({ ...prev, [name]: value }));
    }
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
        
        // Get airport names for display (using our mock data)
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
        ];
        
        // Find the departure and arrival airport names for display
        if (departure) {
          const departureAirport = mockAirports.find(airport => airport.iata === departure);
          if (departureAirport) {
            setDepartureAirportName(`${departureAirport.city} (${departureAirport.iata})`);
          } else {
            setDepartureAirportName(departure);
          }
        }
        
        if (arrival) {
          const arrivalAirport = mockAirports.find(airport => airport.iata === arrival);
          if (arrivalAirport) {
            setArrivalAirportName(`${arrivalAirport.city} (${arrivalAirport.iata})`);
          } else {
            setArrivalAirportName(arrival);
          }
        }
        
        // Call the Aviation Stack API service
        const response = await flightService.searchFlights(params);
        
        // If there are no results from the API, provide some mock data for demonstration
        if (response.data.length === 0) {
          const mockFlights = generateMockFlights(departure, arrival, departureDate, 10);
          setFlights(mockFlights);
          setTotalPages(Math.ceil(mockFlights.length / 10));
        } else {
          setFlights(response.data);
          setTotalPages(Math.ceil(response.data.length / 10));
        }
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('ไม่สามารถโหลดข้อมูลเที่ยวบินได้ กรุณาลองใหม่อีกครั้ง');
        
        // Generate mock flights for demonstration in case of API error
        const departure = searchParams.get('departure') || 'BKK';
        const arrival = searchParams.get('arrival') || 'CNX';
        const departureDate = searchParams.get('departureDate') || new Date().toISOString();
        
        const mockFlights = generateMockFlights(departure, arrival, departureDate, 10);
        setFlights(mockFlights);
        setTotalPages(Math.ceil(mockFlights.length / 10));
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, [searchParams]);
  
  // Function to generate mock flights when API doesn't return data or has an error
  const generateMockFlights = (departureCode, arrivalCode, departureDate, count) => {
    const airlines = [
      { name: 'Thai Airways', code: 'TG' },
      { name: 'Bangkok Airways', code: 'PG' },
      { name: 'Thai AirAsia', code: 'FD' },
      { name: 'Nok Air', code: 'DD' },
      { name: 'Thai Smile', code: 'WE' },
      { name: 'Singapore Airlines', code: 'SQ' },
      { name: 'Cathay Pacific', code: 'CX' },
      { name: 'Japan Airlines', code: 'JL' }
    ];
    
    // Get airport information
    const mockAirports = [
      { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
      { iata: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand' },
      { iata: 'CNX', name: 'Chiang Mai International Airport', city: 'Chiang Mai', country: 'Thailand' },
      { iata: 'HKT', name: 'Phuket International Airport', city: 'Phuket', country: 'Thailand' },
      { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
      { iata: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
      { iata: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
      { iata: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' }
    ];
    
    const departureAirport = mockAirports.find(a => a.iata === departureCode) || 
      { iata: departureCode, name: `${departureCode} Airport`, city: departureCode, country: 'Unknown' };
    
    const arrivalAirport = mockAirports.find(a => a.iata === arrivalCode) || 
      { iata: arrivalCode, name: `${arrivalCode} Airport`, city: arrivalCode, country: 'Unknown' };
    
    const depDate = new Date(departureDate);
    
    // Generate the specified number of mock flights
    return Array.from({ length: count }).map((_, index) => {
      // Random airline
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      
      // Random flight number
      const flightNumber = `${airline.code}${Math.floor(Math.random() * 900) + 100}`;
      
      // Random departure time (add 1-24 hours to the departure date)
      const departureHoursOffset = index * 2; // Spread flights throughout the day
      const departureDateTime = new Date(depDate);
      departureDateTime.setHours(depDate.getHours() + departureHoursOffset);
      
      // Random flight duration (1-8 hours)
      const durationHours = 1 + Math.floor(Math.random() * 4);
      const durationMinutes = Math.floor(Math.random() * 60);
      
      // Calculate arrival time
      const arrivalDateTime = new Date(departureDateTime);
      arrivalDateTime.setHours(arrivalDateTime.getHours() + durationHours);
      arrivalDateTime.setMinutes(arrivalDateTime.getMinutes() + durationMinutes);
      
      // Format duration
      const duration = `${durationHours}h ${durationMinutes}m`;
      
      // Random price (1000-10000)
      const price = Math.floor(Math.random() * 9000) + 1000;
      
      // Random number of available seats
      const availableSeats = Math.floor(Math.random() * 100) + 20;
      
      // Generate the mock flight object
      return {
        id: flightNumber,
        airline: airline.name,
        airlineCode: airline.code,
        flightNumber,
        from: `${departureAirport.city} (${departureAirport.iata})`,
        to: `${arrivalAirport.city} (${arrivalAirport.iata})`,
        departureTime: departureDateTime.toISOString(),
        arrivalTime: arrivalDateTime.toISOString(),
        departureAirport: {
          id: departureAirport.iata,
          airportName: departureAirport.name,
          airportCode: departureAirport.iata,
          city: departureAirport.city,
          country: departureAirport.country
        },
        arrivalAirport: {
          id: arrivalAirport.iata,
          airportName: arrivalAirport.name,
          airportCode: arrivalAirport.iata,
          city: arrivalAirport.city,
          country: arrivalAirport.country
        },
        duration,
        status: 'scheduled',
        price,
        availableSeats,
        stops: 0
      };
    });
  };