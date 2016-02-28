var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text : String,
  user_id : String,
  post_id : String,
  time : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
