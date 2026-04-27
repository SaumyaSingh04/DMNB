const express = require("express");
const { loginUser, getAllUsers, deleteUser, createAdmin, signup } = require("../controllers/user-controllers.js");
const { superAdminRestriction } = require("../middlewares/superadmin-restriction");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", loginUser);
router.post("/create-admin", superAdminRestriction, createAdmin);
router.get("/all", superAdminRestriction, getAllUsers);
router.delete("/delete", superAdminRestriction, deleteUser);

module.exports = router;
