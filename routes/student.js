const express = require("express");
const {
  createStudent,
  getStudents,
  studentByIdBy,
  updateStudent,
  deleteStudent,
} = require("../controllers/student");

let router = express.Router();

router.post("/student", createStudent);
router.get("/student", getStudents);
router.get("/student/:studentId", studentByIdBy);
router.put("/student/:studentId", updateStudent);
router.delete("/student/:studentId", deleteStudent);

router.param("studentId", studentByIdBy);

module.exports = router;
