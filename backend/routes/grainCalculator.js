const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ArrowBuild = require('../models/ArrowBuild');
const calculateTotalGrains = require('../utils/calculateGrains');
const { protect } = require('../middleware/auth');

// helper: clean components and round numbers
function normalizeComponents(components) {
  return components
    .filter(c => c && typeof c.name === 'string')
    .map(c => ({
      name: String(c.name).toLowerCase(),
      grains: Number.isFinite(c.grains) ? Number(c.grains) : 0
    }));
}

// ---------------------- Save ----------------------
router.post('/save', protect, async (req, res) => {
  let { name, components, gpi, arrowLength, buildType, animal } = req.body;
  if (!name || !Array.isArray(components)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  components = normalizeComponents(components);
  const totalGrains = calculateTotalGrains(components);

  try {
    const build = await ArrowBuild.create({
      name: name.trim(),
      components,
      totalGrains,
      gpi,
      arrowLength,
      buildType: buildType || (arrowLength <= 24 ? 'bolt' : 'arrow'),
      animal: animal || null,
      user: req.user.id // Link build to authenticated user
    });
    res.json({ message: 'Build saved', build });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- Get (paginated) ----------------------
// /api/builds?page=1&limit=20&search=term
router.get('/builds', protect, async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 50);
  const search = (req.query.search || '').trim();

  // Only get builds for the authenticated user
  const filter = { user: req.user.id };
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  const skip = (page - 1) * limit;

  try {
    const [items, total] = await Promise.all([
      ArrowBuild.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name components totalGrains gpi arrowLength buildType animal createdAt')
        .lean(),
      ArrowBuild.countDocuments(filter)
    ]);

    res.json({
      items,
      page,
      pageSize: items.length,
      total,
      hasMore: skip + items.length < total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- Get by id (optional) ----------------------
router.get('/builds/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const build = await ArrowBuild.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).lean();
    if (!build) return res.status(404).json({ error: 'Build not found' });
    res.json(build);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- Delete ----------------------
router.delete('/builds/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const result = await ArrowBuild.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!result) return res.status(404).json({ error: 'Build not found' });
    res.json({ message: 'Build deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- Update ----------------------
router.put('/builds/:id', protect, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  let { name, components, gpi, arrowLength, buildType, animal } = req.body;
  if (!name || !Array.isArray(components)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  components = normalizeComponents(components);
  const totalGrains = calculateTotalGrains(components);

  try {
    const updated = await ArrowBuild.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name: name.trim(), components, totalGrains, gpi, arrowLength, buildType, animal },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'Build not found' });
    res.json({ message: 'Build updated', build: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------- Calculate ----------------------
// Public route - no auth required for calculations
router.post('/calculate', (req, res) => {
  const { components } = req.body;
  if (!Array.isArray(components)) {
    return res.status(400).json({ error: 'components must be an array' });
  }
  const totalGrains = calculateTotalGrains(normalizeComponents(components));
  res.json({ totalGrains });
});

module.exports = router;
