require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("./models/user.model");

const email = process.argv[2];
const password = process.argv[3];
const role = process.argv[4] === "superadmin" ? "SuperAdmin" : "Admin";

if (!email || !password) {
  console.error("Usage: node create-admin.js <email> <password> [superadmin]");
  process.exit(1);
}

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URL);

  const existing = await User.findOne({ email });
  if (existing) {
    console.error("User with this email already exists.");
    process.exit(1);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const admin = await User.create({ email, password: hashedPassword, role });

  console.log(`${role} created: ${admin.email}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
