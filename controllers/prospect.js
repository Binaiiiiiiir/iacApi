const Prospect = require("../models/prospect");
// const formidable = require("formidable");
const _ = require("lodash");
const mongoose = require("mongoose");
const { addStudent } = require("./student");

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
  req.body.RegistredAt = new Date();
  const prospect = await new Prospect(req.body);
  await prospect.save();
  res.status(200).json({ message: "operation succeded", status: 200 });
};

exports.getProspecs = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["RegisteredAt" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  // let page = 5;
  // let prePage = 0;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  filter.statu = false;
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
    console.log(...filter.cours.map((c) => mongoose.Types.ObjectId(c)));

    filter.cours = {
      $all: [...filter.cours.map((c) => mongoose.Types.ObjectId(c))],
    };
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
  console.log(newProspect);
  if (newProspect.statu) {
    addStudent(req.prospect._id.to);
  }
  console.log(newProspect);
  console.log(req.prospect);
  prospect = _.extend(prospect, newProspect);
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
