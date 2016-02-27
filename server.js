var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:hunter2@ds058548.mlab.com:58548/bounce');

var port = process.env.PORT || 5000;
var router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', router);

var Post = require('./app/models/post');
var Bounce = require('./app/models/bounce');

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

router.route('/post')
  // Retrieve next 10 posts
  // INPUT: (lng, lat), offset, timestamp of last query
  // OUTPUT: next 10 posts ordered by distance
  .get(function(req, res) {
    console.log("test");
  })
  // Add new post
  // INPUT: text, user_id, (lat, lng),
  // OUTPUT: success/failure message
  .post(function(req, res) {
    var post = new Post();
    post.text = req.body.text;
    post.bounce_count = 1;

    var bounce = new Bounce();
    bounce.post_id = post._id;
    bounce.user_id = req.body.user;
    bounce.loc = [req.body.lng, req.body.lat];
    
    post.save(function(err) {
      if(err)
        res.send(err);

      bounce.save(function(err) {
        if(err)
          res.send(err);

        res.json({message: "Post Created!"});
      });
    });
  });

router.route('/bounce')
  // Bounce a post
  // INPUT: (lng, lat), user_id, post_id
  .post(function(req, res) {
    var bounce = new Bounce();
    bounce.post_id = req.body.post_id; 
    bounce.user_id = req.body.user_id;
    bounce.loc = [req.body.lng, req.body.lat];

    bounce.save(function(err) {
      if(err)
        res.send(err);

      res.json({message: "Post Bounced"});
    });
  });

app.listen(port);

console.log("Server started");
