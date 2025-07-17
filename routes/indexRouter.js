const { Router } = require("express");
const passport = require("passport");
const UserController = require("../controllers/userController");
const FolderController = require("../controllers/folderController");
const { getFolders } = require("../prisma/services/folder.service");
const formatSize = require("../utils/formatSize");

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const folders = await getFolders(req.user.id);
    return res.render("index", {
      user: req.user,
      folders,
      formatSize,
    });
  }

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

indexRouter.post("/sign-up", UserController.signUp);
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

indexRouter.get("/share/:token", FolderController.getSharedFolder);

module.exports = indexRouter;
