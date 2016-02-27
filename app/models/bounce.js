var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BounceSchema = new Schema({
  text : String,
  post_id: String,
  user_id: String,
  loc: {
    type: [Number],
    index: '2d'
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bounce', BounceSchema);
