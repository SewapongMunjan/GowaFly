// src/pages/HelpPage.jsx
import React from 'react';
import { Container, Accordion, Card, Button } from 'react-bootstrap';

const HelpPage = () => {
  const faqs = [
    {
      id: 1,
      question: 'ฉันจะเปลี่ยนแปลงการจองของฉันได้อย่างไร?',
      answer: 'คุณสามารถเปลี่ยนแปลงการจองได้โดยไปที่หน้า "การจองของฉัน" และเลือกการจองที่ต้องการเปลี่ยนแปลง จากนั้นกดปุ่ม "เปลี่ยนแปลงการจอง" โปรดทราบว่าการเปลี่ยนแปลงการจองอาจมีค่าธรรมเนียม ขึ้นอยู่กับเงื่อนไขของตั๋ว'
    },
    {
      id: 2,
      question: 'ฉันจะยกเลิกการจองและขอเงินคืนได้อย่างไร?',
      answer: 'คุณสามารถยกเลิกการจองได้โดยไปที่หน้า "การจองของฉัน" และเลือกการจองที่ต้องการยกเลิก จากนั้นกดปุ่ม "ยกเลิกการจอง" การขอเงินคืนจะเป็นไปตามนโยบายการคืนเงินของสายการบินและประเภทตั๋วที่คุณจอง'
    },
    {
      id: 3,
      question: 'ฉันต้องทำอย่างไรหากไม่ได้รับอีเมลยืนยันการจอง?',
      answer: 'หากคุณไม่ได้รับอีเมลยืนยันการจอง โปรดตรวจสอบโฟลเดอร์สแปมหรือถังขยะของคุณก่อน หากยังไม่พบ โปรดติดต่อฝ่ายบริการลูกค้าของเราที่ support@gowafly.com หรือโทร 02-123-4567 พร้อมแจ้งรายละเอียดการจองของคุณ'
    },
    {
      id: 4,
      question: 'ฉันสามารถเพิ่มน้ำหนักกระเป๋าได้หรือไม่?',
      answer: 'ได้ คุณสามารถเพิ่มน้ำหนักกระเป๋าได้ทั้งในขั้นตอนการจองหรือหลังจากทำการจองแล้ว โดยไปที่หน้า "การจองของฉัน" และเลือกบริการเสริม ค่าธรรมเนียมการเพิ่มน้ำหนักกระเป๋าจะขึ้นอยู่กับสายการบินและเส้นทางการบิน'
    },
    {
      id: 5,
      question: 'ฉันสามารถเลือกที่นั่งได้เมื่อไหร่?',
      answer: 'คุณสามารถเลือกที่นั่งได้ทันทีหลังจากทำการจองและชำระเงินเรียบร้อยแล้ว โดยไปที่หน้า "การจองของฉัน" และเลือก "เลือกที่นั่ง" ในบางกรณี สายการบินอาจเปิดให้เลือกที่นั่งล่วงหน้า 24-48 ชั่วโมงก่อนเวลาเดินทาง'
    },
    {
      id: 6,
      question: 'ฉันจะได้รับบัตรขึ้นเครื่องเมื่อไหร่?',
      answer: 'คุณสามารถทำการเช็คอินออนไลน์และรับบัตรขึ้นเครื่องได้ล่วงหน้า 24-48 ชั่วโมงก่อนเวลาเดินทาง (ขึ้นอยู่กับสายการบิน) โดยไปที่เว็บไซต์ของสายการบินโดยตรง หรือคุณสามารถเช็คอินที่เคาน์เตอร์สายการบินในวันเดินทางได้เช่นกัน'
    }
  ];

  const contactChannels = [
    { id: 1, icon: 'phone', channel: 'โทรศัพท์', contact: '02-123-4567', hours: 'ทุกวัน 08:00 - 20:00 น.' },
    { id: 2, icon: 'envelope', channel: 'อีเมล', contact: 'support@gowafly.com', hours: 'ตอบกลับภายใน 24 ชม.' },
    { id: 3, icon: 'comment', channel: 'Live Chat', contact: 'คลิกที่ไอคอนแชทมุมขวาล่าง', hours: 'ทุกวัน 09:00 - 18:00 น.' },
    { id: 4, icon: 'line', channel: 'LINE', contact: '@gowafly', hours: 'ทุกวัน 09:00 - 18:00 น.' }
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">ศูนย์ช่วยเหลือ</h2>
      
      <div className="bg-light p-4 rounded mb-5">
        <h4>ช่องทางการติดต่อ</h4>
        <div className="row mt-3">
          {contactChannels.map(channel => (
            <div key={channel.id} className="col-md-3 col-sm-6 mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <i className={`fas fa-${channel.icon} fa-2x mb-3 text-primary`}></i>
                  <h5>{channel.channel}</h5>
                  <p className="mb-1">{channel.contact}</p>
                  <small className="text-muted">{channel.hours}</small>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <h4 className="mb-3">คำถามที่พบบ่อย</h4>
      <Accordion defaultActiveKey="0" className="mb-5">
        {faqs.map((faq, index) => (
          <Accordion.Item key={faq.id} eventKey={index.toString()}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>
              {faq.answer}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      
      <div className="text-center p-5 bg-light rounded">
        <h4>ไม่พบคำตอบที่คุณต้องการ?</h4>
        <p className="mb-4">ทีมงานของเราพร้อมให้ความช่วยเหลือคุณ</p>
        <Button variant="primary" size="lg">ติดต่อเรา</Button>
      </div>
    </Container>
  );
};

export default HelpPage;