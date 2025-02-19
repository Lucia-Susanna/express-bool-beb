const express = require("express");
const router = express.Router();
const controller = require("../controllers/bebController");

router.get("/", controller.index);

router.get("/:id", controller.show);

router.post("/", controller.storeHomes)

module.exports = router;
