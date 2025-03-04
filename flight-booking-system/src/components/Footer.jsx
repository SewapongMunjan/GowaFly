import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container>
        <Row className="footer-content">
          <Col lg={3} md={6} className="footer-col">
            <h3>GowaFly</h3>
            <p>
              บริษัท ไทยสกาย จำกัด ผู้ให้บริการจองตั๋วเครื่องบินออนไลน์ที่ใหญ่ที่สุดในประเทศไทย 
              มุ่งมั่นที่จะสร้างประสบการณ์การจองที่สะดวกและรวดเร็วสำหรับลูกค้าทุกคน
            </p>
          </Col>
          
          <Col lg={3} md={6} className="footer-col">
            <h3>ลิงก์ด่วน</h3>
            <ul className="footer-links">
              <li><Link to="/">หน้าหลัก</Link></li>
              <li><Link to="/manage-booking">ตรวจสอบการจอง</Link></li>
              <li><Link to="/promotions">โปรโมชั่น</Link></li>
              <li><Link to="/help">ช่วยเหลือ</Link></li>
              <li><Link to="/about">เกี่ยวกับเรา</Link></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="footer-col">
            <h3>ช่วยเหลือและสนับสนุน</h3>
            <ul className="footer-links">
              <li><Link to="/faq">คำถามที่พบบ่อย</Link></li>
              <li><Link to="/contact">ติดต่อเรา</Link></li>
              <li><Link to="/terms">ข้อตกลงและเงื่อนไข</Link></li>
              <li><Link to="/privacy">นโยบายความเป็นส่วนตัว</Link></li>
              <li><Link to="/refund">นโยบายการคืนเงิน</Link></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="footer-col">
            <h3>ติดต่อเรา</h3>
            <p>
              <i className="fas fa-map-marker-alt"></i> 123 ถนนสุขุมวิท, กรุงเทพฯ 10110
            </p>
            <p>
              <i className="fas fa-phone"></i> 02-123-4567
            </p>
            <p>
              <i className="fas fa-envelope"></i> info@gowafly.com
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://line.me" target="_blank" rel="noreferrer"><i className="fab fa-line"></i></a>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <Row>
            <Col md={6}>
              <p className="copyright">
                &copy; {new Date().getFullYear()} GowaFly. สงวนลิขสิทธิ์ทั้งหมด.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="payment-methods">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-cc-jcb"></i>
                <i className="fab fa-google-pay"></i>
                <i className="fas fa-money-bill-wave"></i>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;