// This file defines the Mongoose schema/model for storing arrow builds in MongoDB using Mongoose, which acts as an Object Data Modeling (ODM) layer between Node.js code and the database.
const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['knock','fletching','shaft','insert','tip']
  },
  grains: { type: Number, required: true, min: 0 }
}, { _id: false });

const ArrowBuildSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  components: { type: [ComponentSchema], required: true },
  totalGrains: { type: Number, required: true, min: 0 },
  gpi: { type: Number, required: true, min: 0 },
  arrowLength: { 
    type: Number, 
    required: true, 
    min: 10, 
    max: 40 
  }
}, {
  timestamps: true,         // creates createdAt/updatedAt
  versionKey: false
});

// helpful indexes for perf demos
ArrowBuildSchema.index({ createdAt: -1 });
ArrowBuildSchema.index({ name: 1 });

module.exports = mongoose.model('ArrowBuild', ArrowBuildSchema);

