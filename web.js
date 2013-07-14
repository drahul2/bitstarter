var express = require('express');
var fs  = require('fs');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var data = fs.readFileSync(this.dir+"/index.html");
  var buf = new Buffer(256);
  buf.write(data,0);
  response.send(buf.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
