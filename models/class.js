const mongoose = require("mongoose");
const Cours = require("./cours");
const Formation = require("./formation");
const Student = require("./student");
const Teacher = require("./teacher");
const { ObjectId } = mongoose.Schema;

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
  },
  teacher: {
    type: ObjectId,
    ref: Teacher,
  },
  cours: {
    type: ObjectId,
    ref: Cours,
  },
  formation: {
    type: ObjectId,
    ref: Formation,
  },
  students: [
    {
      type: ObjectId,
      ref: Student,
    },
  ],
});
