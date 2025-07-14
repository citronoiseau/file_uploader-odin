const prisma = require("../../prisma/client");

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}
async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

async function addUser(email, password) {
  return await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });
}
module.exports = {
  getUserByEmail,
  getUserById,
  addUser,
};
