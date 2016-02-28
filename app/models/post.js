var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  text : String,
  bounce_count: Number 
  author: String
});

module.exports = mongoose.model('Post', PostSchema);
