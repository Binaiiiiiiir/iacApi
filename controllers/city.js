const City = require("../models/city");
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

exports.getCitys = (req, res) => {
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
