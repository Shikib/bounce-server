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
    var offset = req.query.offset || 0;
    var limit = req.query.limit || 10;
    var max_distance = req.query.max_distance || 10;

    // Since the radius of the Earth is 6371 km, divide by it
    max_distance = max_distance / 6371;

    var user_loc = [req.query.lng, req.query.lat];

    Bounce.find({
      loc : {
        $near : user_loc,
        $maxDistance : max_distance
      }
    }).distinct("post_id").exec(function(err, bounces) {
      if(err)
        return res.send(err);

      // Hacky fix to do limit/offset
      var newBounces = bounces.slice(offset, offset + limit);

      Post.find({
        _id : {
          $in : newBounces
        }
      }).exec(function(err, posts) {
        res.json(posts);
      });
    });

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
  // OUTPUT: success/failure message
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
  })
  // Get all of the things you've bounced
  // INPUT: user_id
  // OUTPUT: all of your bounces
  $.get(function(req, res) {
    Bounce.find({
      user_id : user_id
    }).distinct("post_id").exec(function(err, bounces) {
      if(err)
        return res.send(err);

      Post.find({
        _id : {
          $in : newBounces
        }
      }).exec(function(err, posts) {
        res.json(posts);
      });
    });
  });
  

app.listen(port);

console.log("Server started");
