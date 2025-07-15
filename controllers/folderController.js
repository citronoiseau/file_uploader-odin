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
}

module.exports = new FolderController();
