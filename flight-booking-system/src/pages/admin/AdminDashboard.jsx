// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { adminService } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">กำลังโหลด...</span>
        </div>
        <p className="mt-3">กำลังโหลดข้อมูลแดชบอร์ด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </Alert>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="admin-page-title mb-4">แดชบอร์ด</h2>
      
      {/* Stats cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="stat-icon mb-2">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="stat-count">{stats?.userCount || 0}</h3>
              <div className="stat-label">ผู้ใช้ทั้งหมด</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="stat-icon mb-2">
                <i className="fas fa-plane"></i>
              </div>
              <h3 className="stat-count">{stats?.flightCount || 0}</h3>
              <div className="stat-label">เที่ยวบินทั้งหมด</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="stat-icon mb-2">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <h3 className="stat-count">{stats?.bookingCount || 0}</h3>
              <div className="stat-label">การจองทั้งหมด</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body className="text-center">
              <div className="stat-icon mb-2">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="stat-count">฿{stats?.totalRevenue.toLocaleString() || 0}</h3>
              <div className="stat-label">รายได้ทั้งหมด</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Charts */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>รายได้รายสัปดาห์</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stats?.weeklyBookings || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`฿${value.toLocaleString()}`, 'รายได้']}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' });
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="รายได้" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>การจองตามสถานะ</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={(stats?.bookingsByStatus || []).map(item => ({
                    status: item.status === 'Confirmed' ? 'ยืนยันแล้ว' :
                            item.status === 'Pending' ? 'รอดำเนินการ' :
                            item.status === 'Canceled' ? 'ยกเลิก' :
                            item.status === 'Completed' ? 'เสร็จสิ้น' : 
                            item.status === 'Refunded' ? 'คืนเงินแล้ว' : item.status,
                    count: item._count.id
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'จำนวน']} />
                  <Bar dataKey="count" fill="#82ca9d" name="จำนวนการจอง" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent bookings */}
      <Card>
        <Card.Header>การจองล่าสุด</Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>รหัสการจอง</th>
                <th>ผู้จอง</th>
                <th>เที่ยวบิน</th>
                <th>วันที่จอง</th>
                <th>ราคา</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentBookings || []).map(booking => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.user.fullName}</td>
                  <td>
                    {booking.flight.departureAirport.airportCode} - {booking.flight.arrivalAirport.airportCode}
                  </td>
                  <td>
                    {new Date(booking.bookingDate).toLocaleDateString('th-TH')}
                  </td>
                  <td>฿{booking.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status === 'Confirmed' ? 'ยืนยันแล้ว' :
                       booking.status === 'Pending' ? 'รอดำเนินการ' :
                       booking.status === 'Canceled' ? 'ยกเลิก' :
                       booking.status === 'Completed' ? 'เสร็จสิ้น' : 
                       booking.status === 'Refunded' ? 'คืนเงินแล้ว' : booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats?.recentBookings?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">ไม่มีการจองล่าสุด</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;