var express = require("express"),
  app = express(),
  http = require("http"),
  server = http.createServer(app),
  xmlparser = require("express-xml-bodyparser");

var DOMParser = require("xmldom").DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

var cors = require("cors");
app.use(cors());
app.use(xmlparser());

var validator = require("xsd-schema-validator");
var schemaPath = "xsd/lands.xsd";
var lands = '<?xml version="1.0" encoding="UTF-8"?><lands></lands>';

app.get("/lands", function (req, res, next) {
  res.set("application/xml").send(lands);
});

app.post("/lands", function (req, res, next) {
  // req.body contains the parsed xml
  var reqRawBody = req.rawBody;

  validator.validateXML(reqRawBody, schemaPath, function (err, result) {
    if (err) {
      console.log(err);
      res.set("application/xml").send(`<response>Error</response>`);
      return;
    }

    var xmlReqRawBody = new DOMParser().parseFromString(
      reqRawBody,
      "application/xml"
    );
    var xmlLands = new DOMParser().parseFromString(lands);

    xmlLandsToAdd = xmlReqRawBody.getElementsByTagName("land")[0];
    xmlLands.getElementsByTagName("lands")[0].appendChild(xmlLandsToAdd);

    lands = new XMLSerializer().serializeToString(xmlLands);

    res.set("application/xml").send(`<response>Added!</response>`);
  });
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`The server is running in ${PORT}`);
});
