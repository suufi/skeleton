const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  role: { type: String, enum: ['User', 'Admin']}
});

// compile model from schema
module.exports = mongoose.model("User", UserSchema);
