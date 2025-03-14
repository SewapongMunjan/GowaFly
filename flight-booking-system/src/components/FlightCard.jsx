// src/components/FlightCard.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import '../styles/FlightCard.css';

const FlightCard = ({ flight, onSelect }) => {
  // Format date and time for display
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateTimeString;
    }
  };

  // Format date for display
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateTimeString;
    }
  };

  return (
    <Card className="mb-3 flight-card">
      <Card.Body>
        <Row>
          <Col md={2}>
            <div className="airline-logo text-center">
              <div className="airline-logo-placeholder">{flight.airlineCode}</div>
              <div className="airline-name">{flight.airline}</div>
            </div>
          </Col>
          <Col md={7}>
            <div className="flight-info">
              <div className="d-flex justify-content-between mb-2">
                <div className="flight-time">
                  <div className="departure-time">{formatTime(flight.departureTime)}</div>
                  <div className="airport-code">{flight.from}</div>
                </div>
                <div className="flight-duration text-center">
                  <div className="duration-line">
                    <hr />
                    {flight.stops === 0 ? 
                      <div className="flight-type">บินตรง</div> : 
                      <div className="flight-type">{flight.stops} จุดเชื่อมต่อ</div>
                    }
                  </div>
                  <div className="duration-time">{flight.duration}</div>
                </div>
                <div className="flight-time text-end">
                  <div className="arrival-time">{formatTime(flight.arrivalTime)}</div>
                  <div className="airport-code">{flight.to}</div>
                </div>
              </div>
              <div className="flight-details">
                <span className="flight-number">เที่ยวบิน {flight.flightNumber}</span>
                <span className="flight-date">• {formatDate(flight.departureTime)}</span>
                <span className="baggage-info">• รวมกระเป๋า 20 กก.</span>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="price-section text-center">
              <div className="flight-price">฿{flight.price.toLocaleString()}</div>
              <small className="price-detail">ต่อคน รวมภาษีแล้ว</small>
              <Button 
                variant="warning" 
                className="w-100 mt-2 select-flight-btn"
                onClick={onSelect}
              >
                เลือกเที่ยวบินนี้
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FlightCard;