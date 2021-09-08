const mongoose = require("mongoose");
const Prospect = require("./prospect");
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema({
  student: {
    type: ObjectId,
    ref: Prospect,
    require: true,
  },
  perentNumber: {
    type: String,
    trim: true,
  },

  paiment: [
    {
      type: {
        type: String,
        // required: true,
      },
      Date: {
        type: Date,
        // default: Date.now(),
      },
      amount: {
        type: Number,
        // required: true,
      },
      numofmonth: {
        type: Number,
        required: true,
      },
    },
  ],
});

studentSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
    if (obj.student) {
      obj.student.id = obj.student._id;
      delete obj.student._id;
    }
  }

  //

  return obj;
});

module.exports = mongoose.model("Student", studentSchema);
