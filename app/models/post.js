var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  text : String,
  bounce_count: Number 
});

module.exports = mongoose.model('Post', PostSchema);
