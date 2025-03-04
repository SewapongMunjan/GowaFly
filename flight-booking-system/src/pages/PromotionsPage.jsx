// src/pages/PromotionsPage.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PromotionsPage = () => {
  // Sample promotions data
  const promotions = [
    {
      id: 1,
      title: 'บินกรุงเทพฯ-เชียงใหม่',
      price: 990,
      description: 'เริ่มต้นเพียง 990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566',
      code: 'CHIANGMAI2023'
    },
    {
      id: 2,
      title: 'บินกรุงเทพฯ-ภูเก็ต',
      price: 1190,
      description: 'เริ่มต้นเพียง 1,190 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566',
      code: 'PHUKET2023'
    },
    {
      id: 3,
      title: 'บินกรุงเทพฯ-สิงคโปร์',
      price: 3990,
      description: 'เริ่มต้นเพียง 3,990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566',
      code: 'SINGAPORE2023'
    },
    {
      id: 4,
      title: 'บินกรุงเทพฯ-โตเกียว',
      price: 7990,
      description: 'เริ่มต้นเพียง 7,990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566',
      code: 'TOKYO2023'
    },
    {
      id: 5,
      title: 'บินกรุงเทพฯ-ฮ่องกง',
      price: 4990,
      description: 'เริ่มต้นเพียง 4,990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566',
      code: 'HONGKONG2023'
    },
    {
      id: 6,
      title: 'บินกรุงเทพฯ-โซล',
      price: 6990,
      description: 'เริ่มต้นเพียง 6,990 บาท ไป-กลับ รวมภาษีแล้ว',
      validUntil: '31 มีนาคม 2566',
      code: 'SEOUL2023'
    }
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">โปรโมชั่นพิเศษ</h2>
      <p className="text-center mb-5">ตั๋วเครื่องบินราคาพิเศษจากสายการบินชั้นนำ เพื่อการเดินทางที่คุ้มค่าสำหรับคุณ</p>
      
      <Row>
        {promotions.map(promo => (
          <Col key={promo.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{promo.title}</Card.Title>
                <div className="promo-price text-danger fw-bold mb-2">฿{promo.price.toLocaleString()}</div>
                <Card.Text>{promo.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">ใช้ได้ถึง: {promo.validUntil}</small>
                  <span className="badge bg-primary">รหัส: {promo.code}</span>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-top-0">
                <button className="btn btn-primary w-100">จองเลย</button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="p-4 mt-4 bg-light rounded">
        <h4>เงื่อนไขการใช้โปรโมชั่น</h4>
        <ul>
          <li>ราคานี้รวมภาษีสนามบินและค่าธรรมเนียมเชื้อเพลิง</li>
          <li>โปรโมชั่นมีจำนวนจำกัด และอาจหมดก่อนกำหนด</li>
          <li>จองและชำระเงินภายในระยะเวลาที่กำหนดเท่านั้น</li>
          <li>สงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</li>
          <li>ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้</li>
        </ul>
      </div>
    </Container>
  );
};

export default PromotionsPage;