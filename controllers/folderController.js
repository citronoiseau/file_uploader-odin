const asyncHandler = require("express-async-handler");
const FolderService = require("../prisma/services/folder.service");
const cloudinary = require("../utils/cloudinary");
const formatSize = require("../utils/formatSize");

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

    const files = await FolderService.getFilesByFolderId(id);

    for (const file of files) {
      try {
        await cloudinary.uploader.destroy(file.publicId, {
          resource_type: file.resource_type,
        });
      } catch (error) {
        console.error(
          `Failed to delete Cloudinary file ${file.publicId}:`,
          error
        );
      }
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

  shareFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;
    const userId = res.locals.user.id;
    const folder = await FolderService.getFolderById(id);

    if (!folder) {
      return res.status(404).send("Folder not found");
    }
    if (folder.userId !== userId) {
      return res.status(403).send("Forbidden: You do not own this folder");
    }
    const expiresAt = new Date(
      Date.now() + Number(duration) * 24 * 60 * 60 * 1000
    );
    const shareLink = await FolderService.shareFolder(id, expiresAt);

    const fullUrl = `${req.protocol}://${req.get("host")}/share/${
      shareLink.id
    }`;

    res.render("share_link", { url: fullUrl });
  });

  getSharedFolder = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const shareLink = await FolderService.getSharedFolderById(token);

    if (!shareLink) {
      return res.status(404).send("Link not found");
    }

    if (new Date() > shareLink.expiresAt) {
      return res.status(410).send("This link has expired");
    }

    res.render("folders/shared_folder", {
      folder: shareLink.Folder,
      formatSize,
    });
  });
}

module.exports = new FolderController();
