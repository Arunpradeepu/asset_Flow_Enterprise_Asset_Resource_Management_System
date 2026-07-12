const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // stored as bcrypt hash, never plain text
    },
    role: {
      type: String,
      enum: ["admin", "asset_manager", "department_head", "employee"],
      default: "employee", // signup always lands here; nothing else is
      // self-assignable from the client
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null, // admin/seed user won't have one; employees get
      // assigned one after signup or by an admin
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);