var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var port = process.env.PORT || 5000;
var router = express.Router();

app.use('/api', router);

// ===============================================
// ================== Routes =====================
// ===============================================

// Middleware stuff
router.use(function(req, res, next) {
  console.log("Query received on server");
  next();
});

router.get('/', function(req, res) {
  res.json({message : "rejt"});
});


app.listen(port);

console.log("Server started");
