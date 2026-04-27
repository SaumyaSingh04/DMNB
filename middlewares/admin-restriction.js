const { config } = require("dotenv");
config();

const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

const privateKey = process.env.JWT_PRIVATE_KEY;

const adminRestriction = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const auths = authHeader.split(" ");

  if (auths[0] !== "Bearer") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = auths[1];

  try {
    const decoded = jwt.verify(token, privateKey);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== "Admin" && user.role !== "SuperAdmin") {
      return res.status(403).json({ error: "Unauthorized access to admin" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Admin restriction error" });
  }
};

module.exports = { adminRestriction };
