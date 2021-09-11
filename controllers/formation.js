const _ = require("lodash");
const Formation = require("../models/formation");

exports.createFormation = async (req, res) => {
  const formationExists = await Formation.findOne({ label: req.body.label });
  if (formationExists) {
    return res.status(403).json({
      error: "Formation exist",
    });
  }

  const formation = await new Formation(req.body);
  await formation.save();
  res.status(200).json({ message: req.body });
};

exports.formationById = (req, res, next, id) => {
  Formation.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Formation not found" });
    }
    req.formation = data;
    res.json(data.transform());

    next();
  });
  // res.json({ text: "hello" });
};

exports.getFormations = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["coursType" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.label) {
    filter.label = { $regex: ".*" + filter.label + ".*" };
  }
  if (filter.description) {
    filter.description = { $regex: ".*" + filter.description + ".*" };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }
  Formation.countDocuments(function (err, c) {
    count = c;
  });
  let map = new Map([sort]);
  Formation.find(filter)
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
        `formatiom ${range[0]}-${range[1] + 1}/${count}`
      );
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateFormation = (req, res) => {
  let formation = req.formation;
  formation = _.extend(formation, req.body);
  formation.save((err, formation) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(formations);
  });
};

exports.deleteFormation = (req, res) => {
  let formation = req.formation;

  formation.remove((err, formation) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    // res.json({
    //   message: "formation deleted successfully",
    // });
  });
};
