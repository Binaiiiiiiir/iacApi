const express = require("express");
const { createCity, getCitys } = require("../controllers/city");
const router = express.Router();
router.post("/createcity", createCity);
router.get("/citys", getCitys);

module.exports = router;
