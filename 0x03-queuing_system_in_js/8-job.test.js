import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

// Create a queue with test mode enabled
const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
  before(() => {
    // Enable test mode before running the tests
    queue.testMode.enter();
  });

  after(() => {
    // Clear the queue and exit test mode after tests are complete
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    try {
      createPushNotificationsJobs({}, queue);
    } catch (error) {
      expect(error.message).to.equal('Jobs is not an array');
    }
  });

  it('should create jobs and add them to the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    // Validate that jobs are inside the queue
    const job1 = queue.testMode.jobs[0];
    const job2 = queue.testMode.jobs[1];

    expect(job1).to.exist;
    expect(job1.data).to.deep.equal(jobs[0]);
    expect(job2).to.exist;
    expect(job2.data).to.deep.equal(jobs[1]);

    expect(queue.testMode.jobs.length).to.equal(2);
  });

  // Additional tests can be added here
});
