const City = require("../models/city");
const _ = require("lodash");

exports.createCity = async (req, res) => {
  const coursExists = await City.findOne({ name: req.body.name });
  if (coursExists) {
    return res.status(403).json({
      error: "City exist",
    });
  }

  const city = await new City(req.body);
  await city.save();
  res.status(200).json({ message: req.body });
};

exports.cityById = (req, res, next, id) => {
  City.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "City not found" });
    }
    req.city = data;
    res.json(data.transform());

    next();
  });
  // res.json({ text: "hello" });
};

exports.getCities = (req, res) => {
  City.find()
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

exports.updateCity = (req, res) => {
  let city = req.city;
  city = _.extend(city, req.body);
  city.save((err, city) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(city);
  });
};

exports.deleteCity = (req, res) => {
  let city = req.city;

  city.remove((err, city) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    res.json({
      message: "city deleted successfully",
    });
  });
};
