const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}]
});


// On save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next, done) {
  // get access to the user model
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  // generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    callback(err, isMatch);
  })
}
// Create the model class
const ModelClass = mongoose.model('User', userSchema);

// Export the model
module.exports = ModelClass;
