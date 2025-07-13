const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const indexRouter = require("./routes/indexRouter");
const prisma = require("../../prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
require("dotenv").config();
require("./controllers/passport");

const app = express();
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log(`app listening on port ${PORT}!`));

app.use((req, res) => {
  res.status(404).render("error", { title: "Page not found" });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
