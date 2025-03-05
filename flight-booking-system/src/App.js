// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import FlightDetails from './pages/FlightDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import UserProfile from './pages/UserProfile';
import ManageBooking from './pages/ManageBooking';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PromotionsPage from './pages/PromotionsPage';
import HelpPage from './pages/HelpPage';
import ProtectedRoute from './components/ProtectedRoute';

// Import admin components
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFlights from './pages/admin/AdminFlights';
import AdminBookings from './pages/admin/AdminBookings';
import AdminAirports from './pages/admin/AdminAirports';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Admin Routes with AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute admin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="flights" element={<AdminFlights />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="airports" element={<AdminAirports />} />
            </Route>
            
            {/* Public Routes with Header and Footer */}
            <Route path="/" element={
              <>
                <Header />
                <main className="main-content">
                  <HomePage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/search" element={
              <>
                <Header />
                <main className="main-content">
                  <SearchResults />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/flight/:id" element={
              <>
                <Header />
                <main className="main-content">
                  <FlightDetails />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/login" element={
              <>
                <Header />
                <main className="main-content">
                  <LoginPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/register" element={
              <>
                <Header />
                <main className="main-content">
                  <RegisterPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/promotions" element={
              <>
                <Header />
                <main className="main-content">
                  <PromotionsPage />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/help" element={
              <>
                <Header />
                <main className="main-content">
                  <HelpPage />
                </main>
                <Footer />
              </>
            } />
            
            {/* Protected Routes with Header and Footer */}
            <Route path="/booking/:flightId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <main className="main-content">
                    <Booking />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/payment/:bookingId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <main className="main-content">
                    <Payment />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/confirmation/:bookingId" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <main className="main-content">
                    <Confirmation />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <main className="main-content">
                    <UserProfile />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/manage-booking" element={
              <ProtectedRoute>
                <>
                  <Header />
                  <main className="main-content">
                    <ManageBooking />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;