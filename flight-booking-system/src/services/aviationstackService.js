// src/services/aviationstackService.js
import axios from 'axios';

const AVIATION_STACK_API_KEY = 'e4bdca070c1658c0e67744f3b447fad4';
const AVIATION_STACK_BASE_URL = 'https://api.aviationstack.com/v1';

// Create axios instance for Aviation Stack API
const aviationStackApi = axios.create({
  baseURL: AVIATION_STACK_BASE_URL,
  params: {
    access_key: AVIATION_STACK_API_KEY
  }
});

// Transform Aviation Stack flight data to match our application format
const transformFlightData = (flightData) => {
  return {
    id: `${flightData.flight.iata || flightData.flight.icao || 'FL'}${flightData.flight.number || Math.floor(Math.random() * 1000)}`,
    airline: flightData.airline.name || 'Unknown Airline',
    airlineCode: flightData.airline.iata || flightData.airline.icao || 'XX',
    flightNumber: `${flightData.flight.iata || flightData.flight.icao || 'FL'}${flightData.flight.number || ''}`,
    from: flightData.departure.airport || 'Unknown',
    to: flightData.arrival.airport || 'Unknown',
    departureTime: flightData.departure.scheduled || new Date().toISOString(),
    arrivalTime: flightData.arrival.scheduled || new Date().toISOString(),
    departureAirport: {
      id: flightData.departure.iata || flightData.departure.icao || 'DEP',
      airportName: flightData.departure.airport || 'Departure Airport',
      airportCode: flightData.departure.iata || flightData.departure.icao || 'DEP',
      city: flightData.departure.airport || 'Departure City',
      country: 'Unknown'
    },
    arrivalAirport: {
      id: flightData.arrival.iata || flightData.arrival.icao || 'ARR',
      airportName: flightData.arrival.airport || 'Arrival Airport',
      airportCode: flightData.arrival.iata || flightData.arrival.icao || 'ARR',
      city: flightData.arrival.airport || 'Arrival City',
      country: 'Unknown'
    },
    duration: calculateDuration(flightData.departure.scheduled, flightData.arrival.scheduled),
    status: flightData.flight_status || 'scheduled',
    // Generate a random price between 1000-10000
    price: Math.floor(Math.random() * 9000) + 1000,
    // Random number of available seats
    availableSeats: Math.floor(Math.random() * 100) + 20,
    stops: 0, // Default to direct flight
  };
};

// Calculate flight duration
const calculateDuration = (departureTime, arrivalTime) => {
  if (!departureTime || !arrivalTime) return '2h 30m'; // Default duration

  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  
  // Calculate difference in milliseconds
  const diff = arrival - departure;
  
  // Convert to hours and minutes
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

// Format datetime for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format time for display (HH:MM)
const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Aviation Stack API service
export const aviationStackService = {
  // Get all flights
  getAllFlights: async () => {
    try {
      const response = await aviationStackApi.get('/flights');
      
      if (response.data && response.data.data) {
        return {
          data: response.data.data.map(flight => transformFlightData(flight))
        };
      }
      
      return { data: [] };
    } catch (error) {
      console.error('Error fetching flights from Aviation Stack:', error);
      throw error;
    }
  },
  
  // Search flights
  searchFlights: async (params) => {
    try {
      // Build query parameters for Aviation Stack API
      const queryParams = {};
      
      if (params.departure) {
        queryParams.dep_iata = params.departure;
      }
      
      if (params.arrival) {
        queryParams.arr_iata = params.arrival;
      }
      
      if (params.date) {
        // Format date as YYYY-MM-DD
        const date = new Date(params.date);
        queryParams.flight_date = date.toISOString().split('T')[0];
      }
      
      // Make API request
      const response = await aviationStackApi.get('/flights', {
        params: queryParams
      });
      
      if (response.data && response.data.data) {
        return {
          data: response.data.data.map(flight => transformFlightData(flight))
        };
      }
      
      return { data: [] };
    } catch (error) {
      console.error('Error searching flights from Aviation Stack:', error);
      throw error;
    }
  },
  
  // Get flight by ID
  getFlightById: async (id) => {
    try {
      // For Aviation Stack, we need to parse the ID to get flight number and airline code
      let airlineCode = '';
      let flightNumber = '';
      
      // Try to extract airline code and flight number from the ID
      // Assuming format like "AA123"
      const match = id.match(/([A-Z]+)(\d+)/);
      if (match) {
        airlineCode = match[1];
        flightNumber = match[2];
      }
      
      // Query params for the specific flight
      const params = {};
      if (airlineCode) {
        params.airline_iata = airlineCode;
      }
      if (flightNumber) {
        params.flight_number = flightNumber;
      }
      
      const response = await aviationStackApi.get('/flights', {
        params: params
      });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        // Return the first matching flight
        return {
          data: transformFlightData(response.data.data[0])
        };
      }
      
      // If no flight found with the exact ID, fetch all flights and find the one with matching ID
      const allFlightsResponse = await aviationStackApi.get('/flights');
      
      if (allFlightsResponse.data && allFlightsResponse.data.data) {
        const allFlights = allFlightsResponse.data.data.map(flight => transformFlightData(flight));
        const matchingFlight = allFlights.find(flight => flight.id === id);
        
        if (matchingFlight) {
          return { data: matchingFlight };
        }
      }
      
      // If still not found, generate a mock flight with the given ID
      return {
        data: {
          id: id,
          airline: 'Sample Airline',
          airlineCode: airlineCode || 'SA',
          flightNumber: id,
          from: 'Bangkok (BKK)',
          to: 'Chiang Mai (CNX)',
          departureTime: new Date().toISOString(),
          arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          departureAirport: {
            id: 'BKK',
            airportName: 'Suvarnabhumi Airport',
            airportCode: 'BKK',
            city: 'Bangkok',
            country: 'Thailand'
          },
          arrivalAirport: {
            id: 'CNX',
            airportName: 'Chiang Mai International Airport',
            airportCode: 'CNX',
            city: 'Chiang Mai',
            country: 'Thailand'
          },
          duration: '2h 0m',
          status: 'scheduled',
          price: 1990,
          availableSeats: 42,
          stops: 0
        }
      };
    } catch (error) {
      console.error('Error fetching flight by ID from Aviation Stack:', error);
      throw error;
    }
  }
};

export default aviationStackService;