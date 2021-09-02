const express = require("express");
const { createCity, getCitys } = require("../controllers/city");
const router = express.Router();
router.post("/createcity", createCity);
router.get("/cities", getCitys);

module.exports = router;
