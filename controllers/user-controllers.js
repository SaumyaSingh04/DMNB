const { config } = require("dotenv");
config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
// TODO: Integrate user restaurant creation
const { Restaurant } = require("../models/restaurant.model");

const privateKey = process.env.JWT_PRIVATE_KEY;

const signJwt = (payload) => {
  return jwt.sign(payload, privateKey);
};

const createUser = async (req, res) => {
  const { email, password, role, restaurantId } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Please enter valid email, password or role" });
  }

  try {
    if (!restaurantId) {
      console.log("User is not registered in any restaurant");
    }

    const hashedPassword = bcrypt.hashSync(password, 10, (err, hash) => {
      if (err) {
        return console.log(err);
      }

      return hash;
    });

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({ token: signJwt(payload) });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    return res.status(202).json({ token: signJwt(payload) });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ data: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const signup = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "email, password and role are required" });
  }

  if (role !== "Admin" && role !== "User") {
    return res.status(400).json({ error: "role must be Admin or User" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    const payload = { userId: user._id, email: user.email, role: user.role };
    res.status(201).json({ token: signJwt(payload) });
  } catch {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

const createAdmin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "email, password and role are required" });
  }

  if (role !== "Admin" && role !== "SuperAdmin") {
    return res.status(400).json({ error: "role must be Admin or SuperAdmin" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    res.status(201).json({ message: `${role} created`, email: user.email });
  } catch (error) {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

module.exports = { createUser, loginUser, getAllUsers, deleteUser, createAdmin, signup };
