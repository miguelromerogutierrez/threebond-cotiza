var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
"505907747912-f7b7gfuglj3bjb65mmt9jqrvfsg484hj.apps.googleusercontent.com",
"mXmy4NEnME0CkT8KfjxPsf0g",
"https://developers.google.com/oauthplayground"
)

myOAuth2Client.setCredentials({
refresh_token:"1//048xvHDb-JJ4sCgYIARAAGAQSNwF-L9IrbpcZA3lKHMtay_jhxsXD5kPXYfPE10Y0SK8CEXPpaQZq2_HX6ZFVQRWml3HyXtgX0Ug"
});

const myAccessToken = myOAuth2Client.getAccessToken()

const transport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "miguel.angel.romero.gtz@gmail.com", //your gmail account you used to set the project up in google cloud console"
          clientId: "505907747912-f7b7gfuglj3bjb65mmt9jqrvfsg484hj.apps.googleusercontent.com",
          clientSecret: "mXmy4NEnME0CkT8KfjxPsf0g",
          refreshToken: "1//048xvHDb-JJ4sCgYIARAAGAQSNwF-L9IrbpcZA3lKHMtay_jhxsXD5kPXYfPE10Y0SK8CEXPpaQZq2_HX6ZFVQRWml3HyXtgX0Ug",
          accessToken: "ya29.a0AfH6SMCVK00kdTiiuIpiA22QN1JaBJhXYjUDi9tCdvWy8ifcvHPsfejo-GEwiAoKKnsyHLKLxiezi2_swLk3PUSuiq1jciSd1WQVLdRCKf7ToO5F0PpOm5SIrfQWac3shTw6CHUO8I8IicN--qID4AoZZLYgrvfQ1gLoarCNc0M" //access token variable we defined earlier
     }});

const mailOptions = {
  from: 'miguel.angel.romero.gtz@gmail.com', // sender address
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