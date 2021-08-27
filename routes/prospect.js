const express = require("express");
const { getStudents, createStudents } = require("../controllers/prospect");

const router = express.Router();
router.post("/inscription", createStudents);
router.get("/prospect", getStudents);

module.exports = router;
