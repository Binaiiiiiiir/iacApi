const mongoose = require("mongoose");const { ObjectId } = mongoose.Schema;
const User = require("./user");
const Student = require("./student");
const Teacher = require("./teacher");

const cashSchema = new mongoose.Schema({
  operationType: {
    required: true,
    type: String,
    trim: true,
  },
  student: {
    type: ObjectId,
    ref: Student,
  },
  teacher: {
    type: ObjectId,
    ref: Teacher,
  },
  libelle: {
    required: true,
    type: String,
    trim: true,
  },
  amount: {
    required: true,
    type: String,
    trim: true,
  },
  nature: {
    required: true,
    type: String,
    trim: true,
  },
  agent: {
    required: true,
    type: ObjectId,
    ref: User,
  },
  comment: {
    type: String,
    trim: true,
  },
  etat: {
    default: "Saisie",
    type: String,
    trim: true,
  },
});

cashSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("Cash", cashSchema);
