// controllers/adminController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Count total users
    const userCount = await prisma.user.count();
    
    // Count total flights
    const flightCount = await prisma.flight.count();
    
    // Count total bookings
    const bookingCount = await prisma.booking.count();
    
    // Sum of all completed bookings' value
    const totalRevenue = await prisma.booking.aggregate({
      where: {
        status: 'Confirmed'
      },
      _sum: {
        totalPrice: true
      }
    });
    
    // Count bookings by status
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    
    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        bookingDate: 'desc'
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        },
        flight: {
          include: {
            departureAirport: true,
            arrivalAirport: true
          }
        }
      }
    });
    
    // Get weekly booking stats (simplified for MySQL)
    const now = new Date();
    const fourWeeksAgo = new Date(now.setDate(now.getDate() - 28));
    
    // Weekly data (simplified approach)
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: fourWeeksAgo
        }
      },
      select: {
        bookingDate: true,
        totalPrice: true,
      }
    });
    
    // Format the data into weekly groups
    const weeklyData = [];
    const weekMap = new Map();
    
    bookings.forEach(booking => {
      const date = new Date(booking.bookingDate);
      // Get the week start date (Sunday)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { 
          week: weekStart.toISOString(), 
          count: 0, 
          revenue: 0 
        });
      }
      
      const week = weekMap.get(weekKey);
      week.count += 1;
      week.revenue += Number(booking.totalPrice);
      weekMap.set(weekKey, week);
    });
    
    const weeklyBookings = Array.from(weekMap.values())
      .sort((a, b) => new Date(a.week) - new Date(b.week));
    
    res.json({
      userCount,
      flightCount,
      bookingCount,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      bookingsByStatus,
      recentBookings,
      weeklyBookings
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isAdmin: true,
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isAdmin: true,
        bookings: {
          include: {
            flight: {
              include: {
                departureAirport: true,
                arrivalAirport: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, isAdmin } = req.body;
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        isAdmin: !!isAdmin
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isAdmin: true
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, password, isAdmin } = req.body;
    
    // Check if email already exists for another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: parseInt(id) }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }
    
    // Prepare update data
    const updateData = {
      fullName,
      email,
      phone,
      isAdmin: isAdmin === true || isAdmin === 'true' ? true : false
    };
    
    // Add password hash if password is provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isAdmin: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user has bookings
    const userWithBookings = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });
    
    if (!userWithBookings) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (userWithBookings._count.bookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing bookings. Please delete or reassign bookings first.' 
      });
    }
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Flight Management
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        departureAirport: true,
        arrivalAirport: true,
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });
    
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Failed to fetch flights' });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const { 
      airline, 
      flightNumber, 
      departureAirportId, 
      arrivalAirportId, 
      departureTime, 
      arrivalTime, 
      price, 
      availableSeats 
    } = req.body;
    
    // Validate input
    if (!airline || !flightNumber || !departureAirportId || !arrivalAirportId || 
        !departureTime || !arrivalTime || !price || !availableSeats) {
      return res.status(400).json({ message: 'All flight details are required' });
    }
    
    // Check if airports exist
    const departureAirport = await prisma.airport.findUnique({
      where: { id: parseInt(departureAirportId) }
    });
    
    const arrivalAirport = await prisma.airport.findUnique({
      where: { id: parseInt(arrivalAirportId) }
    });
    
    if (!departureAirport || !arrivalAirport) {
      return res.status(400).json({ message: 'Invalid airport ID(s)' });
    }
    
    // Create flight
    const flight = await prisma.flight.create({
      data: {
        airline,
        flightNumber,
        departureAirportId: parseInt(departureAirportId),
        arrivalAirportId: parseInt(arrivalAirportId),
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price: parseFloat(price),
        availableSeats: parseInt(availableSeats)
      },
      include: {
        departureAirport: true,
        arrivalAirport: true
      }
    });
    
    res.status(201).json(flight);
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ message: 'Failed to create flight' });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      airline, 
      flightNumber, 
      departureAirportId, 
      arrivalAirportId, 
      departureTime, 
      arrivalTime, 
      price, 
      availableSeats 
    } = req.body;
    
    // Validate input
    if (!airline || !flightNumber || !departureAirportId || !arrivalAirportId || 
        !departureTime || !arrivalTime || !price || availableSeats === undefined) {
      return res.status(400).json({ message: 'All flight details are required' });
    }
    
    // Check if flight exists
    const existingFlight = await prisma.flight.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    // Update flight
    const updatedFlight = await prisma.flight.update({
      where: { id: parseInt(id) },
      data: {
        airline,
        flightNumber,
        departureAirportId: parseInt(departureAirportId),
        arrivalAirportId: parseInt(arrivalAirportId),
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        price: parseFloat(price),
        availableSeats: parseInt(availableSeats)
      },
      include: {
        departureAirport: true,
        arrivalAirport: true
      }
    });
    
    res.json(updatedFlight);
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ message: 'Failed to update flight' });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if flight has bookings
    const flightWithBookings = await prisma.flight.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });
    
    if (!flightWithBookings) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    if (flightWithBookings._count.bookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete flight with existing bookings. Please delete bookings first or mark flight as inactive.' 
      });
    }
    
    await prisma.flight.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({ message: 'Failed to delete flight' });
  }
};

// Airport Management
exports.getAllAirports = async (req, res) => {
  try {
    const airports = await prisma.airport.findMany({
      include: {
        _count: {
          select: {
            departureFlights: true,
            arrivalFlights: true
          }
        }
      }
    });
    
    // Transform the data to include counts (for compatibility with the front-end)
    const formattedAirports = airports.map(airport => ({
      ...airport,
      departureFlights: Array(airport._count.departureFlights),
      arrivalFlights: Array(airport._count.arrivalFlights)
    }));
    
    res.json(formattedAirports);
  } catch (error) {
    console.error('Error fetching airports:', error);
    res.status(500).json({ message: 'Failed to fetch airports' });
  }
};

exports.createAirport = async (req, res) => {
  try {
    const { airportName, airportCode, city, country } = req.body;
    
    // Validate input
    if (!airportName || !airportCode || !city || !country) {
      return res.status(400).json({ message: 'All airport details are required' });
    }
    
    // Check if airport code already exists
    const existingAirport = await prisma.airport.findUnique({
      where: { airportCode }
    });
    
    if (existingAirport) {
      return res.status(400).json({ message: 'Airport with this code already exists' });
    }
    
    // Create airport
    const airport = await prisma.airport.create({
      data: {
        airportName,
        airportCode,
        city,
        country
      }
    });
    
    res.status(201).json(airport);
  } catch (error) {
    console.error('Error creating airport:', error);
    res.status(500).json({ message: 'Failed to create airport' });
  }
};

exports.updateAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const { airportName, airportCode, city, country } = req.body;
    
    // Validate input
    if (!airportName || !airportCode || !city || !country) {
      return res.status(400).json({ message: 'All airport details are required' });
    }
    
    // Check if airport exists
    const existingAirport = await prisma.airport.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingAirport) {
      return res.status(404).json({ message: 'Airport not found' });
    }
    
    // Check if airport code is already used by another airport
    if (airportCode !== existingAirport.airportCode) {
      const airportWithCode = await prisma.airport.findUnique({
        where: { airportCode }
      });
      
      if (airportWithCode) {
        return res.status(400).json({ message: 'Airport with this code already exists' });
      }
    }
    
    // Update airport
    const updatedAirport = await prisma.airport.update({
      where: { id: parseInt(id) },
      data: {
        airportName,
        airportCode,
        city,
        country
      }
    });
    
    res.json(updatedAirport);
  } catch (error) {
    console.error('Error updating airport:', error);
    res.status(500).json({ message: 'Failed to update airport' });
  }
};

exports.deleteAirport = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if airport is used in any flights
    const departureFlights = await prisma.flight.findMany({
      where: { departureAirportId: parseInt(id) }
    });
    
    const arrivalFlights = await prisma.flight.findMany({
      where: { arrivalAirportId: parseInt(id) }
    });
    
    if (departureFlights.length > 0 || arrivalFlights.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete airport that is used in flights. Delete associated flights first.' 
      });
    }
    
    // Delete airport
    await prisma.airport.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Airport deleted successfully' });
  } catch (error) {
    console.error('Error deleting airport:', error);
    res.status(500).json({ message: 'Failed to delete airport' });
  }
};

// Booking Management
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        flight: {
          include: {
            departureAirport: true,
            arrivalAirport: true
          }
        },
        passengers: true,
        payments: true
      },
      orderBy: {
        bookingDate: 'desc'
      }
    });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        flight: {
          include: {
            departureAirport: true,
            arrivalAirport: true
          }
        },
        passengers: true,
        payments: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking details' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Canceled', 'Completed', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }
    
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        flight: true,
        passengers: true
      }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Use a transaction to update booking status and handle seat availability
    const result = await prisma.$transaction(async (prisma) => {
      // Update booking status
      const updatedBooking = await prisma.booking.update({
        where: { id: parseInt(id) },
        data: { status }
      });
      
      // If status is changed to Canceled or Refunded, add seats back to availability
      if ((status === 'Canceled' || status === 'Refunded') && 
          booking.status !== 'Canceled' && booking.status !== 'Refunded') {
        await prisma.flight.update({
          where: { id: booking.flightId },
          data: {
            availableSeats: booking.flight.availableSeats + booking.passengers.length
          }
        });
      }
      
      // If status is changed from Canceled/Refunded to anything else, reduce available seats
      if (status !== 'Canceled' && status !== 'Refunded' && 
          (booking.status === 'Canceled' || booking.status === 'Refunded')) {
        await prisma.flight.update({
          where: { id: booking.flightId },
          data: {
            availableSeats: Math.max(0, booking.flight.availableSeats - booking.passengers.length)
          }
        });
      }
      
      return updatedBooking;
    });
    
    res.json({ message: `Booking status updated to ${status}` });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};