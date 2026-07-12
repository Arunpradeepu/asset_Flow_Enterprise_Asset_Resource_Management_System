const express = require("express");
const router = express.Router();
const Allocation = require("../models/Allocation");
const Asset = require("../models/Asset");
const { requireAuth, requireRole } = require("../middleware/auth");

// POST /api/allocations — allocate an asset to an employee
router.post("/", requireAuth, requireRole("admin", "asset_manager"), async (req, res) => {
  const { asset, employee, allocationDate, notes } = req.body;

  if (!asset || !employee)
    return res.status(400).json({ message: "Asset and employee are required" });

  // check asset exists and is available
  const assetDoc = await Asset.findById(asset);
  if (!assetDoc)
    return res.status(404).json({ message: "Asset not found" });
  if (assetDoc.status === "Allocated")
    return res.status(400).json({ message: "Asset is already allocated" });

  const allocation = await Allocation.create({
    asset,
    employee,
    allocationDate: allocationDate || Date.now(),
    notes,
  });

  // flip asset status and set assignedTo
  assetDoc.status = "Allocated";
  assetDoc.assignedTo = employee;
  await assetDoc.save();

  await allocation.populate([
    { path: "asset", select: "assetTag name category" },
    { path: "employee", select: "name email department", populate: { path: "department", select: "name" } },
  ]);

  res.status(201).json(allocation);
});

// GET /api/allocations — list all allocations
router.get("/", requireAuth, async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const allocations = await Allocation.find(filter)
    .populate("asset", "assetTag name category")
    .populate({
      path: "employee",
      select: "name email department",
      populate: { path: "department", select: "name" },
    })
    .sort({ allocationDate: -1 });

  res.json(allocations);
});

// PUT /api/allocations/:id — edit or return an asset
router.put("/:id", requireAuth, requireRole("admin", "asset_manager"), async (req, res) => {
  const { returnDate, status, notes } = req.body;

  const allocation = await Allocation.findById(req.params.id);
  if (!allocation)
    return res.status(404).json({ message: "Allocation not found" });

  if (returnDate !== undefined) allocation.returnDate = returnDate;
  if (notes !== undefined) allocation.notes = notes;

  // if marking as returned, flip the asset back to available
  if (status === "Returned" && allocation.status !== "Returned") {
    allocation.status = "Returned";
    allocation.returnDate = allocation.returnDate || new Date();

    await Asset.findByIdAndUpdate(allocation.asset, {
      status: "Available",
      assignedTo: null,
    });
  }

  await allocation.save();

  await allocation.populate([
    { path: "asset", select: "assetTag name category" },
    { path: "employee", select: "name email department", populate: { path: "department", select: "name" } },
  ]);

  res.json(allocation);
});

// DELETE /api/allocations/:id — admin only
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const allocation = await Allocation.findById(req.params.id);
  if (!allocation)
    return res.status(404).json({ message: "Allocation not found" });

  // if still allocated, free up the asset
  if (allocation.status === "Allocated") {
    await Asset.findByIdAndUpdate(allocation.asset, {
      status: "Available",
      assignedTo: null,
    });
  }

  await allocation.deleteOne();
  res.json({ message: "Allocation deleted" });
});

module.exports = router;
