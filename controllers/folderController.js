const asyncHandler = require("express-async-handler");
const FolderService = require("../prisma/services/folder.service");

class FolderController {
  addFolder = asyncHandler(async (req, res) => {
    const user = res.locals.user;
    const { name } = req.body;

    await FolderService.addFolder(name, user.id);
    res.redirect("/");
  });

  deleteFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const folder = await FolderService.getFolderById(id);
    const userId = res.locals.user.id;

    if (!folder) {
      return res.status(404).send("Folder not found");
    }
    if (folder.userId !== userId) {
      return res.status(403).send("Forbidden: You do not own this folder");
    }

    await FolderService.deleteFolder(id);
    res.redirect("/");
  });

  updateFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = res.locals.user.id;
    const folder = await FolderService.getFolderById(id);

    if (!folder) {
      return res.status(404).send("Folder not found");
    }
    if (folder.userId !== userId) {
      return res.status(403).send("Forbidden: You do not own this folder");
    }

    await FolderService.updateFolder(id, name);
    res.redirect("/");
  });

  addNewFile = asyncHandler(async (req, res) => {
    const { id } = req.params; // folderId
    const userId = res.locals.user.id;
    const folder = await FolderService.getFolderById(id);
    const file = req.file;

    if (!folder) {
      return res.status(404).send("Folder not found");
    }
    if (folder.userId !== userId) {
      return res.status(403).send("Forbidden: You do not own this folder");
    }
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    await FolderService.addNewFile(id, file.originalname, file.path, file.size);

    res.redirect("/");
  });

  deleteFile = asyncHandler(async (req, res) => {
    const { folderId, fileId } = req.params;
    const userId = res.locals.user.id;

    const folder = await FolderService.getFolderById(folderId);

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    if (folder.userId !== userId) {
      return res.status(403).send("Forbidden: You do not own this folder");
    }

    await FolderService.deleteFile(fileId);

    res.redirect("/");
  });
}

module.exports = new FolderController();
