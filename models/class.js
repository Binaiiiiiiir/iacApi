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

    var coureName, formationLabel, count;
    Cours.findOne(this.cours).exec((err, data) => {
      if (err) {
        return res.status(400).json({ error: "Cours not found" });
      }
      var { name } = data;
      coureName = name;
      console.log(coureName);

      Formation.findOne(this.formation).exec((err, data) => {
        if (err) {
          return res.status(400).json({ error: "Formation not found" });
        }
        var { label } = data;
        formationLabel = label;
        mongoose.model("Class").countDocuments(
          {
            cours: this.cours,
            formation: this.formation,
            creationYear: this.creationYear,
          },
          (err, count) => {
            console.log(count);
            this.classLabel = `${coureName}-${formationLabel}-${count + 101}-${
              this.creationYear
            }`;
          }
        );

        console.log("In Pre save", this);
        next();
      });
    });
  } else {
    next();
  }

  // Class.count(
  //   { "class.formation": this.formation, "class.cours": this.cours },
  //   (err, dos) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log(dos);
  //   }
  // );

  // if created_at doesn't exist, add to that field
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
