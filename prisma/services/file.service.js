const prisma = require("../../prisma/client");

class FileService {
  async getFileById(id) {
    return await prisma.file.findUnique({
      where: { id: Number(id) },
    });
  }

  async addNewFile(
    folderId,
    fileName,
    fileUrl,
    fileSize,
    publicId,
    resource_type
  ) {
    return await prisma.file.create({
      data: {
        name: fileName,
        url: fileUrl,
        size: fileSize,
        publicId: publicId,
        resource_type: resource_type,
        Folder: {
          connect: { id: Number(folderId) },
        },
      },
    });
  }

  async deleteFile(fileId) {
    return await prisma.file.delete({
      where: { id: Number(fileId) },
    });
  }
}

module.exports = new FileService();
