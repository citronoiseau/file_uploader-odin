const prisma = require("../../prisma/client");

class FolderService {
  async getFolders(userId) {
    return await prisma.folder.findMany({
      where: { userId },
      include: { File: true },
    });
  }

  async getFolderById(id) {
    return await prisma.folder.findUnique({
      where: { id: Number(id) },
    });
  }

  async getFilesByFolderId(folderId) {
    return await prisma.file.findMany({
      where: { folderId: Number(folderId) },
    });
  }
  async addFolder(name, userId) {
    return await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
      },
    });
  }

  async deleteFolder(id) {
    return await prisma.folder.delete({
      where: { id: Number(id) },
    });
  }

  async updateFolder(id, newName) {
    return await prisma.folder.update({
      where: { id: Number(id) },
      data: { name: newName },
    });
  }

  async shareFolder(id, expiresAt) {
    return await prisma.shareLink.create({
      data: {
        folderId: Number(id),
        expiresAt: expiresAt,
      },
    });
  }

  async getSharedFolderById(id) {
    return await prisma.shareLink.findUnique({
      where: { id: id },
      include: { Folder: { include: { File: true } } },
    });
  }
}

module.exports = new FolderService();
