var helper = require('sendgrid').mail;
var from_email = new helper.Email('admin@atlaster.co');
var to_email = new helper.Email('rb1223334444@gmail.com');
var subject = 'Html encoded mail';
var content = new helper.Content('text/html', '<h1> Hello world</h1><p>Testing html</p>');
var mail = new helper.Mail(from_email, subject, to_email, content);

var sg = require('sendgrid')(process.env.SendgridApi);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

sg.API(request, function(error, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});
