const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { addUser, getUserByEmail } = require("../prisma/services/user.service");
const bcrypt = require("bcryptjs");

const validateUser = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .custom(async (value) => {
      const user = await getUserByEmail(value);
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const signUp = [
  ...validateUser,
  asyncHandler(async (req, res) => {
    console.log("Received form data:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign_up_form", {
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await addUser(email, hashedPassword);
    res.redirect("/login");
  }),
];

module.exports = { signUp };
