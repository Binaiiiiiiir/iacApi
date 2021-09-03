const express = require("express");
const {
  createCours,
  getcourses,
  coursById,
  updateCours,
  deleteCours,
} = require("../controllers/cours");

const router = express.Router();

router.post("/courses", createCours);
router.get("/courses", getcourses);
router.get("/courses/:coursId", coursById);
router.put("/courses/:coursId", updateCours);
router.delete("/courses/:coursId", deleteCours);

router.param("coursId", coursById);

module.exports = router;
