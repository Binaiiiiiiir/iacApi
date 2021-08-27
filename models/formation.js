const mongoose = require("mongoose");

const formtionSchema = new mongoose.Schema({
  label: {
    type: String,
    require: true,
    trim: true,
  },
  price: {
    type: String,
    require: true,
    trim: true,
  },
});

module.exports = mongoose.model("Formation", formtionSchema);
