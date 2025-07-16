const { Router } = require("express");
const FolderController = require("../controllers/folderController");
const { isAuth } = require("./authMiddleware");
const FileController = require("../controllers/fileController");
const upload = require("../utils/multerConfig");

const folderRouter = Router();

folderRouter.post("/create", isAuth, FolderController.addFolder);

folderRouter.post("/:id/delete", isAuth, FolderController.deleteFolder);

folderRouter.post("/:id/update", isAuth, FolderController.updateFolder);

folderRouter.post(
  "/:id/upload",
  isAuth,
  upload.single("file"),
  FileController.addNewFile
);

folderRouter.post(
  "/:folderId/:fileId/delete",
  isAuth,
  FileController.deleteFile
);

folderRouter.get(
  "/:folderId/:fileId/download",
  isAuth,
  FileController.downloadFile
);

module.exports = folderRouter;
