var kue = require('kue'),
  queue   = kue.createQueue();
var Promise = global.promise;

module.exports = function(context,priority,attempts){
  return new Promise(function(fullfill,reject){
    try{
      queue.create('email',context)
        .priority(priority)
        .attempts(attempts)
        .backoff({type: 'exponential'})
        .save();
      fullfill();
    }catch(err){
      reject(err);
    }
  });
};
