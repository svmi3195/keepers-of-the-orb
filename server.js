var express = require("express");
var app = express();
var path = require("path");

app.use(express.static('development'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/development/index.html'));
});

app.listen(3000);

console.log("Running at Port 3000");