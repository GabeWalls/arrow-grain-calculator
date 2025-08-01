const express = require('express');
const router = express.Router();
const ArrowBuild = require('../models/ArrowBuild'); //
const calculateTotalGrains = require('../utils/calculateGrains');

// save build route
router.post('/save', async (req, res) => {
  const { name, components } = req.body;

  // Basic validation
  if (!name || !Array.isArray(components)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    // Convert grain values to numbers just in case
    const sanitizedComponents = components.map(comp => ({
      name: comp.name,
      grains: Number(comp.grains)
    }));

    const totalGrains = calculateTotalGrains(sanitizedComponents);

    const newBuild = new ArrowBuild({
      name,
      components: sanitizedComponents,
      totalGrains
    });

    const saved = await newBuild.save();
    res.json({ message: "Build saved", build: saved });
  } catch (err) {
    console.error("❌ Error saving build:", err); 
    console.error("🧪 Data received:", { name, components }); 
    res.status(500).json({ error: err.message });
  }
});

// calculate route
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
