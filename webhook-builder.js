var repo = '~/threebond-site/threebond-website'; // path to the root of your Strapi project on server

const http = require('http');
const exec = require('child_process').exec;

http
  .createServer(function(req, res) {
    exec(
      `cd ${repo} && yarn build`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        exec(
          `cd ~/threebond-site/threebond-website/public/ && git add . && git commit -m "save chages" && git push origin master`
        )
      }
    );

    res.end();
  })
  .listen(8082);