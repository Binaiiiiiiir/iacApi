const _ = require("lodash");const Cash = require("../models/cash");
const mongoose = require("mongoose");
exports.createCash = async (req, res) => {
  const cash = await new Cash(req.body);
  await cash.save();
  res.status(200).json(cash.transform());
};

exports.getCashOne = (req, res, next, id) => {
  Cash.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ id: "", error: "Cash not found" });
    }
    req.cash = data;

    next();
  });
};
exports.getCashById = (req, res) => {
  cash = req.cash;
  if (cash) {
    res.set("Content-Range", `cash 0-1/1`);
    res.json(cash.transform());
  } else res.status(200).json({ id: "", message: "cash not found" });
};

exports.getCashs = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["put somthing here" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  //   if (filter.name) {
  //     filter.name = { $regex: ".*" + filter.name + ".*" };
  //   }
  //   if (filter.email) {
  //     filter.email = { $regex: ".*" + filter.email + ".*" };
  //   }
  //   if (filter.comment) {
  //     filter.comment = { $regex: ".*" + filter.comment + ".*" };
  //   }
  //   if (filter.RegisteredAt) {
  //     let dateStr = new Date(filter.RegisteredAt);
  //     let nextDate = new Date(filter.RegisteredAt);
  //     nextDate.setDate(nextDate.getDate() + 1);
  //     console.log(dateStr, nextDate);
  //     filter.RegisteredAt = {
  //       $gte: new Date(dateStr),
  //       $lte: new Date(nextDate),
  //     };
  //   }
  //   if (filter.cours) {
  //     filter.cours = {
  //       $all: [...filter.cours.map((c) => mongoose.Types.ObjectId(c))],
  //     };
  //   }
  //   if (filter.id) {
  //     filter._id = {
  //       $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
  //     };
  //     delete filter.id;
  //   }
  console.log(filter);

  Cash.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Cash.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        console.log(data.length, range);
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `cash ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.updateCash = (req, res) => {
  let cash = req.cash;
  console.log(cash);
  cash = _.extend(cash, req.body);
  cash.save((err, cash) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(cash.transform());
  });
};

exports.deleteCash = (req, res) => {
  let cash = req.cash;

  cash.remove((err, cash) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    res.json({
      message: "cash deleted successfully",
    });
  });
};
