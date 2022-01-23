const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      unique: true,
      lowercase: true
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide','admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength:8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        //This only works on CREATE & SAVE!
        validator: function(confirmedPassword) {
          return confirmedPassword === this.password;
        },
      message: 'Passwords are not the same'
      }
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  }
);

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next(); //function is valid only when we change/modify the password

  //Hash the password with salt of 12 (always hash passwords with salt 12).
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; //we don't need to store passwordConfirm once we know password entered matches.
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  //hashing
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); //sha256 is the algorithm with which we want to hash it. 

  this.passwordResetExpires = Date.now() + 10*60*1000;

  return resetToken;
}


const User = mongoose.model('User', userSchema);

module.exports = User;