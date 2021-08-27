const mongoose = require("mongoose");
const City = require("./city");
const Cours = require("./cours");
const { ObjectId } = mongoose.Schema;
const prospectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  cours: [
    {
      type: ObjectId,
      require: true,
      ref: Cours,
    },
  ],
  city: {
    type: ObjectId,
    ref: City,
    trim: true,
    require: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  statu: {
    type: Boolean,
    default: false,
  },
  commentaire: {
    type: String,
  },
});

prospectSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;
  //
  obj.cours.id = obj.cours._id;
  delete obj.cours._id;

  return obj;
});

module.exports = mongoose.model("Prospect", prospectSchema);
