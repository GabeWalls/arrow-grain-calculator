// mongoose schema 
const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grains: { type: Number, required: true }
});

const ArrowBuildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  components: [ComponentSchema],
  totalGrains: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ArrowBuild', ArrowBuildSchema);

