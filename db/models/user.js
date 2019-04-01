const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Regular expression for validating a user email address
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Required modules
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  name: { 
    type: String,
    required: true 
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => emailRegex.test(v),
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  }
});

// Authenticate input against user database documents
UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ email })
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const err = new Error("User not found.");
        err.status = 401;
        return callback(err);
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
};

// Hash the user's password before saving to the database
UserSchema.pre("save", function(next) {
  const user = this;

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;