// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Aviationstack API configuration
const AVIATION_API_KEY = 'e4bdca070c1658c0e67744f3b447fad4';
const AVIATION_API_BASE = 'http://api.aviationstack.com/v1';

async function fetchAviationData() {
  const flightApi = axios.create({
    baseURL: AVIATION_API_BASE,
    params: { access_key: AVIATION_API_KEY }
  });

  try {
    // Fetch flights
    const flightsResponse = await flightApi.get('/flights', {
      params: { limit: 100 } // Adjust limit as needed
    });

    return flightsResponse.data.data;
  } catch (error) {
    console.error('Error fetching aviation data:', error);
    return [];
  }
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Clean up existing data
    await prisma.payment.deleteMany();
    await prisma.passenger.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.airline.deleteMany();
    await prisma.airport.deleteMany();
    await prisma.user.deleteMany();

    // Fetch flight data from Aviationstack
    const flightData = await fetchAviationData();

    // Create airports
    const airportMap = new Map();
    const uniqueAirports = new Set();

    flightData.forEach(flight => {
      uniqueAirports.add(JSON.stringify({
        airportCode: flight.departure.iata || 'UNKNOWN',
        airportName: flight.departure.airport || 'Unknown Airport',
        city: flight.departure.city || 'Unknown City',
        country: flight.departure.country || 'Unknown Country'
      }));
      uniqueAirports.add(JSON.stringify({
        airportCode: flight.arrival.iata || 'UNKNOWN',
        airportName: flight.arrival.airport || 'Unknown Airport',
        city: flight.arrival.city || 'Unknown City',
        country: flight.arrival.country || 'Unknown Country'
      }));
    });

    for (const airportJson of uniqueAirports) {
      const airport = JSON.parse(airportJson);
      const createdAirport = await prisma.airport.create({
        data: {
          airportCode: airport.airportCode,
          airportName: airport.airportName,
          city: airport.city,
          country: airport.country
        }
      });
      airportMap.set(airport.airportCode, createdAirport);
    }

    // Create airlines
    const airlineMap = new Map();
    const uniqueAirlines = new Set();

    flightData.forEach(flight => {
      uniqueAirlines.add(JSON.stringify({
        iataCode: flight.airline.iata || 'UNKNOWN',
        name: flight.airline.name || 'Unknown Airline',
        icaoCode: flight.airline.icao || null
      }));
    });

    for (const airlineJson of uniqueAirlines) {
      const airline = JSON.parse(airlineJson);
      const createdAirline = await prisma.airline.create({
        data: {
          iataCode: airline.iataCode,
          name: airline.name,
          icaoCode: airline.icaoCode
        }
      });
      airlineMap.set(airline.iataCode, createdAirline);
    }

    // Create flights
    const flightEntries = [];
    for (const flight of flightData) {
      try {
        const departureAirport = airportMap.get(flight.departure.iata || 'UNKNOWN');
        const arrivalAirport = airportMap.get(flight.arrival.iata || 'UNKNOWN');
        const airline = airlineMap.get(flight.airline.iata || 'UNKNOWN');

        if (!departureAirport || !arrivalAirport || !airline) continue;

        const flightEntry = await prisma.flight.create({
          data: {
            flightIata: flight.flight.iata || 'UNKNOWN',
            flightIcao: flight.flight.icao || null,
            departureAirportId: departureAirport.id,
            arrivalAirportId: arrivalAirport.id,
            airlineId: airline.id,
            departureTime: new Date(flight.departure.scheduled),
            arrivalTime: new Date(flight.arrival.scheduled),
            departureTerminal: flight.departure.terminal || null,
            arrivalTerminal: flight.arrival.terminal || null,
            status: flight.flight.status || 'scheduled',
            price: (1000 + Math.random() * 9000).toFixed(2), // Random pricing
            availableSeats: Math.floor(50 + Math.random() * 200) // Random seat availability
          }
        });

        flightEntries.push(flightEntry);
      } catch (flightError) {
        console.error('Error creating flight:', flightError);
      }
    }

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        fullName: 'Admin User',
        email: 'admin@example.com',
        phone: '0987654321',
        passwordHash: adminPasswordHash,
        isAdmin: true
      }
    });

    console.log('Database seeding completed successfully!');
    console.log(`Seeded ${airportMap.size} airports`);
    console.log(`Seeded ${airlineMap.size} airlines`);
    console.log(`Seeded ${flightEntries.length} flights`);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });