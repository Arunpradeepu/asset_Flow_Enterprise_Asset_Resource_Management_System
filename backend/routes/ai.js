const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Asset = require("../models/Asset");
const Allocation = require("../models/Allocation");
const User = require("../models/User");
const Department = require("../models/Department");
const { requireAuth } = require("../middleware/auth");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ai/query
router.post("/query", requireAuth, async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const [assets, allocations, employees, departments] = await Promise.all([
      Asset.find().populate("assignedTo", "name email department"),
      Allocation.find()
        .populate("asset", "assetTag name category status")
        .populate({
          path: "employee",
          select: "name email department",
          populate: { path: "department", select: "name" },
        }),
      User.find({ role: { $ne: "admin" } })
        .select("-password")
        .populate("department", "name"),
      Department.find(),
    ]);

    const context = `
You are an assistant for an Enterprise Asset Management system. Answer the user's query based on the data below.
Be concise and present results in a readable format. If showing lists, use plain text with line breaks.

--- ASSETS ---
${JSON.stringify(assets, null, 2)}

--- ALLOCATIONS ---
${JSON.stringify(allocations, null, 2)}

--- EMPLOYEES ---
${JSON.stringify(employees, null, 2)}

--- DEPARTMENTS ---
${JSON.stringify(departments, null, 2)}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "system", content: context },
        { role: "user", content: query },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const answer = completion.choices[0]?.message?.content || "No response from AI.";
    res.json({ answer });
  } catch (err) {
    console.error("AI route error:", err.message);
    res.status(500).json({ message: "AI request failed: " + err.message });
  }
});

module.exports = router;
