const mongoose = require('mongoose');

//then we need to make a schema, tells what data to expect and what it should look like
//if any data tries to be added that isn't in this schema or is of the wrong type, this model will just ignore that record
const commentSchema = new mongoose.Schema({
  content: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

commentSchema.methods.isOwnedBy = function(user){
  return this.user && user._id.equals(this.user._id);
};

const schema = new mongoose.Schema({
  name: {type: String, minlength: 2, required: true},
  location: {type: String, minlength: 10, required: true},
  description: {type: String, required: true},
  cuisine: {type: String, minlength: 3, required: true},
  image: { type: String, pattern: /^https?:\/\/.+/},
  comments: [commentSchema]
});

//Mongoose will pluralise the record name cheese and create a collection called cheeses
module.exports = mongoose.model('Restaurant', schema);
