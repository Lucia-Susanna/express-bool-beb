const express = require("express");
const router = express.Router();
const controller = require("../controllers/bebController");
const upload = require("../middlewares/multer")

router.get("/", controller.index);

router.get("/:id", controller.show);

router.patch("/:id", controller.updateLikes);

router.post("/:id/reviews", controller.storeReview);

router.post("/", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'foto', maxCount: 1 }]), controller.storeHomes);

module.exports = router;
