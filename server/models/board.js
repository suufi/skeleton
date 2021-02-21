const mongoose = require("mongoose");
const Schema = mongoose.Schema

const BoardSchema = new mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  colors: [{
		type: String
	}]
});

// compile model from schema
module.exports = mongoose.model("Board", BoardSchema);