const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");

// GET /api/employees — admin only
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const employees = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .populate("department", "name");

  res.json(employees);
});

// PATCH /api/employees/:id/role — admin only
router.patch("/:id/role", requireAuth, requireRole("admin"), async (req, res) => {
  const { role } = req.body;
  const allowedRoles = ["asset_manager", "department_head", "employee"];

  if (!allowedRoles.includes(role))
    return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(", ")}` });

  const user = await User.findById(req.params.id).select("-password");
  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user.role === "admin")
    return res.status(403).json({ message: "Cannot change role of an admin" });

  user.role = role;
  await user.save();

  res.json({ message: "Role updated", user });
});

module.exports = router;
