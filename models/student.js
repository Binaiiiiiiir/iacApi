const mongoose = require("mongoose");
const City = require("./city");
const Cours = require("./cours");
const Prospect = require("./prospect");
const { ObjectId } = mongoose.Schema;

const studentSchema = new mongoose.Schema({
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
    require: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  RegisteredAt: {
    type: Date,
  },
  comment: {
    type: String,
    default: "nothing yet",
  },
  parentNumber: {
    type: String,
    trim: true,
  },
  refProspect: {
    type: ObjectId,
    ref: Prospect,
  },
  // payment: [
  //   {
  //     type: {
  //       type: String,
  //       // required: true,
  //     },
  //     Date: {
  //       type: Date,
  //       // default: Date.now(),
  //     },
  //     amount: {
  //       type: Number,
  //       // required: true,
  //     },
  //     numofmonth: {
  //       type: Number,
  //       required: true,
  //     },
  //   },
  // ],
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
