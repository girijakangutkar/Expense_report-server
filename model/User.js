const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// UserSchema.pre("save", function (next) {
//   if (!this.isModified("password")) return next();

//   bcrypt.hash(this.password, 10, (err, hash) => {
//     if (err) return next(err);
//     this.password = hash;
//     next();
//   });
// });

// UserSchema.methods.comparePassword = function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

module.exports = mongoose.model("Users", UserSchema);
