const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const { requireAuth, requireRole } = require("../middleware/auth");

// POST /api/assets — admin or asset_manager
router.post("/", requireAuth, requireRole("admin", "asset_manager"), async (req, res) => {
  const { name, category, status, description, purchaseDate, purchasePrice, serialNumber } = req.body;

  if (!name || !category)
    return res.status(400).json({ message: "Name and category are required" });

  const asset = await Asset.create({
    name,
    category,
    status: status || "Available",
    description,
    purchaseDate,
    purchasePrice,
    serialNumber,
  });

  res.status(201).json(asset);
});

// GET /api/assets — any authenticated user
router.get("/", requireAuth, async (req, res) => {
  const assets = await Asset.find().populate("assignedTo", "name email");
  res.json(assets);
});

// GET /api/assets/:id — any authenticated user
router.get("/:id", requireAuth, async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate("assignedTo", "name email");
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json(asset);
});

// PUT /api/assets/:id — admin or asset_manager
router.put("/:id", requireAuth, requireRole("admin", "asset_manager"), async (req, res) => {
  const { name, category, status, description, purchaseDate, purchasePrice, serialNumber } = req.body;

  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  if (name !== undefined) asset.name = name;
  if (category !== undefined) asset.category = category;
  if (status !== undefined) asset.status = status;
  if (description !== undefined) asset.description = description;
  if (purchaseDate !== undefined) asset.purchaseDate = purchaseDate;
  if (purchasePrice !== undefined) asset.purchasePrice = purchasePrice;
  if (serialNumber !== undefined) asset.serialNumber = serialNumber;

  await asset.save();
  res.json(asset);
});

// DELETE /api/assets/:id — admin only
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const asset = await Asset.findByIdAndDelete(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json({ message: "Asset deleted" });
});

module.exports = router;
