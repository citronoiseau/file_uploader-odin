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
}

module.exports = new FolderService();
