const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favouriteList: [{type: mongoose.Schema.ObjectId, ref: 'Restaurant'}]
});

schema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

schema.pre('validate', function checkPassword(next) {
  if(this.isModified('password') && this._passwordConfirmation !== this.password) this.invalidate('passwordConfirmation', 'does not match');
  next();
});

schema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

schema.methods.validatePassword = function validatePassword(password){
  return bcrypt.compareSync(password, this.password);
};

schema.methods.hasFavourited = function hasFavourited(restaurant) {
  return this.favouriteList.some((favourite) => {
    return favourite.equals(restaurant._id);
  });
};

module.exports = mongoose.model('User', schema);
