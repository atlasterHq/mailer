const kue = require('kue'),
  queue   = kue.createQueue();

module.exports = (context,priority,attempts)=>{
  return new Promise((fullfill,reject)=>{
    queue.create('email',context)
      .priority(priority)
      .attempts(attempts)
      .backoff({type: 'exponential'})
      .save()
      .then(fullfill)
      .catch(reject);
  });
};
