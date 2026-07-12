const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      unique: true,
      // auto-generated in pre-save hook
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Laptop", "Desktop", "Monitor", "Phone", "Tablet", "Printer", "Other"],
    },
    status: {
      type: String,
      enum: ["Available", "Allocated", "Under Maintenance", "Retired"],
      default: "Available",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    purchasePrice: {
      type: Number,
      default: null,
    },
    serialNumber: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-generate assetTag before saving
assetSchema.pre("save", async function () {
  if (!this.assetTag) {
    const lastAsset = await mongoose
      .model("Asset")
      .findOne()
      .sort({ createdAt: -1 })
      .select("assetTag");

    let nextNum = 1;
    if (lastAsset && lastAsset.assetTag) {
      const match = lastAsset.assetTag.match(/AST-(\d+)/);
      if (match) nextNum = parseInt(match[1], 10) + 1;
    }

    this.assetTag = `AST-${String(nextNum).padStart(3, "0")}`;
  }
});

module.exports = mongoose.model("Asset", assetSchema);
