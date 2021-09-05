const Teacher = require("../models/teacher");
const _ = require("lodash");

exports.createTeacher = async (req, res) => {
  const coursExists = await Teacher.findOne({ cin: req.body.cin });
  if (coursExists) {
    return res.status(403).json({
      error: "Teacher exist",
    });
  }

  const teacher = await new Teacher(req.body);
  await teacher.save();
  res.status(200).json({ message: req.body });
};

exports.teahcerById = (req, res, next, id) => {
  Teacher.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Teacher not found" });
    }
    req.teacher = data;
    res.json(data.transform());

    next();
  });
  // res.json({ text: "hello" });
};

exports.getTeacher = (req, res) => {
  Teacher.find()
    .then((data) => {
      let formatData = [];
      for (let i = 0; i < data.length; i++) {
        formatData.push(data[i].transform());
      }
      res.set("Content-Range", `0-2/${data.length}`);
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateTeacher = (req, res) => {
  let teacher = req.teacher;
  teacher = _.extend(teacher, req.teacher);
  teacher.save((err, teacher) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(teacher);
  });
};

exports.deleteTeacher = (req, res) => {
  let teacher = req.teacher;

  teacher.remove((err, teacher) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    // res.json({
    //   message: "teacher deleted successfully",
    // });
  });
};
