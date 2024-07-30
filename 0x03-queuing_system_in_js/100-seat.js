import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

// Create a Redis client
const client = redis.createClient();
const setAvailableSeats = promisify(client.set).bind(client);
const getAvailableSeats = promisify(client.get).bind(client);

// Initialize Kue queue
const queue = kue.createQueue();

// Initialize reservation status
let reservationEnabled = true;

// Express server setup
const app = express();
const PORT = 1245;

// Set initial number of available seats
const initialSeats = 50;
await setAvailableSeats('available_seats', initialSeats);

// Helper function to reserve seats
const reserveSeat = async (number) => {
  await setAvailableSeats('available_seats', number);
};

// Helper function to get current available seats
const getCurrentAvailableSeats = async () => {
  const seats = await getAvailableSeats('available_seats');
  return seats ? parseInt(seats, 10) : 0;
};

// Route to get available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// Route to process the queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      let availableSeats = await getCurrentAvailableSeats();
      if (availableSeats <= 0) {
        reservationEnabled = false;
        done(new Error('Not enough seats available'));
        return;
      }

      await reserveSeat(availableSeats - 1);
      done();
    } catch (err) {
      done(err);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
