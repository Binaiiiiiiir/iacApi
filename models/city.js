const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("City", citySchema);
