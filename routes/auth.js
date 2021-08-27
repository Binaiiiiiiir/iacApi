const express = require("express");
const { signin, createUsers, signout } = require("../controllers/auth");

const router = express.Router();

router.post("/createuser", createUsers);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
