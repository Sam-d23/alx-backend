import kue from 'kue';

const queue = kue.createQueue();

// Blacklisted phone numbers
const blacklistedNumbers = [
  '4153518780',
  '4153518781'
];

function sendNotification(phoneNumber, message, job, done) {
  // Start job progress
  job.progress(0, 100);

  // Check if phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    job.failed(error);
    done(error);
  } else {
    // Track job progress
    job.progress(50, 100);

    // Log the notification being sent
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    // Complete the job
    job.complete();
    done();
  }
}

// Process jobs with up to 2 concurrency
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Error handling
queue.on('error', (err) => {
  console.error(`Queue error: ${err.message}`);
});
