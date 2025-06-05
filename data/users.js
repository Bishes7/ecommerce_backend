import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@email.com",
    password: bcrypt.hashSync("Adamghat7", 10),
    isAmin: true,
  },
  {
    name: "Bijay Bhandari",
    email: "bijay@email.com",
    password: bcrypt.hashSync("Adamghat7", 10),
    isAmin: false,
  },

  {
    name: "Kiran Lamichhane",
    email: "kiran@email.com",
    password: bcrypt.hashSync("Adamghat7", 10),
    isAmin: false,
  },
];

export default users;
