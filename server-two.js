let server = require('express')();
let cors = require('cors')
let path = require('path');
var bodyParser = require('body-parser')

require("./db").knex;
const Customer = require("./model/customer");

function sendEmail(data) {
  var nodemailer = require('nodemailer');
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "threebonddev@gmail.com", //your gmail account you used to set the project up in google cloud console"
      pass: "threebonddev!1219"
    }
  });

  const aName = data.name || "NE";
  const lastName = data.lastName || "NE";
  const phoneNumber = data.phoneNumber || "NE";
  const email = data.email || "NE";
  const company = data.company || "NE";
  const aState = data.state || "NE";
  const sector = data.sector || "NE";
  const otherSector = data.otherSector || "NE";
  const novedades = data.novedades || "NO";
  const aDescription = data.description || "NE";

  const mailOptions = {
    from: 'threebonddev@gmail.com', // sender address
    to: ['miguel.angel.romero.gtz@gmail.com'], // list of receivers
    // to: ['lgarcia@threebond.com', 'ynishioka@threebond.com', 'omartinez@threebond.com', 'orodriguez@threebond.com'], // list of receivers
    subject: 'Nueva solicitud de cliente', // Subject line
    html: `<div>
	<p>Una nueva solicitud de cliente ha sido registrada</p>
	<p>Nombre: ${aName} ${lastName}</p>
	<p>Numero telefonico: ${phoneNumber}</p>
	<p>Email: ${email}</p>
	<p>Compañia: ${company}</p>
	<p>Estado: ${aState}</p>
	<p>Sector: ${sector}</p>
	<p>Descripción: ${aDescription}</p>
	<p>Desea recibir novedades: ${novedades}</p>
	</div>` // plain text body
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  })
}

server.use(cors());
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.post('/api/cotiza', (req, res) => {
  let body = req.body;
  console.log(body)
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
      sendEmail(body);
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
      console.log('something');
      res.end();
    });
});

function createXLS(json) {
  return json.reduce((csv, row) => {
    return `${csv}${row.aName || ""},${row.lastName || ""},${row.phoneNumber || ""
      },${row.email || ""},${row.company || ""},${row.aState || ""},${row.sector || ""
      },${row.otherSector || ""
      },${row.novedades || ""
      },${row.aDescription || ""}\n`;
  }, "Nombre,Apellidos,NumeroTelefonico,Email,Compania,Estado,Sector,OtroSector,RecibirNovedades,Descripcion\n");
}


server.listen(process.env.PORT || 3000);