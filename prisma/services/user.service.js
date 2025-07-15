const prisma = require("../../prisma/client");

class UserService {
  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async addUser(email, password) {
    return await prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });
  }
}

module.exports = new UserService();
