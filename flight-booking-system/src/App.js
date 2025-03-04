// In your src/App.js file
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
import PromotionsPage from './pages/PromotionsPage'; // Add this import
import HelpPage from './pages/HelpPage'; // Add this import
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/flight/:id" element={<FlightDetails />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/promotions" element={<PromotionsPage />} /> {/* Add this route */}
              <Route path="/help" element={<HelpPage />} /> {/* Add this route */}
              
              {/* Protected routes - require authentication */}
              <Route path="/booking/:flightId" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/payment/:bookingId" element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="/confirmation/:bookingId" element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/manage-booking" element={
                <ProtectedRoute>
                  <ManageBooking />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;