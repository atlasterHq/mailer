var mailer = require('./mailer');


var ctx = {};
ctx.to_email = "rb1223334444@gmail.com";
ctx.from = "test";
ctx.template = "signup";
ctx.token = "dummy";
mailer(ctx,'high',5)
  .then(function(data){
    console.log(data);
  })
  .catch(function(err){
    console.log(err);
    process.exit(1);
  });
