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
  cours: [
    {
      type: ObjectId,
      require: true,
      ref: Cours,
    },
  ],
});

teacherSchema.method("transform", function () {
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
    //   obj.city.id = obj.city._id;
    //   delete obj.city._id;
    // }
  }

  //

  return obj;
});
module.exports = mongoose.model("Teacher", teacherSchema);
