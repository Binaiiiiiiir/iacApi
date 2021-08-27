const mongoose = require("mongoose");
const Cours = require("./cours");
const { ObjectId } = mongoose.Schema;
const teacherSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  cin: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: [ObjectId],
    ref: Cours,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
