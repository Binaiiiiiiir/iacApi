const mongoose = require("mongoose");

const formationSchema = new mongoose.Schema({
  label: {
    type: String,
    require: true,
    trim: true,
    uppercase: true,
  },
  description: {
    type: String,
  },
  priceMounth: {
    type: Number,
    require: true,
  },
  priceFormation: {
    type: Number,
    require: true,
  },
});
formationSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("Formation", formationSchema);
