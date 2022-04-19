const express = require("express");
const {
  createCash,
  getCashOne,
  getCashById,
  getCashs,
  updateCash,
  deleteCash,
} = require("../controllers/cash");

const router = express.Router();
router.post("/cashs", createCash);
router.get("/cashs", getCashs);
router.get("/cashs/:cashId", getCashById);
router.put("/cashs/:cashId", updateCash);
router.delete("/cashs/:cashId", deleteCash);

router.param("cashId", getCashOne);
module.exports = router;
