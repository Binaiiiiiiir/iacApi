const Student = require("../models/student");
const _ = require("lodash");
const Prospect = require("../models/prospect");

exports.createStudent = async (req, res) => {
  const studentExists = await Student.findOne({
    student: req.body.student,
  });
  if (studentExists) {
    return res.status(403).json({
      error: "Students  exist",
    });
  }
  const student = await new Student(req.body);
  await student.save();
  res.status(200).json({ message: req.body });
};

exports.getStudents = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || "[]";
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  if (filter.email) {
    filter.email = { $regex: ".*" + filter.email + ".*" };
  }
  if (filter.comment) {
    filter.comment = { $regex: ".*" + filter.comment + ".*" };
  }
  if (filter.RegisteredAt) {
    let dateStr = new Date(filter.RegisteredAt);
    let nextDate = new Date(filter.RegisteredAt);
    nextDate.setDate(nextDate.getDate() + 1);
    console.log(dateStr, nextDate);
    filter.RegisteredAt = {
      $gte: new Date(dateStr),
      $lte: new Date(nextDate),
    };
  }
  if (filter.cours) {
    filter.cours = {
      $all: [...filter.cours.map((c) => mongoose.Types.ObjectId(c))],
    };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }

  console.log(filter);
  Student.countDocuments(function (err, c) {
    count = c;
  });
  let map = new Map([sort]);
  // console.log(map);
  Student.find(filter)
    // .sort(Object.fromEntries(map))
    .skip(range[0])
    .limit(range[1] + 1 - range[0])
    .then((data) => {
      let formatData = [];
      for (let i = 0; i < data.length; i++) {
        formatData.push(data[i].transform());
      }
      res.set("Content-Range", `student ${range[0]}-${range[1] + 1}/${count}`);
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.studentByIdBy = (req, res, next, id) => {
  Student.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Prospect not found" });
    }
    req.student = data;
    // for (let i = 0; i < data.cours.length; i++) {
    //   data.cours[i] = data.cours[i].transform();
    // }
    res.set("Content-Range", `0-1/${data.length}`);
    res.json(data.transform());
    next();
  });
};

exports.updateStudent = (req, res) => {
  let student = req.student;
  student = _.extend(student, req.body);
  student.save((err, student) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(student);
  });
};
const updateStatuPros = (id) => {
  Prospect.findOne(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Prospect not found" });
    }
    prospect = _.extend(data, { statu: false });
    prospect.save((err, prospect) => {
      if (err) {
        return res.status(403).json({ error: err });
      }
      // res.json(prospect);
    });
  });
};

exports.deleteStudent = (req, res) => {
  let student = req.student;
  updateStatuPros(student.refProspect);
  student.remove((err, student) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    // res.json({
    //   message: "student deleted successfully",
    // });
  });
};

exports.addStudent = async (student) => {
  const studentAdd = await new Student(student);

  await studentAdd.save();
};

exports.deleteStudentByProspect = (id) => {
  Student.findOne({ refProspect: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Student not found" });
    }

    data.remove((err, student) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
    });
  });
};
