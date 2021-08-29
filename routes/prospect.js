const express = require("express");
const {
  getStudents,
  createStudents,
  getProspectById,
  updateProspect,
} = require("../controllers/prospect");

const router = express.Router();
router.post("/inscription", createStudents);
router.get("/prospect", getStudents);
router.put("/prospect/:prosId", updateProspect);

router.param("prosId", getProspectById);
module.exports = router;
