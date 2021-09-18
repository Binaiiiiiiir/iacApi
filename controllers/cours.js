const Cours = require("../models/cours");
const _ = require("lodash");
const mongoose = require("mongoose");

exports.createCours = async (req, res) => {
  // const coursExists = await Cours.findOne({ id: req.body.id });
  // if (coursExists) {
  //   return res.status(403).json({
  //     error: "cours id all ready used",
  //   });
  // }

  const cours = await new Cours(req.body);
  await cours.save();
  res.status(200).json({ message: req.body });
};

exports.getcourses = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["coursType" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);

  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }

  Cours.countDocuments(filter, function (err, c) {
    count = c;
    let map = new Map([sort]);
    console.log(filter);
    Cours.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `cours ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.coursById = (req, res, next, id) => {
  Cours.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Cours not found" });
    }
    req.cours = data;
    res.json(data.transform());

    next();
  });
};

exports.updateCours = (req, res) => {
  let cours = req.cours;
  cours = _.extend(cours, req.body);
  cours.save((err, cours) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(cours);
  });
};

exports.deleteCours = (req, res) => {
  let cours = req.cours;

  cours.remove((err, cours) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    // res.json({
    //   message: "cours deleted successfully",
    // });
  });
};
