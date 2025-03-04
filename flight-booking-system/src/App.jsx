import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// นำเข้าคอมโพเนนต์
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

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/flight/:id" element={<FlightDetails />} />
            <Route path="/booking/:flightId" element={<Booking />} />
            <Route path="/payment/:bookingId" element={<Payment />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/manage-booking" element={<ManageBooking />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;