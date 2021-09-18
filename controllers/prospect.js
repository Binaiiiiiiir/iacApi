const Prospect = require("../models/prospect");
// const formidable = require("formidable");
const _ = require("lodash");
const mongoose = require("mongoose");
const { addStudent, deleteStudentByProspect } = require("./student");

exports.getProspectOne = (req, res, next, id) => {
  Prospect.findById(id).exec((err, data) => {
    // if (err) {
    //   return res.status(400).json({ error: "Prospect not found" });
    // }
    // res.set("Content-Range", `0-1/${data.length}`);
    // for (let i = 0; i < data.cours.length; i++) {
    //   data.cours[i] = data.cours[i].transform();
    // }
    // res.json(data.transform());
    req.prospect = data;

    next();
  });
};
exports.getProspectById = (req, res) => {
  prospect = req.prospect;
  if (prospect) {
    res.set("Content-Range", `prospect 0-1/1`);
    res.json(prospect.transform());
  } else res.status(400).json({ message: "Prospect not found" });
};

exports.createProspect = async (req, res) => {
  const studentsExists = await Prospect.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (studentsExists) {
    return res.status(403).json({
      message: "sorry something went worng try again later",
      status: 400,
    });
  }
  // req.body.RegistredAt = mongoose.Types.Date.now();
  const prospect = await new Prospect(req.body);
  await prospect.save();
  res.status(200).json({ message: "operation succeded", status: 200 });
};

exports.getProspecs = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["RegisteredAt" , "DESC"]';
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

  Prospect.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Prospect.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        console.log(data.length, range);
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "Content-Range",
          `prospect ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.updateProspect = (req, res) => {
  let prospect = req.prospect;
  let newProspect = req.body;

  prospect = _.extend(prospect, newProspect);
  if (newProspect.status === "student") {
    let newStudent = {
      name: prospect.name,
      cours: prospect.cours,
      comment: prospect.comment,
      city: prospect.city,
      email: prospect.email,
      phoneNumber: prospect.phoneNumber,
      refProspect: prospect._id,
      RegisteredAt: prospect.RegisteredAt,
    };
    addStudent(newStudent);
  } else {
    deleteStudentByProspect(req.prospect._id);
  }

  prospect.save((err, prospect) => {
    if (err) {
      return res.status(403).json({ message: err });
    }
    res.json(prospect);
  });
};

exports.deleteProspect = (req, res) => {
  let prospect = req.prospect;

  if (prospect) {
    if (prospect.status !== "student") {
      prospect.remove((err, prospect) => {
        if (err) {
          return res.status(400).json({ message: err });
        }

        res.json({
          message: "prospect deleted successfully",
        });
      });
    } else {
      console.log("else");
      res.status(400).json({ message: "unauthorized" });
    }
  } else {
    res.status(400).json({ message: "prospect not found" });
  }
};
