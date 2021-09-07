const express = require("express");
const {
  createFormation,
  formationById,
  getFormations,
  updateFormation,
  deleteFormation,
} = require("../controllers/formation");

const router = express.Router();

router.post("/formation", createFormation);
router.get("/formation", getFormations);
router.get("/formation/:formationId", formationById);
router.put("/formation/:formationId", updateFormation);
router.delete("/formation/:formationId", deleteFormation);

router.param("formationId", formationById);
module.exports = router;
