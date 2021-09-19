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
      required: true,
      ref: Cours,
    },
  ],
  city: {
    type: ObjectId,
    ref: City,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  RegisteredAt: {
    type: Date,
  },
  comment: {
    type: String,
    default: "nothing yet",
  },
});

prospectSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // if created_at doesn't exist, add to that field
  if (!this.RegisteredAt) {
    console.log();
    console.log("In Pre save");
    this.RegisteredAt = currentDate;
  }

  next();
});
prospectSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fieldss
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
    // if (obj.cours) {
    //   obj.cours.id = obj.cours._id;
    //   delete obj.cours._id;
    // }
    // if (obj.city) {
    //   obj.city.id = obj.city;
    //   delete obj.city;
    // }
  }

  //

  return obj;
});

module.exports = mongoose.model("Prospect", prospectSchema);
