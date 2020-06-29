let server = require('express')();
let cors = require('cors')
let path = require('path');
var bodyParser = require('body-parser')

const Customer = require("./model/customer");
const knex = require("./db").knex;

server.use(cors());
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.post('/api/cotiza', (req ,res) => {
  let body = req.body;
  let customer = new Customer({
    aName: body.name || "",
    lastName: body.lastName || "",
    phoneNumber: body.phoneNumber || "",
    email: body.email || "",
    company: body.company || "",
    aState: body.state || "",
    sector: body.sector || "",
    otherSector: body.otherSector || "",
    novedades: body.novedades || "NO",
    aDescription: body.description || "",
  });
  customer
    .save()
    .then((result) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(result));
      res.end();
    })
    .catch((error) => {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: error }));
      res.end();
    });
});

server.get('/reporte', (req, res) => {
  Customer.fetchAll()
    .then((customer) => {

      let dataCustomer = customer.toJSON();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');

      res.write(createXLS(dataCustomer));

      res.end();
    })
    .catch((error) => {
      res.write(JSON.stringify({ message: error }));
      res.end();
    });
});

server.get('/', (req, res) => {
  Customer.fetchAll()
    .then((customer) => {
      let dataCustomer = customer.toJSON();

      res.render('reporte', {
        customers: dataCustomer
      });
    })
    .catch((error) => {
      res.write(JSON.stringify({ message: error }));
      res.end();
    });
});

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


server.listen(8081);