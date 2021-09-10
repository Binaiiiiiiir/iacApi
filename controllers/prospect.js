const Prospect = require("../models/prospect");
// const formidable = require("formidable");
const _ = require("lodash");
const mongoose = require("mongoose");
const { addStudent, deleteStudentByProspect } = require("./student");
const prospect = require("../models/prospect");

exports.getProspectById = (req, res, next, id) => {
  Prospect.findById(id)
    .populate("city", "name")

    // .populate("cours", "  name")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({ error: "Prospect not found" });
      }

      req.prospect = data;
      // for (let i = 0; i < data.cours.length; i++) {
      //   data.cours[i] = data.cours[i].transform();
      // }
      res.set("Content-Range", `0-1/${data.length}`);
      res.json(data.transform());
      next();
    });
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
  // filter.statu = false;
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
    // console.log(...filter.cours.map((c) => mongoose.Types.ObjectId(c)));

    filter.cours = {
      $all: [...filter.cours.map((c) => mongoose.Types.ObjectId(c))],
    };
  }
  if (filter.id) {
    // console.log(...filter.cours.map((c) => mongoose.Types.ObjectId(c)));

    // console.log(...filter._id.map((c) => mongoose.Types.ObjectId(c)));
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }

  Prospect.countDocuments(function (err, c) {
    count = c;
  });
  let map = new Map([sort]);
  Prospect.find(filter)
    .sort(Object.fromEntries(map))
    .skip(range[0])
    .limit(range[1] + 1 - range[0])
    .populate("city", "name")
    .then((data) => {
      let formatData = [];
      console.log(data.length, range);
      for (let i = 0; i < data.length; i++) {
        formatData.push(data[i].transform());
      }
      res.set("Content-Range", `prospect ${range[0]}-${range[1] + 1}/${count}`);
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateProspect = (req, res) => {
  let prospect = req.prospect;
  let newProspect = req.body;

  if (newProspect.city) newProspect.city = newProspect.city.id;

  prospect = _.extend(prospect, newProspect);
  if (newProspect.statu) {
    let newStudent = {
      name: prospect.name,
      cours: prospect.cours,
      comment: prospect.comment,
      city: prospect.city._id,
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
      return res.status(403).json({ error: err });
    }
    // res.json(prospect);
  });
};

exports.deleteProspect = (req, res) => {
  let prospect = req.prospect;

  prospect.remove((err, prospect) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    res.json({
      message: "prospect deleted successfully",
    });
  });
};

exports.updateStatuPros = (id) => {
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
