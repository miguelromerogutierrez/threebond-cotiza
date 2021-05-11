var nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          user: "threebonddev@gmail.com", //your gmail account you used to set the project up in google cloud console"
	  pass: "threebonddev!1219"
     }});

const mailOptions = {
  from: 'threebonddev@gmail.com', // sender address
  to: 'miguel.angel.romero.gtz@gmail.com', // list of receivers
  subject: 'Subject of your email', // Subject line
  html: '<p>Your html here</p>'// plain text body
};

transport.sendMail(mailOptions, function(error, info) {
  if (error){
    console.log(error);
  } else {
    console.log("Email sent");
  }
})