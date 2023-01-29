const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

router.get("/", usersControllers.getUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").trim().not().isEmpty(),
    check("password").isLength({ min: 5 }),
    check("email").normalizeEmail({ gmail_remove_dots: false }).isEmail(),
  ],
  usersControllers.signUp
);
router.post("/login", usersControllers.login);

module.exports = router;
