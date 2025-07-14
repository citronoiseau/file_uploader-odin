const { Router } = require("express");
const passport = require("passport");
const indexRouter = Router();
const { signUp } = require("../controllers/usersController");

indexRouter.get("/", (req, res, next) => {
  res.render("index");
});

indexRouter.get("/login", (req, res, next) => {
  res.render("login_form");
});

indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

indexRouter.post("/sign-up", signUp);
indexRouter.get("/sign-up", (req, res, next) => {
  res.render("sign_up_form");
});

indexRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = indexRouter;
