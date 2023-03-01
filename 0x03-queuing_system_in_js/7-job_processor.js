import kue from 'kue';

const blacklisted = ['4153518780', '4153518781'];

const queue = kue.createQueue();
const queueName = 'push_notification_code_2';

function sendNotification(phoneNumber, message, job, done) {
  const end_progress = 100;
  
  job.progress(0, end_progress);
  
  if (blacklisted.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  job.progress(50, end_progress);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}
queue.process(queueName, 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
