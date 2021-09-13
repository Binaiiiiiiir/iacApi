const express = require("express");
const {
  getProspectById,
  updateProspect,
  deleteProspect,
  createProspect,
  getProspecs,
  getProspectOne,
} = require("../controllers/prospect");

const router = express.Router();
router.post("/inscription", createProspect);
router.get("/prospect", getProspecs);
router.put("/prospect/:prosId", updateProspect);
router.get("/prospect/:prosId", getProspectById);
router.delete("/prospect/:prosId", deleteProspect);

router.param("prosId", getProspectOne);
module.exports = router;
