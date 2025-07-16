const { Router } = require("express");
const FolderController = require("../controllers/folderController");
const { isAuth } = require("./authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const folderRouter = Router();

folderRouter.post("/create", isAuth, FolderController.addFolder);

folderRouter.post("/:id/delete", isAuth, FolderController.deleteFolder);

folderRouter.post("/:id/update", isAuth, FolderController.updateFolder);

folderRouter.post(
  "/:id/upload",
  isAuth,
  upload.single("file"),
  FolderController.addNewFile
);

folderRouter.post(
  "/:folderId/:fileId/delete",
  isAuth,
  FolderController.deleteFile
);

module.exports = folderRouter;
