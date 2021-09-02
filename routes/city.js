const express = require("express");
const { createCity, getCities } = require("../controllers/city");
const router = express.Router();
router.post("/cities", createCity);
router.get("/cities", getCities);

module.exports = router;
