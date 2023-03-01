const createPushNotificationsJobs = require('./8-job');
const kue = require('kue');

const queue = kue.createQueue();
const { expect } = require('chai');

describe('createPushNotificationsJobs', () => {
  before(() => queue.testMode.enter());
  afterEach(() => queue.testMode.clear());
  after(() => queue.testMode.exit());
  
  it('Should create a new job', () => {
    const jobs = [
     {
       phoneNumber: '2322221211',
       message: 'This is the code 432 to verify your account',
     }
    ]
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs.length).to.equal(1);
    expect(queue.testMode.jobs[0].data).to.deep.equal({
      phoneNumber: '2322221211',
      message: 'This is the code 432 to verify your account',
    });
  });
  
  it('Should fail if queue is not an array', () => {
    const job = {phoneNumber: '2221212', message: '1234 is your verififcation code'}
    expect(() => createPushNotificationsJobs(job, queue)).to.throw(Error, 'Jobs is not an array');
  });
});
