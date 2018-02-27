const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String },
  rating: {type: Number, required: true},
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
  image1: { type: String, pattern: /^https?:\/\/.+/},
  image2: { type: String, pattern: /^https?:\/\/.+/},
  image3: { type: String, pattern: /^https?:\/\/.+/},
  comments: [commentSchema]
});

schema.methods.calculateRating = function calculateRating() {
  let currentRating = 0;
  this.comments.forEach(comment => {
    currentRating += comment.rating;
  });
  currentRating = currentRating / (this.comments.length);
  return currentRating.toFixed(1);
};


//Mongoose will pluralise the record name cheese and create a collection called cheeses
module.exports = mongoose.model('Restaurant', schema);


//create schema method to calculate star rating.
