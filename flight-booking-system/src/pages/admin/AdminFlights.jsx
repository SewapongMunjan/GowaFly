// src/pages/admin/AdminFlights.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Alert, Badge } from 'react-bootstrap';
import { adminService } from '../../services/api';

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    availableSeats: ''
  });
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Fetch flights and airports from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both flights and airports data
        const [flightsResponse, airportsResponse] = await Promise.all([
          adminService.getAllFlights(),
          adminService.getAllAirports()
        ]);
        
        setFlights(flightsResponse.data);
        setAirports(airportsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
    
    // Clear field error
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.airline.trim()) {
      errors.airline = 'กรุณากรอกชื่อสายการบิน';
    }
    
    if (!formData.flightNumber.trim()) {
      errors.flightNumber = 'กรุณากรอกรหัสเที่ยวบิน';
    }
    
    if (!formData.departureAirportId) {
      errors.departureAirportId = 'กรุณาเลือกสนามบินต้นทาง';
    }
    
    if (!formData.arrivalAirportId) {
      errors.arrivalAirportId = 'กรุณาเลือกสนามบินปลายทาง';
    }
    
    if (formData.departureAirportId === formData.arrivalAirportId) {
      errors.arrivalAirportId = 'สนามบินต้นทางและปลายทางต้องไม่เป็นสนามบินเดียวกัน';
    }
    
    if (!formData.departureTime) {
      errors.departureTime = 'กรุณาระบุเวลาออกเดินทาง';
    }
    
    if (!formData.arrivalTime) {
      errors.arrivalTime = 'กรุณาระบุเวลาถึงที่หมาย';
    }
    
    // Check that arrival time is after departure time
    if (formData.departureTime && formData.arrivalTime) {
      const departureTime = new Date(formData.departureTime);
      const arrivalTime = new Date(formData.arrivalTime);
      
      if (arrivalTime <= departureTime) {
        errors.arrivalTime = 'เวลาถึงที่หมายต้องมากกว่าเวลาออกเดินทาง';
      }
    }
    
    if (!formData.price) {
      errors.price = 'กรุณากรอกราคา';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'ราคาต้องมากกว่า 0';
    }
    
    if (!formData.availableSeats) {
      errors.availableSeats = 'กรุณากรอกจำนวนที่นั่ง';
    } else if (parseInt(formData.availableSeats) <= 0) {
      errors.availableSeats = 'จำนวนที่นั่งต้องมากกว่า 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle add flight
  const handleAddFlight = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await adminService.createFlight(formData);
      const response = await adminService.getAllFlights();
      setFlights(response.data);
      setShowAddModal(false);
      setFormData({
        airline: '',
        flightNumber: '',
        departureAirportId: '',
        arrivalAirportId: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        availableSeats: ''
      });
      setSuccessMessage('เพิ่มเที่ยวบินเรียบร้อยแล้ว');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding flight:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มเที่ยวบิน'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle edit flight
  const handleEditFlight = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await adminService.updateFlight(selectedFlightId, formData);
      const response = await adminService.getAllFlights();
      setFlights(response.data);
      setShowEditModal(false);
      setSuccessMessage('อัปเดตข้อมูลเที่ยวบินเรียบร้อยแล้ว');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating flight:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตเที่ยวบิน'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle delete flight
  const handleDeleteFlight = async () => {
    try {
      setSubmitting(true);
      await adminService.deleteFlight(selectedFlightId);
      const response = await adminService.getAllFlights();
      setFlights(response.data);
      setShowDeleteModal(false);
      setSuccessMessage('ลบเที่ยวบินเรียบร้อยแล้ว');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting flight:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบเที่ยวบิน');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Open edit modal and populate form
  const openEditModal = (flight) => {
    setSelectedFlightId(flight.id);
    setFormData({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirportId: flight.departureAirportId,
      arrivalAirportId: flight.arrivalAirportId,
      departureTime: formatDateTimeForInput(flight.departureTime),
      arrivalTime: formatDateTimeForInput(flight.arrivalTime),
      price: flight.price,
      availableSeats: flight.availableSeats
    });
    setFormErrors({});
    setShowEditModal(true);
  };
  
  // Format datetime for datetime-local input
  const formatDateTimeForInput = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toISOString().slice(0, 16);
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
  
  // Open delete modal
  const openDeleteModal = (flightId) => {
    setSelectedFlightId(flightId);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลเที่ยวบิน...</p>
      </div>
    );
  }

  return (
    <div className="admin-flights">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title mb-0">จัดการเที่ยวบิน</h2>
        <Button variant="primary" onClick={() => {
          setFormData({
            airline: '',
            flightNumber: '',
            departureAirportId: '',
            arrivalAirportId: '',
            departureTime: '',
            arrivalTime: '',
            price: '',
            availableSeats: ''
          });
          setFormErrors({});
          setShowAddModal(true);
        }}>
          <i className="fas fa-plus me-2"></i>
          เพิ่มเที่ยวบิน
        </Button>
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
      
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>รหัสเที่ยวบิน</th>
                <th>สายการบิน</th>
                <th>เส้นทาง</th>
                <th>วันที่/เวลา</th>
                <th>ราคา</th>
                <th>ที่นั่งว่าง</th>
                <th>การจอง</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.id}>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>
                    {flight.departureAirport.airportCode} - {flight.arrivalAirport.airportCode}
                    <div className="small text-muted">
                      {flight.departureAirport.city} - {flight.arrivalAirport.city}
                    </div>
                  </td>
                  <td>
                    <div>{formatDateTimeForDisplay(flight.departureTime)}</div>
                    <div className="small text-muted">{formatDateTimeForDisplay(flight.arrivalTime)}</div>
                  </td>
                  <td>฿{parseFloat(flight.price).toLocaleString()}</td>
                  <td>{flight.availableSeats}</td>
                  <td>{flight._count?.bookings || 0}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2" 
                      onClick={() => openEditModal(flight)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => openDeleteModal(flight.id)}
                      disabled={flight._count?.bookings > 0} // Prevent deleting flights with bookings
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {flights.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">ไม่พบข้อมูลเที่ยวบิน</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Add Flight Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มเที่ยวบิน</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddFlight}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger" className="mb-3">
                {formErrors.submit}
              </Alert>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>สายการบิน</Form.Label>
                  <Form.Control
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.airline}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.airline}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสเที่ยวบิน</Form.Label>
                  <Form.Control
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.flightNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.flightNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>สนามบินต้นทาง</Form.Label>
                  <Form.Select
                    name="departureAirportId"
                    value={formData.departureAirportId}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.departureAirportId}
                  >
                    <option value="">เลือกสนามบินต้นทาง</option>
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>
                        {airport.airportCode} - {airport.city}, {airport.country}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.departureAirportId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>สนามบินปลายทาง</Form.Label>
                  <Form.Select
                    name="arrivalAirportId"
                    value={formData.arrivalAirportId}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.arrivalAirportId}
                  >
                    <option value="">เลือกสนามบินปลายทาง</option>
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>
                        {airport.airportCode} - {airport.city}, {airport.country}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.arrivalAirportId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>วันที่/เวลาออกเดินทาง</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.departureTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.departureTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>วันที่/เวลาถึงที่หมาย</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.arrivalTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.arrivalTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ราคา (บาท)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    isInvalid={!!formErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>จำนวนที่นั่ง</Form.Label>
                  <Form.Control
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    min="1"
                    isInvalid={!!formErrors.availableSeats}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.availableSeats}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting}
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
      
      {/* Edit Flight Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลเที่ยวบิน</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditFlight}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger" className="mb-3">
                {formErrors.submit}
              </Alert>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>สายการบิน</Form.Label>
                  <Form.Control
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.airline}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.airline}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสเที่ยวบิน</Form.Label>
                  <Form.Control
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.flightNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.flightNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>สนามบินต้นทาง</Form.Label>
                  <Form.Select
                    name="departureAirportId"
                    value={formData.departureAirportId}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.departureAirportId}
                  >
                    <option value="">เลือกสนามบินต้นทาง</option>
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>
                        {airport.airportCode} - {airport.city}, {airport.country}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.departureAirportId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>สนามบินปลายทาง</Form.Label>
                  <Form.Select
                    name="arrivalAirportId"
                    value={formData.arrivalAirportId}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.arrivalAirportId}
                  >
                    <option value="">เลือกสนามบินปลายทาง</option>
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>
                        {airport.airportCode} - {airport.city}, {airport.country}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.arrivalAirportId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>วันที่/เวลาออกเดินทาง</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.departureTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.departureTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>วันที่/เวลาถึงที่หมาย</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.arrivalTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.arrivalTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ราคา (บาท)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    isInvalid={!!formErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>จำนวนที่นั่ง</Form.Label>
                  <Form.Control
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    min="1"
                    isInvalid={!!formErrors.availableSeats}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.availableSeats}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              ยกเลิก
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting}
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
      
      {/* Delete Flight Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          คุณต้องการลบเที่ยวบินนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถเรียกคืนได้
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            ยกเลิก
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteFlight}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                กำลังลบ...
              </>
            ) : 'ยืนยันการลบ'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Export the component
export default AdminFlights;