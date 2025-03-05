// src/pages/admin/AdminAirports.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import { adminService } from '../../services/api';

const AdminAirports = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    airportName: '',
    airportCode: '',
    city: '',
    country: ''
  });
  const [selectedAirportId, setSelectedAirportId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Fetch airports from API
  useEffect(() => {
    fetchAirports();
  }, []);
  
  const fetchAirports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllAirports();
      setAirports(response.data);
    } catch (err) {
      console.error('Error fetching airports:', err);
      setError('ไม่สามารถโหลดข้อมูลสนามบินได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    if (!formData.airportName.trim()) {
      errors.airportName = 'กรุณากรอกชื่อสนามบิน';
    }
    
    if (!formData.airportCode.trim()) {
      errors.airportCode = 'กรุณากรอกรหัสสนามบิน';
    } else if (!/^[A-Z]{3}$/.test(formData.airportCode)) {
      errors.airportCode = 'รหัสสนามบินต้องเป็นตัวอักษรภาษาอังกฤษตัวพิมพ์ใหญ่ 3 ตัว';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'กรุณากรอกชื่อเมือง';
    }
    
    if (!formData.country.trim()) {
      errors.country = 'กรุณากรอกชื่อประเทศ';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle add airport
  const handleAddAirport = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await adminService.createAirport(formData);
      await fetchAirports();
      setShowAddModal(false);
      setFormData({
        airportName: '',
        airportCode: '',
        city: '',
        country: ''
      });
      setSuccessMessage('เพิ่มสนามบินเรียบร้อยแล้ว');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding airport:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มสนามบิน'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle edit airport
  const handleEditAirport = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await adminService.updateAirport(selectedAirportId, formData);
      await fetchAirports();
      setShowEditModal(false);
      setSuccessMessage('อัปเดตข้อมูลสนามบินเรียบร้อยแล้ว');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating airport:', err);
      setFormErrors({
        ...formErrors,
        submit: err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสนามบิน'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle delete airport
  const handleDeleteAirport = async () => {
    try {
      setSubmitting(true);
      await adminService.deleteAirport(selectedAirportId);
      await fetchAirports();
      setShowDeleteModal(false);
      setSuccessMessage('ลบสนามบินเรียบร้อยแล้ว');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting airport:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบสนามบิน');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Open edit modal and populate form
  const openEditModal = (airport) => {
    setSelectedAirportId(airport.id);
    setFormData({
      airportName: airport.airportName,
      airportCode: airport.airportCode,
      city: airport.city,
      country: airport.country
    });
    setFormErrors({});
    setShowEditModal(true);
  };
  
  // Open delete modal
  const openDeleteModal = (airportId) => {
    setSelectedAirportId(airportId);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลสนามบิน...</p>
      </div>
    );
  }

  return (
    <div className="admin-airports">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title mb-0">จัดการสนามบิน</h2>
        <Button variant="primary" onClick={() => {
          setFormData({
            airportName: '',
            airportCode: '',
            city: '',
            country: ''
          });
          setFormErrors({});
          setShowAddModal(true);
        }}>
          <i className="fas fa-plus me-2"></i>
          เพิ่มสนามบิน
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
                <th>รหัสสนามบิน</th>
                <th>ชื่อสนามบิน</th>
                <th>เมือง</th>
                <th>ประเทศ</th>
                <th>การใช้งาน</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {airports.map(airport => (
                <tr key={airport.id}>
                  <td>{airport.airportCode}</td>
                  <td>{airport.airportName}</td>
                  <td>{airport.city}</td>
                  <td>{airport.country}</td>
                  <td>
                    <span className="badge bg-primary me-1">
                      {airport.departureFlights ? airport.departureFlights.length : 0} ต้นทาง
                    </span>
                    <span className="badge bg-info">
                      {airport.arrivalFlights ? airport.arrivalFlights.length : 0} ปลายทาง
                    </span>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2" 
                      onClick={() => openEditModal(airport)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => openDeleteModal(airport.id)}
                      disabled={
                        (airport.departureFlights && airport.departureFlights.length > 0) || 
                        (airport.arrivalFlights && airport.arrivalFlights.length > 0)
                      }
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </td>
                </tr>
              ))}
              {airports.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">ไม่พบข้อมูลสนามบิน</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* Add Airport Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มสนามบิน</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAirport}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger" className="mb-3">
                {formErrors.submit}
              </Alert>
            )}
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อสนามบิน</Form.Label>
                  <Form.Control
                    type="text"
                    name="airportName"
                    value={formData.airportName}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.airportName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.airportName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสสนามบิน (IATA)</Form.Label>
                  <Form.Control
                    type="text"
                    name="airportCode"
                    value={formData.airportCode}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.airportCode}
                    placeholder="เช่น BKK, DMK"
                    maxLength={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.airportCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>เมือง</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ประเทศ</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.country}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.country}
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
      
      {/* Edit Airport Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลสนามบิน</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditAirport}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger" className="mb-3">
                {formErrors.submit}
              </Alert>
            )}
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ชื่อสนามบิน</Form.Label>
                  <Form.Control
                    type="text"
                    name="airportName"
                    value={formData.airportName}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.airportName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.airportName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>รหัสสนามบิน (IATA)</Form.Label>
                  <Form.Control
                    type="text"
                    name="airportCode"
                    value={formData.airportCode}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.airportCode}
                    placeholder="เช่น BKK, DMK"
                    maxLength={3}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.airportCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>เมือง</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>ประเทศ</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.country}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.country}
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
      
      {/* Delete Airport Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          คุณต้องการลบสนามบินนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถเรียกคืนได้
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            ยกเลิก
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAirport}
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

export default AdminAirports;