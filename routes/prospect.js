const express = require("express");
const {
  getProspectById,
  updateProspect,
  deleteProspect,
  createProspect,
  getProspects,
  getProspectOne,
} = require("../controllers/prospect");

const router = express.Router();
router.post("/inscription", createProspect);
router.get("/prospect", getProspects);
router.get("/prospect/:prosId", getProspectById);
router.put("/prospect/:prosId", updateProspect);
router.delete("/prospect/:prosId", deleteProspect);

router.param("prosId", getProspectOne);
module.exports = router;
