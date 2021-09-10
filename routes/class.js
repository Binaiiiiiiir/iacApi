const express = require("express");
const {
  createClass,
  getClasses,
  classById,
  updateClass,
  deleteClass,
} = require("../controllers/class");

const router = express.Router();

router.post("/classes", createClass);
router.get("/classes", getClasses);
router.get("/classes/:classId", classById);
router.put("/classes/:classId", updateClass);
router.delete("/classes/:classId", deleteClass);

router.param("classId", classById);

module.exports = router;
