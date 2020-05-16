const http = require("http");
const fs = require("fs");
const { parse } = require("querystring");
const Customer = require("./model/customer");
const knex = require("./db").knex;

function exitHandler(options) {
  knex.destroy();
  console.log("CLEAN UP");
  if (options.exit) process.exit();
}
//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
http
  .createServer(function (req, res) {
    console.log('entro ', req.method, " ", req.url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    } else if (req.url === "/api/cotiza" && req.method === "POST") {
      collectRequestData(req, (result) => {
        let customer = new Customer({
          aName: result.name || "",
          lastName: result.lastName || "",
          phoneNumber: result.phoneNumber || "",
          email: result.email || "",
          company: result.company || "",
          aState: result.state || "",
          sector: result.sector || "",
          otherSector: result.otherSector || "",
          novedades: result.novedades || "NO",
          aDescription: result.description || "",
        });
        customer
          .save()
          .then((result) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            console.log(result);
            res.write(JSON.stringify(result));
            res.end();
          })
          .catch((error) => {
            res.writeHead(401, { "Content-Type": "application/json" });
            console.log(error);
            res.write(JSON.stringify({ message: error }));
            res.end();
          });
      });
    } else if (req.url === "/api/cotiza" && req.method === "GET") {
      Customer.fetchAll()
        .then((customer) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(customer.toJSON()));
          res.end();
        })
        .catch((error) => {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: error }));
          res.end();
        });
    } else if (req.url === "/api/cotiza/csv" && req.method === "GET") {
      Customer.fetchAll()
        .then((customer) => {
          res.writeHead(200, { "Content-Type": "ext/csv" });
          res.write(createXLS(customer.toJSON()));
          res.end();
        })
        .catch((error) => {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: error }));
          res.end();
        });
    }
  })
  .listen(8081);

function collectRequestData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  console.log(request.headers["content-type"])
  if (request.headers["content-type"] === FORM_URLENCODED) {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}

function createXLS(json) {
  return json.reduce((csv, row) => {
    return `${csv}${row.aName || ""},${row.lastName || ""},${
      row.phoneNumber || ""
    },${row.email || ""},${row.company || ""},${row.aState || ""},${
      row.sector || ""
    },${
      row.otherSector || ""
    },${
      row.novedades || ""
    },${row.aDescription || ""}\n`;
  }, "Nombre,Apellidos,NumeroTelefonico,Email,Compania,Estado,Sector,OtroSector,RecibirNovedades,Descripcion\n");
}
