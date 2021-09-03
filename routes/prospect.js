const express = require("express");
const {
  getStudents,
  createStudents,
  getProspectById,
  updateProspect,
  deleteProspect,
} = require("../controllers/prospect");

const router = express.Router();
router.post("/inscription", createStudents);
router.get("/prospect", getStudents);
router.put("/prospect/:prosId", updateProspect);
router.get("/prospect/:prosId", getProspectById);
router.delete("/prospect/:prosId", deleteProspect);

router.param("prosId", getProspectById);
module.exports = router;
