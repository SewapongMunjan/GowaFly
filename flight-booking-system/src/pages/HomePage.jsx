import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FlightSearchForm from '../components/FlightSearchForm';
import '../styles/HomePage.css';

const HomePage = () => {
  // ข้อมูลจำลองสำหรับโปรโมชัน
  const promotions = [
    {
      id: 1,
      title: 'บินกรุงเทพฯ-เชียงใหม่',
      price: 990,
      image: '/images/chiangmai.jpg',
      description: 'เริ่มต้นเพียง 990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566'
    },
    {
      id: 2,
      title: 'บินกรุงเทพฯ-ภูเก็ต',
      price: 1190,
      image: '/images/phuket.jpg',
      description: 'เริ่มต้นเพียง 1,190 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566'
    },
    {
      id: 3,
      title: 'บินกรุงเทพฯ-สิงคโปร์',
      price: 3990,
      image: '/images/singapore.jpg',
      description: 'เริ่มต้นเพียง 3,990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566'
    }
  ];

  // ข้อมูลจำลองสำหรับจุดหมายปลายทางยอดนิยม
  const destinations = [
    { id: 1, name: 'กรุงเทพฯ', image: '/images/bangkok.jpg' },
    { id: 2, name: 'เชียงใหม่', image: '/images/chiangmai.jpg' },
    { id: 3, name: 'ภูเก็ต', image: '/images/phuket.jpg' },
    { id: 4, name: 'โตเกียว', image: '/images/tokyo.jpg' }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <FlightSearchForm />
            </Col>
          </Row>
        </Container>
      </div>
      
      <Container className="my-5">
        <h2 className="section-title">โปรโมชั่นพิเศษสำหรับคุณ</h2>
        <Row>
          {promotions.map(promo => (
            <Col key={promo.id} md={4} className="mb-4">
              <Card className="promotion-card h-100">
                <div className="promotion-image" style={{ backgroundImage: `url(${promo.image})` }}></div>
                <Card.Body>
                  <Card.Title>{promo.title}</Card.Title>
                  <div className="promotion-price">฿{promo.price.toLocaleString()}</div>
                  <Card.Text>{promo.description}</Card.Text>
                  <div className="promotion-validity">ถึง {promo.validUntil}</div>
                </Card.Body>
                <Card.Footer>
                  <button className="btn btn-primary w-100">ดูรายละเอียด</button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      
      <div className="bg-light py-5">
        <Container>
          <h2 className="section-title">บริการของเรา</h2>
          <Row className="mt-4">
            <Col md={4} className="mb-4">
              <Card className="service-card h-100">
                <Card.Body className="text-center">
                  <div className="service-icon">
                    <i className="fas fa-plane"></i>
                  </div>
                  <Card.Title>ค้นหาเที่ยวบินราคาถูก</Card.Title>
                  <Card.Text>
                    เปรียบเทียบราคาตั๋วเครื่องบินจากสายการบินชั้นนำทั่วโลก พร้อมโปรโมชั่นพิเศษเฉพาะที่ GowaFly
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="service-card h-100">
                <Card.Body className="text-center">
                  <div className="service-icon">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <Card.Title>ชำระเงินที่ปลอดภัย</Card.Title>
                  <Card.Text>
                    รองรับการชำระเงินหลากหลายรูปแบบ ทั้งบัตรเครดิต/เดบิต การโอนผ่านธนาคาร และ QR Code
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="service-card h-100">
                <Card.Body className="text-center">
                  <div className="service-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <Card.Title>บริการลูกค้า 24 ชั่วโมง</Card.Title>
                  <Card.Text>
                    ทีมงานพร้อมให้บริการตลอด 24 ชั่วโมง ไม่ว่าจะเป็นการเปลี่ยนแปลงการจอง หรือข้อสงสัยต่างๆ
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Container className="my-5">
        <h2 className="section-title">จุดหมายปลายทางยอดนิยม</h2>
        <Row className="destination-cards">
          {destinations.map(destination => (
            <Col key={destination.id} md={3} sm={6} className="mb-4">
              <Card className="destination-card">
                <div className="destination-image" style={{ backgroundImage: `url(${destination.image})` }}>
                  <div className="destination-overlay">
                    <h3>{destination.name}</h3>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;