const express = require("express");
const { createCours, getcourses } = require("../controllers/cours");
const router = express.Router();
router.post("/createcours", createCours);
router.get("/courses", getcourses);

module.exports = router;
