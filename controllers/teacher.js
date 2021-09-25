const Teacher = require("../models/teacher");
const _ = require("lodash");
const mongoose = require("mongoose");

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
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name" , "ASC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.email) {
    filter.email = { $regex: ".*" + filter.email + ".*" };
  }
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  if (filter.cin) {
    filter.cin = { $regex: ".*" + filter.cin + ".*" };
  }
  if (filter.cours) {
    filter.cours = {
      $all: [...filter.cours.map((c) => mongoose.Types.ObjectId(c))],
    };
  }
  if (filter.course) {
    filter.course = {
      $in: [mongoose.Types.ObjectId(filter.course)],
    };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }
  Teacher.countDocuments(filter, function (err, c) {
    count = c;
    let map = new Map([sort]);
    Teacher.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "Content-Range",
          `teacher ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.updateTeacher = (req, res) => {
  let teacher = req.teacher;
  teacher = _.extend(teacher, req.body);
  console.log(teacher);
  teacher.save((err, teacher) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(city);
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

exports.getTeacherByCourses = (req, res) => {
  // let range = req.query.range || "[0,9]";
  let sort = req.query.sort || "[]";
  let filter = req.query.filter || "{}";
  let count;

  sort = JSON.parse(sort);
  filter = JSON.parse(filter);

  if (filter.course) {
    filter.course = {
      $in: mongoose.Types.ObjectId(filter.cours),
    };
  }

  console.log(filter);
  Teacher.countDocuments(filter, function (err, c) {
    count = c;
    let map = new Map([sort]);
    // console.log(map);
    Teacher.find(filter)
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `Teacher ${0}-${count}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
