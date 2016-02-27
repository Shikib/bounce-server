var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  text : String,
  bounce_count: Integer
});

module.exports = mongoose.model('Post', PostSchema);
