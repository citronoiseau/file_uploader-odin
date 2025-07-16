const cloudinary = require("../utils/cloudinary");
const asyncHandler = require("express-async-handler");
const streamifier = require("streamifier");
const FileService = require("../prisma/services/file.service");
const FolderService = require("../prisma/services/folder.service");

class FileController {
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
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload(file.buffer);

    await FileService.addNewFile(
      id,
      file.originalname,
      result.secure_url,
      file.size,
      result.public_id,
      result.resource_type
    );

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

    const file = await FileService.getFileById(fileId);
    if (!file) {
      return res.status(404).send("File not found");
    }

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
    });

    await FileService.deleteFile(fileId);

    res.redirect("/");
  });

  downloadFile = asyncHandler(async (req, res) => {
    const fileId = req.params.fileId;
    const file = await FileService.getFileById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const downloadUrl = cloudinary.url(file.publicId, {
      resource_type: file.resource_type,
      flags: "attachment",
    });

    res.redirect(downloadUrl);
  });
}

module.exports = new FileController();
