const express = require('express');
const router = express.Router();
const calculateTotalGrains = require('../utils/calculateGrains');

router.post('/calculate', (req, res) => {
  const { components } = req.body;

  if (!Array.isArray(components)) {
    return res.status(400).json({ error: "components must be an array" });
  }

  const total = calculateTotalGrains(components);
  return res.json({ totalGrains: total });
});

module.exports = router;
