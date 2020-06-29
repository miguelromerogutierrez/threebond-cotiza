var repo = '~/threebond-site/threebond-website'; // path to the root of your Strapi project on server

const http = require('http');
const exec = require('child_process').exec;

http
  .createServer(function(req, res) {
    exec(
      `curl -X POST -d {} https://api.netlify.com/build_hooks/5ee5174df938de9d94281399`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      }
    );

    res.end();
  })
  .listen(8082);
