// src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
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

  // Fetch flights from API
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare search parameters for API
        const params = {
          departure: searchParams.get('from'),
          arrival: searchParams.get('to'),
          date: searchParams.get('departureDate'),
          passengers: searchParams.get('adults') || 1
        };
        
        // Call API service
        const response = await flightService.searchFlights(params);
        setFlights(response.data);
        
        // Calculate total pages based on results (10 items per page)
        setTotalPages(Math.ceil(response.data.length / 10));
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('ไม่สามารถโหลดข้อมูลเที่ยวบินได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, [searchParams]);

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
        
        const hour = new Date(flight.departureTime).getHours();
        
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

  // Render component based on loading/error state
  if (loading) {
    return (
      <Container className="my-4 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังค้นหาเที่ยวบินที่ดีที่สุดสำหรับคุณ...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Card className="text-center py-5">
          <Card.Body>
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-circle fa-3x"></i>
            </div>
            <h4>{error}</h4>
            <Button 
              variant="primary" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              ลองใหม่
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="search-title">ผลการค้นหาเที่ยวบิน</h2>
      <p className="search-info">
        {searchParams.get('from') || 'กรุงเทพฯ'} ไป {searchParams.get('to') || 'เชียงใหม่'} | 
        {searchParams.get('departureDate') ? ` ${new Date(searchParams.get('departureDate')).toLocaleDateString('th-TH')}` : ' 03/03/2566'} | 
        ผู้โดยสาร {parseInt(searchParams.get('adults') || '1')} คน
      </p>
      
      <Row>
        {/* Filter sidebar - Similar to your original code */}
        <Col md={3}>
          {/* Your filter component here */}
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
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchResults;