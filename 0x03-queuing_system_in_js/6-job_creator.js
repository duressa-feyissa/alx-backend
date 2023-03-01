const kue = require('kue');

const queue = kue.createQueue();

const data = {
  phoneNumber: '4153518780',
  message: 'This is the code to verify your account',
};

const queueName = 'push_notification_code';

const job = queue.create(queueName, data).save();

job.on('enqueue', () =>  console.log(`Notification job created: ${job.id}`))
  .on('complete', () => console.log('Notification job completed'))
  .on('failed', () => console.log('Notification job failed'));
