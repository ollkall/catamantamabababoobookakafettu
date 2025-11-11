const express = require("express");
const router = express.Router();

// kontrollerid
const {
	uudisedHome
} = require("../controllers/uudisedControllers");

router.route("/").get(uudisedHome);

module.exports = router;