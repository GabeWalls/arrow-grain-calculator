const express = require('express');
const router = express.Router();
const ArrowBuild = require('../models/ArrowBuild');
const calculateTotalGrains = require('../utils/calculateGrains');

// =============================================
// Route: POST /api/save
// Purpose: Save a new arrow build to MongoDB
// =============================================
router.post('/save', async (req, res) => {
  const { name, components, gpi, arrowLength } = req.body;

  // Basic validation
  if (!name || !Array.isArray(components)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Calculate total grains based on components array
    const totalGrains = calculateTotalGrains(components);

    // Create and save the build document
    const newBuild = new ArrowBuild({
      name,
      components,
      totalGrains,
      gpi,
      arrowLength
    });

    const saved = await newBuild.save();
    res.json({ message: "Build saved", build: saved });
  } catch (err) {
    console.error("Error saving build:", err);
    console.error("Data received:", { name, components, gpi, arrowLength });
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// Route: GET /api/builds
// Purpose: Fetch all saved builds from MongoDB
// =============================================
router.get('/builds', async (req, res) => {
  try {
    const builds = await ArrowBuild.find().sort({ createdAt: -1 }); // newest first
    res.json(builds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// Route: DELETE /api/builds/:id
// Purpose: Delete a specific saved build
// =============================================
router.delete('/builds/:id', async (req, res) => {
  try {
    const result = await ArrowBuild.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Build not found" });
    }
    res.json({ message: "Build deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// Route: PUT /api/builds/:id
// Purpose: Update a specific build
// =============================================
router.put('/builds/:id', async (req, res) => {
  const { name, components, gpi, arrowLength } = req.body;

  if (!name || !Array.isArray(components)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const totalGrains = calculateTotalGrains(components);

    const updated = await ArrowBuild.findByIdAndUpdate(
      req.params.id,
      { name, components, totalGrains, gpi, arrowLength },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Build not found" });
    }

    res.json({ message: "Build updated", build: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// Route: POST /api/calculate
// Purpose: Calculate total grain weight from components
// =============================================
router.post('/calculate', (req, res) => {
  const { components } = req.body;

  console.log('components received:', components);

  if (!Array.isArray(components)) {
    return res.status(400).json({ error: "components must be an array" });
  }

  const total = calculateTotalGrains(components);
  return res.json({ totalGrains: total });
});

module.exports = router;
