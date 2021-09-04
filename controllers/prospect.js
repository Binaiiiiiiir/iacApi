const Prospect = require("../models/prospect");
const formidable = require("formidable");
const _ = require("lodash");

// exports.getProspectById = (req, res, id, next) => {
//   Prospect.findById(id).exec((err, data) => {
//     if (err) {
//       return res.status(400).json({ error: "Prospect not found" });
//     }
//     req.prospect = data;
//     res.json(data.transform());
//     next();
//   });
// };

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

exports.createStudents = async (req, res) => {
  const studentsExists = await Prospect.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (studentsExists) {
    return res.status(403).json({
      message: "sorry something went worng try again later",
      status: 400,
    });
  }

  const prospect = await new Prospect(req.body);
  await prospect.save();
  res.status(200).json({ message: "operation succeded", status: 200 });
};

exports.getStudents = (req, res) => {
  let range = req.query.range || "[0, 9]";
  let count;
  range = JSON.parse(range);
  Prospect.countDocuments(function (err, c) {
    count = c;
  });
  Prospect.find()
    .skip(range[0])
    .limit(range[1])
    .populate("city", "name")
    .then((data) => {
      let formatData = [];
      // res.set("Content-Range", `0-10/${data.length}`);
      for (let i = 0; i < data.length; i++) {
        // let city = data[i].city.transform();
        // for (let j = 0; j < data[i].cours.length; j++) {
        //   data[i].cours[j] = data[i].cours[j].transform();
        // }
        // data[i].city = city;
        // console.log(city, data[i].city);

        formatData.push(data[i].transform());
      }
      res.set("Content-Range", `prospect ${range[0]}-${range[1]}/${count}`);
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateProspect = (req, res) => {
  let prospect = req.prospect;
  let newProspect = req.body;
  newProspect.city = newProspect.city.id;
  console.log(newProspect);
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
