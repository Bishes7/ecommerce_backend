import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("Adamghat7", 10),
    isAdmin: true,
  },
  {
    name: "Bijay Bhandari",
    email: "bijay@email.com",
    password: bcrypt.hashSync("Adamghat7", 10),
    isAdmin: false,
  },

  {
    name: "Kiran Lamichhane",
    email: "kiran@email.com",
    password: bcrypt.hashSync("Adamghat7", 10),
    isAdmin: false,
  },
];

export default users;
