const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const User = require("../models/User");
const Department = require("../models/Department");
const Allocation = require("../models/Allocation");
const { requireAuth, requireRole } = require("../middleware/auth");

// GET /api/stats — admin only
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const [totalAssets, availableAssets, allocatedAssets, totalEmployees, totalDepartments, activeAllocations] = await Promise.all([
    Asset.countDocuments(),
    Asset.countDocuments({ status: "Available" }),
    Asset.countDocuments({ status: "Allocated" }),
    User.countDocuments({ role: { $ne: "admin" } }),
    Department.countDocuments({ status: "Active" }),
    Allocation.countDocuments({ status: "Allocated" }),
  ]);

  res.json({
    totalAssets,
    availableAssets,
    allocatedAssets,
    totalEmployees,
    totalDepartments,
    activeAllocations,
  });
});

module.exports = router;
