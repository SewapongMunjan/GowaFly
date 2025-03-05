// src/pages/admin/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { adminService } from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected booking state
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Form states
  const [bookingStatus, setBookingStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle update booking status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await adminService.updateBookingStatus(selectedBooking.id, bookingStatus);
      await fetchBookings();
      setShowStatusModal(false);
      setSuccessMessage(`อัปเดตสถานะการจองเป็น "${getStatusThaiName(bookingStatus)}" เรียบร้อยแล้ว`);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะการจอง');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get Thai name for booking status
  const getStatusThaiName = (status) => {
    switch (status) {
      case 'Pending': return 'รอดำเนินการ';
      case 'Confirmed': return 'ยืนยันแล้ว';
      case 'Canceled': return 'ยกเลิก';
      case 'Completed': return 'เสร็จสิ้น';
      case 'Refunded': return 'คืนเงินแล้ว';
      default: return status;
    }
  };
  
  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'success';
      case 'Canceled': return 'danger';
      case 'Completed': return 'primary';
      case 'Refunded': return 'info';
      default: return 'secondary';
    }
  };
  
  // Format datetime for display
  const formatDateTimeForDisplay = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Open booking details modal
  const openDetailsModal = async (bookingId) => {
    try {
      setLoading(true);
      const response = await adminService.getBookingById(bookingId);
      setSelectedBooking(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('ไม่สามารถโหลดรายละเอียดการจองได้');
    } finally {
      setLoading(false);
    }
  };
  
  // Open status update modal
  const openStatusModal = (booking) => {
    setSelectedBooking(booking);
    setBookingStatus(booking.status);
    setShowStatusModal(true);
  };
  
  // Filter bookings by status
  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  if (loading && !selectedBooking) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลการจอง...</p>
      </div>
    );
  }

  return (
    <div className="admin-bookings">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title mb-0">จัดการการจอง</h2>
      </div>
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* Status filter */}
      <div className="mb-4">
        <Form.Group>
          <Form.Label>กรองตามสถานะ</Form.Label>
          <Form.Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ทั้งหมด</option>
            <option value="Pending">รอดำเนินการ</option>
            <option value="Confirmed">ยืนยันแล้ว</option>
            <option value="Canceled">ยกเลิก</option>
            <option value="Completed">เสร็จสิ้น</option>
            <option value="Refunded">คืนเงินแล้ว</option>
          </Form.Select>
        </Form.Group>
      </div>
      
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>รหัสการจอง</th>
                <th>ผู้จอง</th>
                <th>เที่ยวบิน</th>
                <th>วันที่จอง</th>
                <th>ผู้โดยสาร</th>
                <th>ราคารวม</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>
                    {booking.user.fullName}
                    <div className="small text-muted">{booking.user.email}</div>
                  </td>
                  <td>
                    {booking.flight.departureAirport.airportCode} - {booking.flight.arrivalAirport.airportCode}
                    <div className="small text-muted">{booking.flight.flightNumber}</div>
                  </td>
                  <td>{formatDateTimeForDisplay(booking.bookingDate)}</td>
                  <td>{booking.passengers.length}</td>
                  <td>฿{parseFloat(booking.totalPrice).toLocaleString()}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(booking.status)}>
                      {getStatusThaiName(booking.status)}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2" 
                      onClick={() => openDetailsModal(booking.id)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={() => openStatusModal(booking)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">ไม่พบข้อมูลการจอง</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Booking Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียดการจอง #{selectedBooking?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="ข้อมูลทั่วไป">
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">รหัสการจอง</Col>
                    <Col md={8}>#{selectedBooking.id}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">วันที่จอง</Col>
                    <Col md={8}>{formatDateTimeForDisplay(selectedBooking.bookingDate)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">สถานะ</Col>
                    <Col md={8}>
                      <Badge bg={getStatusBadgeVariant(selectedBooking.status)}>
                        {getStatusThaiName(selectedBooking.status)}
                      </Badge>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">ราคารวม</Col>
                    <Col md={8}>฿{parseFloat(selectedBooking.totalPrice).toLocaleString()}</Col>
                  </Row>
                  
                  <h6 className="mt-4 mb-3">ข้อมูลผู้จอง</h6>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">ชื่อ-นามสกุล</Col>
                    <Col md={8}>{selectedBooking.user.fullName}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">อีเมล</Col>
                    <Col md={8}>{selectedBooking.user.email}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">เบอร์โทรศัพท์</Col>
                    <Col md={8}>{selectedBooking.user.phone}</Col>
                  </Row>
                  
                  <h6 className="mt-4 mb-3">ข้อมูลเที่ยวบิน</h6>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">สายการบิน</Col>
                    <Col md={8}>{selectedBooking.flight.airline}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">รหัสเที่ยวบิน</Col>
                    <Col md={8}>{selectedBooking.flight.flightNumber}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">เส้นทาง</Col>
                    <Col md={8}>
                      {selectedBooking.flight.departureAirport.city} ({selectedBooking.flight.departureAirport.airportCode}) - 
                      {selectedBooking.flight.arrivalAirport.city} ({selectedBooking.flight.arrivalAirport.airportCode})
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">วันที่/เวลาออกเดินทาง</Col>
                    <Col md={8}>{formatDateTimeForDisplay(selectedBooking.flight.departureTime)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4} className="fw-bold">วันที่/เวลาถึงที่หมาย</Col>
                    <Col md={8}>{formatDateTimeForDisplay(selectedBooking.flight.arrivalTime)}</Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="passengers" title="ผู้โดยสาร">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>เลขที่หนังสือเดินทาง</th>
                        <th>วันเกิด</th>
                        <th>ที่นั่ง</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooking.passengers.map((passenger, index) => (
                        <tr key={passenger.id}>
                          <td>{index + 1}</td>
                          <td>{passenger.fullName}</td>
                          <td>{passenger.passportNumber}</td>
                          <td>
                            {new Date(passenger.dateOfBirth).toLocaleDateString('th-TH')}
                          </td>
                          <td>{passenger.seatNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>
                
                <Tab eventKey="payments" title="การชำระเงิน">
                  {selectedBooking.payments.length > 0 ? (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>รหัสการชำระเงิน</th>
                          <th>วันที่ชำระเงิน</th>
                          <th>วิธีการชำระเงิน</th>
                          <th>จำนวนเงิน</th>
                          <th>สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBooking.payments.map(payment => (
                          <tr key={payment.id}>
                            <td>#{payment.id}</td>
                            <td>{formatDateTimeForDisplay(payment.transactionDate)}</td>
                            <td>{payment.paymentMethod}</td>
                            <td>฿{parseFloat(payment.amount).toLocaleString()}</td>
                            <td>
                              <Badge bg={
                                payment.paymentStatus === 'Completed' ? 'success' :
                                payment.paymentStatus === 'Failed' ? 'danger' :
                                payment.paymentStatus === 'Refunded' ? 'info' :
                                'warning'
                              }>
                                {payment.paymentStatus === 'Completed' ? 'สำเร็จ' :
                                 payment.paymentStatus === 'Failed' ? 'ล้มเหลว' :
                                 payment.paymentStatus === 'Refunded' ? 'คืนเงิน' :
                                 payment.paymentStatus}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">
                      ไม่พบข้อมูลการชำระเงิน
                    </Alert>
                  )}
                </Tab>
              </Tabs>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            ปิด
          </Button>
          <Button 
            variant="warning"
            onClick={() => {
              setShowDetailsModal(false);
              openStatusModal(selectedBooking);
            }}
          >
            แก้ไขสถานะ
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Update Status Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>อัปเดตสถานะการจอง #{selectedBooking?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateStatus}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>สถานะการจอง</Form.Label>
              <Form.Select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value)}
                required
              >
                <option value="">เลือกสถานะการจอง</option>
                <option value="Pending">รอดำเนินการ</option>
                <option value="Confirmed">ยืนยันแล้ว</option>
                <option value="Canceled">ยกเลิก</option>
                <option value="Completed">เสร็จสิ้น</option>
                <option value="Refunded">คืนเงินแล้ว</option>
              </Form.Select>
            </Form.Group>
            
            {bookingStatus === 'Canceled' && (
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                การยกเลิกการจองจะทำให้ที่นั่งกลับมาว่างและพร้อมสำหรับการจองใหม่
              </Alert>
            )}
            
            {bookingStatus === 'Refunded' && (
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                การคืนเงินจะต้องดำเนินการผ่านระบบการเงินแยกต่างหาก การเปลี่ยนสถานะนี้เป็นเพียงการบันทึกข้อมูลเท่านั้น
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
              ยกเลิก
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting || !bookingStatus}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  กำลังบันทึก...
                </>
              ) : 'บันทึก'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBookings;