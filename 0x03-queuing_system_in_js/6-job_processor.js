import kue from 'kue';

const queue = kue.createQueue();
const queueName = 'push_notification_code';

function sendNotification(phoneNumber, message, done) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}

queue.process(queueName, 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, done);
});
