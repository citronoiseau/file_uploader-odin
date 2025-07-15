const { Router } = require("express");
const FolderController = require("../controllers/folderController");
const { isAuth } = require("./authMiddleware");

const folderRouter = Router();

folderRouter.post("/create", isAuth, FolderController.addFolder);

folderRouter.post("/:id/delete", isAuth, FolderController.deleteFolder);

folderRouter.post("/:id/update", isAuth, FolderController.updateFolder);

module.exports = folderRouter;
