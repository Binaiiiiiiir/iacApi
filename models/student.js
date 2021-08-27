const mongoose = require("mongoose");
const prospect = require("./prospect");
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema({
  student: {
    type: ObjectId,
    ref: Prospect,
  },
  perentNumber: {
    type: String,
    required: true,
    trim: true,
  },

  paiment: [
    {
      type: {
        type: String,
        required: true,
      },
      Date: {
        type: Date,
        default: Date.now(),
      },
      amount: {
        type: Number,
        required: true,
      },
      numofmonth: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
