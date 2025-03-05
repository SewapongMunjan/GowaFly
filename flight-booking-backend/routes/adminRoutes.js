// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const adminController = require('../controllers/adminController');

// Apply both authentication and admin middleware to all routes
router.use(auth);
router.use(adminMiddleware);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Flight management routes
router.get('/flights', adminController.getAllFlights);
router.post('/flights', adminController.createFlight);
router.put('/flights/:id', adminController.updateFlight);
router.delete('/flights/:id', adminController.deleteFlight);

// Airport management
router.get('/airports', adminController.getAllAirports);
router.post('/airports', adminController.createAirport);
router.put('/airports/:id', adminController.updateAirport);
router.delete('/airports/:id', adminController.deleteAirport);

// Booking management routes
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.put('/bookings/:id/status', adminController.updateBookingStatus);

module.exports = router;