var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  text : String,
  bounce_count: Number,
  author: String,
  last_bounce: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
