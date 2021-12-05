const mongoose = require("mongoose");
const Cours = require("./cours");
const Formation = require("./formation");
const Student = require("./student");
const Teacher = require("./teacher");
const { ObjectId } = mongoose.Schema;

const classSchema = new mongoose.Schema({
  classLabel: {
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

  //count Students
  this.studentsNumber = this.students.length;

  // generate Name
  if (this.isNew) {
    this.creationYear = new Date().getFullYear();

    var coureName,
      formationLabel,
      classCount = 101;
    Cours.findOne(this.cours).exec((err, data) => {
      if (err) {
        return res.status(400).json({ error: "Cours not found" });
      }
      var { name } = data;
      coureName = name;
      // console.log(coureName);

      Formation.findOne(this.formation).exec((err, data) => {
        if (err) {
          return res.status(400).json({ error: "Formation not found" });
        }
        var { label } = data;
        formationLabel = label;

        const func = (x) => {
          console.log(x);
          this.classLabel = `${coureName}-${formationLabel}-${classCount + x}-${
            this.creationYear
          }`;
          // console.log("In Pre save", this);
          next();
        };
        mongoose.model("Class").countDocuments(
          {
            cours: this.cours,
            formation: this.formation,
            creationYear: this.creationYear,
          },
          async (err, count) => {
            let x = await count;
            func(x);
          }
        );
      });
    });
  } else {
    next();
  }
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
