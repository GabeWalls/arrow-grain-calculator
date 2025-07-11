const express = require('express');
const router = express.Router();
const calculateTotalGrains = require('../utils/calculateGrains');

const ArrowBuild = require('../models/ArrowBuild'); // ⬅ Add at the top

// save build route
router.post('/save', async (req, res) => {
  const { name, components } = req.body;

  if (!name || !Array.isArray(components)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const totalGrains = calculateTotalGrains(components);

    const newBuild = new ArrowBuild({
      name,
      components,
      totalGrains
    });

    const saved = await newBuild.save();
    res.json({ message: "Build saved", build: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// calculate route
router.post('/calculate', (req, res) => {
  const { components } = req.body;

  if (!Array.isArray(components)) {
    return res.status(400).json({ error: "components must be an array" });
  }

  const total = calculateTotalGrains(components);
  return res.json({ totalGrains: total });
});

module.exports = router;
