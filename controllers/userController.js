const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const UserService = require("../prisma/services/user.service");
const bcrypt = require("bcryptjs");

class UsersController {
  validateUser = [
    body("email")
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (value) => {
        const user = await UserService.getUserByEmail(value);
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

  signUp = [
    ...this.validateUser,
    asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("sign_up_form", {
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserService.addUser(email, hashedPassword);
      res.redirect("/login");
    }),
  ];
}

module.exports = new UsersController();
