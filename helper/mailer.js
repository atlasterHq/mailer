var helper = require('sendgrid').mail;
var template = require('mustache');
var fs = require('fs');
var sg = require('sendgrid')(process.env.SendgridApi);
var tracker = require('trackit');

var Promise = global.Promise;

var lib = {};

lib.prepareContext = function(data){
  return new Promise(function(fullfill,reject){
    try{
      var from_mail = data.from+"@"+process.env.Host;
      data.from_email = new helper.Email(from_mail);
      data.to_email = new helper.Email(data.to_email);
      fullfill(data);
    }catch(ex){
      reject(ex);
    }
  });
};

lib.prepareTracker = function(data){
  return new Promise(function(fullfill,reject){
    tracker()
      .then(function(id){
        data.trackerId = id;
        fullfill(data);
      })
      .catch(reject);
  });
};

lib.prepareBody = function(data){
  return new Promise(function(fullfill,reject){
    fs.readFile("templates/"+data.template+".tpl",'utf8',function(err,content){
      if(err){
        reject(err);
      }
      else{
        data.ctx.env = process.env;
        data.body = template.render(content,data.ctx);
        console.log(data.body);
        fullfill(data);
      }
    });
  });
};

lib.prepareMail = function(data){
  return new Promise(function(fullfill,reject){
    try{
      var content = helper.Content("text/html",data.body);
      var mail = new helper.Mail(data.from_email,data.subject,data.to_email,content);
      var request = sg.emptyRequest({
        method: "POST",
        path  : "/v3/mail/send",
        body  : mail.toJSON()
      });
      fullfill(request);
    }catch(ex){
      reject(ex);
    }
  });
};

lib.sendMail = function(data){
  return new Promise(function(fullfill,reject){
    sg.API(data,function(err,response){
      if(err) {
        reject(err);
      }
      else{
        fullfill(response);
      }
    });
  });
};

module.exports = lib;
