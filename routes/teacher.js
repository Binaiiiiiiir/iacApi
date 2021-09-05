const express = require("express");
const {
  createTeacher,
  teahcerById,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher");

const router = express.Router();
router.post("/teacher", createTeacher);
router.get("/teacher", getTeacher);
router.get("/teacher/:teacherId", teahcerById);
router.put("/teacher/:teacherId", updateTeacher);
router.delete("/teacher/:teacherId", deleteTeacher);

router.param("teacherId", teahcerById);
module.exports = router;
