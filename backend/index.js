require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const departmentRoutes = require("./routes/departments");
const employeeRoutes = require("./routes/employees");
const assetRoutes = require("./routes/assets");
const allocationRoutes = require("./routes/allocations");
const statsRoutes = require("./routes/stats");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors()); // allows all origins locally; restrict in production
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "API running" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
