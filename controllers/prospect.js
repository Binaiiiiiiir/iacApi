const Prospect = require("../models/prospect");
const Cours = require("../models/cours");
const cours = require("../models/cours");
const { formidable } = require("formidable");
exports.createStudents = async (req, res) => {
  const studentsExists = await Prospect.findOne({ id: req.body.id });
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
  Prospect.find()
    .populate("cours", "id name")

    .then((data) => {
      let formatData = [];
      for (let i = 0; i < data.length; i++) {
        let cours = [];
        for (let j = 0; j < data[i].cours.length; j++) {
          data[i].cours[j] = data[i].cours[j].transform();
        }
        formatData.push(data[i].transform());
      }

      // console.log(formatData[0].cours.length);
      res.set("Content-Range", `0-2/${data.length}`);
      res.status(200).json(formatData);
    })
    .catch((err) => {
      console.log(err);
    });
};
