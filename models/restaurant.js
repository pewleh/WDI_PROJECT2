const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String },
  rating: {type: Number, required: true},
  food: {type: Number, required: true},
  service: {type: Number, required: true},
  ambiance: {type: Number, required: true},
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

commentSchema.methods.isOwnedBy = function(user){
  return this.user._id && user._id.equals(this.user._id);
};


const schema = new mongoose.Schema({
  name: {type: String, minlength: 4, required: true},
  location: {type: String, minlength: 10, required: true},
  description: {type: String, required: true},
  cuisine: {type: String, minlength: 3, required: true},
  link: {type: String, required: true},
  image1: { type: String},
  image2: { type: String},
  image3: { type: String},
  comments: [commentSchema],
  user: { type: mongoose.Schema.ObjectId, ref: 'User'}
});
//moderator tract.
schema.methods.isOwnedBy = function(user){
  return this.user && user._id.equals(this.user._id);
};
//.equals is the same as ===
schema.virtual('overallRating')
  .get(function calculateRating() {
    if(!this.comments.length) return 'Unrated';
    const averageRating = this.comments.reduce((sum, comment) => sum + comment.rating, 0) / this.comments.length;
    return averageRating.toFixed(1);
  });

schema.virtual('foodRating')
  .get(function calculateFoodRating() {
    if(!this.comments.length) return 'Unrated';
    const averageRating = this.comments.reduce((sum, comment) => sum + comment.food, 0) / this.comments.length;
    return averageRating.toFixed(1);
  });

schema.virtual('serviceRating')
  .get(function calculateServiceRating() {
    if(!this.comments.length) return 'Unrated';
    const averageRating = this.comments.reduce((sum, comment) => sum + comment.service, 0) / this.comments.length;
    return averageRating.toFixed(1);
  });
schema.virtual('ambianceRating')
  .get(function calculateAmbianceRating() {
    if(!this.comments.length) return 'Unrated';
    const averageRating = this.comments.reduce((sum, comment) => sum + comment.ambiance, 0) / this.comments.length;
    return averageRating.toFixed(1);
  });


//Mongoose will pluralise the record name cheese and create a collection called cheeses
module.exports = mongoose.model('Restaurant', schema);


//create schema method to calculate star rating.
