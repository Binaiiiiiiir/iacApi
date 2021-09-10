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

prospectSchema.pre("save", function (next) {
  // get the current date
  let coureName, formationLabel;
  Cours.findOne(this.cours).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Cours not found" });
    }
    coureName = data.name;
  });
  Fromation.findOne(this.formation).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Formation not found" });
    }
    formationLabel = data.label;
  });
  let name = `${coureName}-${formationLabel} ${new Date().getFullYear()}`;

  // if created_at doesn't exist, add to that field
  if (!this.name) {
    console.log("In Pre save");
    this.name = name;
  }

  next();
});

classSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fieldss
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }

  return obj;
});

module.exports = mongoose.model("Prospect", prospectSchema);
