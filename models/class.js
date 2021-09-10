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
  studentsNumber: {
    type: Number,
  },
  students: [
    {
      type: ObjectId,
      ref: Student,
    },
  ],
  creationYear: {
    type: Number,
  },
});

classSchema.pre("save", function (next) {
  //give creationyear
  if (!this.creationYear) {
    this.creationYear = new Date().getFullYear();
  }
  //count Students
  this.studentsNumber = this.students.length;

  // generate Name
  var coureName, formationLabel;
  Cours.findOne(this.cours).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Cours not found" });
    }
    var { name } = data;
    coureName = name;
    console.log(coureName);
  });
  Formation.findOne(this.formation).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Formation not found" });
    }
    var { label } = data;
    formationLabel = label;
    console.log(formationLabel);
    if (!this.name) {
      console.log("In Pre save");
      this.name = `${coureName}-${formationLabel} ${this.creationYear}`;
    }
  });

  Class.count(
    { "class.formation": this.formation, "class.cours": this.cours },
    (err, dos) => {
      if (err) {
        console.log(err);
      }
      console.log(dos);
    }
  );

  // mongoose
  //   .model("Class")
  //   .countDocuments({
  //     formation: this.formation,
  //     creationYear: this.creationYear,
  //   });

  // if created_at doesn't exist, add to that field

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

module.exports = mongoose.model("Class", classSchema);
