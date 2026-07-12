const express = require("express");
const router = express.Router();
const AssetRequest = require("../models/AssetRequest");
const Asset = require("../models/Asset");
const { requireAuth, requireRole } = require("../middleware/auth");

// POST /api/requests — employee requests an available asset
router.post("/", requireAuth, async (req, res) => {
  const { asset, reason } = req.body;
  if (!asset) return res.status(400).json({ message: "Asset is required" });

  const assetDoc = await Asset.findById(asset);
  if (!assetDoc) return res.status(404).json({ message: "Asset not found" });
  if (assetDoc.status !== "Available")
    return res.status(400).json({ message: "Asset is not available" });

  // prevent duplicate pending request
  const existing = await AssetRequest.findOne({
    asset,
    requestedBy: req.user.id,
    status: "Pending",
  });
  if (existing)
    return res.status(409).json({ message: "You already have a pending request for this asset" });

  const request = await AssetRequest.create({
    asset,
    requestedBy: req.user.id,
    reason,
  });

  await request.populate([
    { path: "asset", select: "assetTag name category" },
    { path: "requestedBy", select: "name email" },
  ]);

  res.status(201).json(request);
});

// GET /api/requests — admin sees all, employee sees own
router.get("/", requireAuth, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { requestedBy: req.user.id };

  const requests = await AssetRequest.find(filter)
    .populate("asset", "assetTag name category status")
    .populate("requestedBy", "name email")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 });

  res.json(requests);
});

// PATCH /api/requests/:id/status — admin approves or rejects
router.patch("/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status))
    return res.status(400).json({ message: "Status must be Approved or Rejected" });

  const request = await AssetRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "Pending")
    return res.status(400).json({ message: "Request already reviewed" });

  request.status = status;
  request.reviewedBy = req.user.id;
  await request.save();

  // if approved, allocate the asset
  if (status === "Approved") {
    const asset = await Asset.findById(request.asset);
    if (asset && asset.status === "Available") {
      asset.status = "Allocated";
      asset.assignedTo = request.requestedBy;
      await asset.save();
    }
  }

  await request.populate([
    { path: "asset", select: "assetTag name category status" },
    { path: "requestedBy", select: "name email" },
    { path: "reviewedBy", select: "name" },
  ]);

  res.json(request);
});

module.exports = router;
