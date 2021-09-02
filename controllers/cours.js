const Cours = require("../models/cours");

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
  Cours.find()
    .sort("-coursType")
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
