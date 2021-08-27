const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  coursType: {
    type: String,
    trim: true,
    required: true,
  },
  // id: {
  //   type: String,
  //   trim: true,
  //   required: true,
  // },
});
coursSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("Cours", coursSchema);
