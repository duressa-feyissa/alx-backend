function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) throw new Error('Jobs is not an array');
  jobs.forEach((job) => {
    const newJob = queue.create('push_notification_code_3', job);
    newJob.on('complete', () => console.log(`Notification job ${newJob.id} completed`))
      .on('failed', (err) => console.log(`Notification job ${newJob.id} failed: ${err}`))
      .on('progress', (progress) => console.log(`Notification job ${newJob.id} ${progress}% complete`));
    newJob.save((error) => {
      if (!error) console.log(`Notification job created: ${newJob.id}`);
    });
  });
}

module.exports = createPushNotificationsJobs;
