const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).render("error", {
      title: "You are not authorized to view this resource.",
    });
  }
};

module.exports = { isAuth };
