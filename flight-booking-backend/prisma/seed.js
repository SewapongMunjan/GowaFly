// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clean up existing data
  try {
    console.log('Cleaning up existing data...');
    await prisma.payment.deleteMany({});
    await prisma.passenger.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.flight.deleteMany({});
    await prisma.airport.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
  }

  // Create admin user
  console.log('Creating admin user...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      phone: '0987654321',
      passwordHash: adminPasswordHash,
      isAdmin: true
    }
  });
  console.log(`Admin user created with ID: ${admin.id}`);

  // Create regular users
  console.log('Creating regular users...');
  const users = [];
  const userData = [
    { fullName: 'John Doe', email: 'john@example.com', phone: '0812345678' },
    { fullName: 'Jane Smith', email: 'jane@example.com', phone: '0823456789' },
    { fullName: 'Bob Johnson', email: 'bob@example.com', phone: '0834567890' },
    { fullName: 'Alice Brown', email: 'alice@example.com', phone: '0845678901' },
    { fullName: 'Sam Wilson', email: 'sam@example.com', phone: '0856789012' }
  ];

  const userPasswordHash = await bcrypt.hash('password123', 10);

  for (const user of userData) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        passwordHash: userPasswordHash,
        isAdmin: false
      }
    });
    users.push(createdUser);
    console.log(`User created: ${createdUser.fullName}`);
  }

  // Create airports
  console.log('Creating airports...');
  const airports = [];
  const airportData = [
    { airportName: 'Suvarnabhumi Airport', airportCode: 'BKK', city: 'Bangkok', country: 'Thailand' },
    { airportName: 'Don Mueang International Airport', airportCode: 'DMK', city: 'Bangkok', country: 'Thailand' },
    { airportName: 'Chiang Mai International Airport', airportCode: 'CNX', city: 'Chiang Mai', country: 'Thailand' },
    { airportName: 'Phuket International Airport', airportCode: 'HKT', city: 'Phuket', country: 'Thailand' },
    { airportName: 'Changi Airport', airportCode: 'SIN', city: 'Singapore', country: 'Singapore' },
    { airportName: 'Hong Kong International Airport', airportCode: 'HKG', city: 'Hong Kong', country: 'Hong Kong' },
    { airportName: 'Narita International Airport', airportCode: 'NRT', city: 'Tokyo', country: 'Japan' },
    { airportName: 'Incheon International Airport', airportCode: 'ICN', city: 'Seoul', country: 'South Korea' },
    { airportName: 'Sydney Airport', airportCode: 'SYD', city: 'Sydney', country: 'Australia' },
    { airportName: 'Heathrow Airport', airportCode: 'LHR', city: 'London', country: 'United Kingdom' }
  ];

  for (const airport of airportData) {
    const createdAirport = await prisma.airport.create({
      data: airport
    });
    airports.push(createdAirport);
    console.log(`Airport created: ${createdAirport.airportName} (${createdAirport.airportCode})`);
  }

  // Create flights
  console.log('Creating flights...');
  const flights = [];
  const airlines = ['Thai Airways', 'Bangkok Airways', 'AirAsia', 'Singapore Airlines', 'Cathay Pacific', 'Japan Airlines'];
  
  // Function to generate a random date in the future
  const getRandomFutureDate = (daysAhead) => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
    return date;
  };
  
  // Function to generate a flight number
  const generateFlightNumber = (airline) => {
    const prefix = airline.split(' ')[0].substring(0, 2).toUpperCase();
    const number = Math.floor(100 + Math.random() * 900);
    return `${prefix}${number}`;
  };
  
  // Generate random flights between airports
  for (let i = 0; i < 30; i++) {
    // Pick random departure and arrival airports (making sure they're different)
    let depIdx = Math.floor(Math.random() * airports.length);
    let arrIdx;
    do {
      arrIdx = Math.floor(Math.random() * airports.length);
    } while (arrIdx === depIdx);
    
    const departureAirport = airports[depIdx];
    const arrivalAirport = airports[arrIdx];
    
    // Random airline
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    
    // Generate departure and arrival times
    const departureDate = getRandomFutureDate(30);
    
    // Flight duration between 1-12 hours
    const durationHours = 1 + Math.floor(Math.random() * 11);
    const arrivalDate = new Date(departureDate);
    arrivalDate.setHours(arrivalDate.getHours() + durationHours);
    
    // Random price between 1000-20000
    const price = 1000 + Math.floor(Math.random() * 19000);
    
    // Random seats between 100-300
    const availableSeats = 100 + Math.floor(Math.random() * 200);
    
    const flight = await prisma.flight.create({
      data: {
        airline,
        flightNumber: generateFlightNumber(airline),
        departureAirportId: departureAirport.id,
        arrivalAirportId: arrivalAirport.id,
        departureTime: departureDate,
        arrivalTime: arrivalDate,
        price,
        availableSeats
      }
    });
    
    flights.push(flight);
    console.log(`Flight created: ${flight.airline} ${flight.flightNumber} (${departureAirport.airportCode} to ${arrivalAirport.airportCode})`);
  }

  // Create bookings
  console.log('Creating bookings...');
  const statuses = ['Pending', 'Confirmed', 'Canceled', 'Completed'];
  
  // For each user, create 1-3 bookings
  for (const user of users) {
    const bookingCount = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < bookingCount; i++) {
      // Pick a random flight
      const flight = flights[Math.floor(Math.random() * flights.length)];
      
      // Random passenger count 1-4
      const passengerCount = 1 + Math.floor(Math.random() * 4);
      
      // Make sure flight has enough seats
      if (flight.availableSeats < passengerCount) {
        continue;
      }
      
      // Create booking
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const totalPrice = flight.price * passengerCount;
      
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          flightId: flight.id,
          bookingDate: new Date(),
          totalPrice,
          status
        }
      });
      
      console.log(`Booking created for ${user.fullName}: ${booking.id}`);
      
      // Create passengers for this booking
      const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Sam', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa'];
      const lastNames = ['Smith', 'Johnson', 'Brown', 'Wilson', 'Davis', 'Miller', 'Jones', 'Garcia', 'Rodriguez', 'Martinez'];
      
      for (let j = 0; j < passengerCount; j++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;
        
        // Generate a random date of birth (18-70 years old)
        const dob = new Date();
        dob.setFullYear(dob.getFullYear() - 18 - Math.floor(Math.random() * 52));
        
        // Generate random passport number
        const passportNumber = `P${Math.floor(10000000 + Math.random() * 90000000)}`;
        
        // Generate seat number (row 1-30, seat A-F)
        const seatRow = 1 + Math.floor(Math.random() * 30);
        const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
        const seatNumber = `${seatRow}${seatLetter}`;
        
        const passenger = await prisma.passenger.create({
          data: {
            bookingId: booking.id,
            fullName,
            passportNumber,
            dateOfBirth: dob,
            seatNumber
          }
        });
        
        console.log(`Passenger created: ${passenger.fullName}, Seat: ${passenger.seatNumber}`);
      }
      
      // Update available seats for the flight
      await prisma.flight.update({
        where: { id: flight.id },
        data: { availableSeats: flight.availableSeats - passengerCount }
      });
      
      // If status is Confirmed or Completed, create a payment
      if (status === 'Confirmed' || status === 'Completed') {
        const paymentMethods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Prompt Pay'];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const paymentStatus = status === 'Confirmed' ? 'Completed' : 'Completed';
        
        const payment = await prisma.payment.create({
          data: {
            bookingId: booking.id,
            paymentMethod,
            paymentStatus,
            transactionDate: new Date(),
            amount: totalPrice
          }
        });
        
        console.log(`Payment created: ${payment.id}, Method: ${payment.paymentMethod}, Amount: ${payment.amount}`);
      }
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });