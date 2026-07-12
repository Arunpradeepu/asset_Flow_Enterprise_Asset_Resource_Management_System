const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const { requireAuth, requireRole } = require("../middleware/auth");

// POST /api/departments — admin only
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, head, parentDepartment, status } = req.body;

  if (!name)
    return res.status(400).json({ message: "Department name is required" });

  const existing = await Department.findOne({ name: name.trim() });
  if (existing)
    return res.status(409).json({ message: "Department already exists" });

  const department = await Department.create({
    name: name.trim(),
    head: head || null,
    parentDepartment: parentDepartment || null,
    status: status || "Active",
  });

  res.status(201).json(department);
});

// GET /api/departments — any authenticated user
router.get("/", requireAuth, async (req, res) => {
  const departments = await Department.find()
    .populate("head", "name email")
    .populate("parentDepartment", "name");

  res.json(departments);
});

// GET /api/departments/:id — any authenticated user
router.get("/:id", requireAuth, async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate("head", "name email")
    .populate("parentDepartment", "name");

  if (!department)
    return res.status(404).json({ message: "Department not found" });

  res.json(department);
});

module.exports = router;
