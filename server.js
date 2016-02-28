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
var Comment = require('./app/models/comment');

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
        },
        last_bounce : {
          $gt : new Date(Date.now() - 1000*60*60*24)
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
    post.author = req.body.user_id;

    var bounce = new Bounce();
    bounce.post_id = post._id;
    bounce.user_id = req.body.user_id;
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

      Post.findByIdAndUpdate(
        req.body.post_id,
        {
          $set: {
            last_bounce : Date.now()
          }
        },
        function(err) {
          if(err)
            res.send(err);  
  
          res.json({message: "Post Bounced"});
        }
      );
    });

  })
  // Get all of the things you've bounced
  // INPUT: user_id
  // OUTPUT: all of your bounces
  .get(function(req, res) {
    Bounce.find({
      user_id : req.query.user_id
    }).distinct("post_id").exec(function(err, bounces) {
      if(err)
        return res.send(err);

      Post.find({
        _id : {
          $in : bounces
        },
        last_bounce : {
          $gt : new Date(Date.now() - 1000*60*60*24)
        }
      }).exec(function(err, posts) {
        res.json(posts);
      });
    });
  });

router.route('/my_posts')
  // Retrieve everything you posted
  // INPUT: user_id
  // OUTPUT: list of posts authored by user
  .get(function(req, res) {
    Post.find({
      author : req.query.user_id,
      last_bounce : {
        $gt : new Date(Date.now() - 1000*60*60*24)
      }
    }).exec(function(err, posts) {
      if(err)
        res.send(err);

      res.json(posts);
    }); 
  });
  
router.route('/post_bounces')
  // Retrieve all the bounces for a post
  // INPUT: post_id
  // OUTPUT: list of bounces
  .get(function(req, res) {
    Bounce.find({
      post_id : req.query.post_id
    }).exec(function(err, bounces) {
      if(err)
        res.send(err);

      res.json(bounces);
    });
  });

router.route('/comment')
  // Retrieve the last 10 comments for a page
  // INPUT: post_id
  // OUTPUT: list of comments
  .get(function(req, res) {
    Comment.find({
      post_id : req.query.post_id
    }).sort('-time').limit(10).exec(function(err, comments) {
      if(err)
        res.send(err);

      res.json(comments);
    });
  })
  // Post a new comment
  // INPUT: post_id, user_id, comment text
  // OUTPUT: confirmation message
  .post(function(req, res) {
    var comment = new Comment();
    comment.text = req.body.text;
    comment.user_id = req.body.user_id;
    comment.post_id = req.body.post_id;
    
    comment.save(function(err) {
      if(err)
        res.send(err);

      res.json({message: "Comment Created!"});
    });
  });

app.listen(port);

console.log("Server started");
