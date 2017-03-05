const helper = require('sendgrid').mail;
const template = require('mustache');
const fs = require('fs');
const sg = require('sendgrid')(process.env.SendgridApi);
const tracker = require('trackit');

var lib = {};

lib.prepareContext = (data)=>{
  return new Promise((fullfill,reject)=>{
    try{
      var from = data.from | "mail";
      from = from+"@"+process.env.Host;
      data.from_email = new helper.Email(from);
      data.to_email = new helper.Email(data.to);
      fullfill(data);
    }catch(ex){
      reject(ex);
    }
  });
}

lib.prepareTracker = (data)=>{
  return new Promise((fullfill,reject)=>{
    tracker()
      .then((id)=>{
        data.trackerId = id;
        fullfill(data);
      })
      .catch(reject);
  });
}

lib.prepareBody = (data)=>{
  return new Promise((fullfill,reject)=>{
    fs.readFile("templates/"+data.template+".tpl",'utf8',(err,content)=>{
      if(err)
        reject(err);
      else{
        data.body = template.render(content,data.ctx);
        fullfill(data);
      }
    });
  });
}

lib.prepareMail = (data)=>{
  return new Promise((fullfill,reject)=>{
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
}

lib.send = (data)=>{
  return new Promise((fullfill,reject)=>{
    sg.API(data,(err,response)=>{
      if(err) reject(err);
      else
        fullfill(response);
    });
  });
}

module.exports = lib;
