const Class = require("../models/class");
const _ = require("lodash");

exports.createClass = async (req, res) => {
  const classExists = await Class.findOne({
    classLabel: req.body.classLabel,
  });

  if (classExists) {
    return res.status(403).json({
      message: "sorry something went worng try again later",
      status: 400,
    });
  }

  // req.body.RegistredAt = mongoose.Types.Date.now();
  const newClass = await new Class(req.body);
  await newClass.save();
  res.status(200).json({ message: newClass });
};

exports.classById = (req, res, next, id) => {
  Class.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "Class not found" });
    }
    req.class = data;
    res.json(data.transform());

    next();
  });
  // res.json({ text: "hello" });
};

exports.getClasses = (req, res) => {
  let range = req.query.range || "[0,9]";
  // let sort = req.query.sort || '["name" , "ASC"]';
  // let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  // sort = JSON.parse(sort);
  // filter = JSON.parse(filter);
  // if (filter.email) {
  //   filter.email = { $regex: ".*" + filter.email + ".*" };
  // }
  // if (filter.name) {
  //   filter.name = { $regex: ".*" + filter.name + ".*" };
  // }
  // if (filter.cin) {
  //   filter.cin = { $regex: ".*" + filter.cin + ".*" };
  // }
  Class.countDocuments(function (err, c) {
    count = c;
  });
  // let map = new Map([sort]);
  Class.find()
    // .sort(Object.fromEntries(map))
    // .skip(range[0])
    // .limit(range[1] + 1 - range[0])
    .then((data) => {
      let formatData = [];
      for (let i = 0; i < data.length; i++) {
        formatData.push(data[i].transform());
      }
      res.set("Content-Range", `class ${range[0]}-${range[1] + 1}/${count}`);
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateClass = (req, res) => {
  let classUpdate = req.class;
  console.log(classUpdate);
  classUpdate = _.extend(classUpdate, req.body);
  console.log(req.body);
  classUpdate.save((err, classUpdate) => {
    // if (err) {
    //   return res.status(403).json({ error: err });
    // }
    // return res.status(200).json(city);
  });
};

exports.deleteClass = (req, res) => {
  let deleteClass = req.class;

  deleteClass.remove((err, deleteClass) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    // res.json({
    //   message: "class deleted successfully",
    // });
  });
};
