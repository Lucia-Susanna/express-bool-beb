const express = require("express");
const router = express.Router();
const controller = require("../controllers/bebController");

router.get("/", controller.index);

router.get("/:id", controller.show);

router.put("/:id", controller.update);

router.patch("/:id", controller.updateLikes)

router.post("/:id/reviews", controller.storeReview);

router.post("/", controller.storeHomes);

module.exports = router;
