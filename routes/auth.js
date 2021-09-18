const express = require("express");
const {
  signin,
  createUsers,
  signout,
  getUsers,
} = require("../controllers/auth");

const router = express.Router();

router.post("/user", createUsers);
router.get("/user", getUsers);
router.post("/user", signin);
router.get("/user", signout);

module.exports = router;
