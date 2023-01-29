const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");

router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlacesByUserId);
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").trim().not().isEmpty(),
    check("address").trim().not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  placesControllers.createPlace
);
router.patch(
  "/:pid",
  [
    check("title").trim().not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  placesControllers.updatePlace
);
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
