// This file defines the Mongoose schema/model for storing arrow builds in MongoDB using Mongoose.
const mongoose = require('mongoose');

const COMPONENT_NAMES = ['knock', 'fletching', 'shaft', 'insert', 'tip'];

const ComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: COMPONENT_NAMES,
    },
    grains: {
      type: Number,
      required: true,
      min: [0, 'Component grains must be >= 0'],
    },
  },
  { _id: false }
);

const ArrowBuildSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    components: {
      type: [ComponentSchema],
      required: true,
      validate: [
        {
          // ensure unique component names (no duplicates like two "tip"s)
          validator(arr) {
            const names = arr.map((c) => c.name);
            return new Set(names).size === names.length;
          },
          message: 'Duplicate component names are not allowed.',
        },
        {
          // ensure only allowed component names are present (extra safety)
          validator(arr) {
            return arr.every((c) => COMPONENT_NAMES.includes(c.name));
          },
          message: 'Invalid component name detected.',
        },
      ],
    },
    // Auto-computed in pre-validate; not required from client
    totalGrains: { type: Number, min: 0, default: 0 },

    gpi: { type: Number, required: true, min: 0 },
    arrowLength: { type: Number, required: true, min: 10, max: 40 },
    buildType: { type: String, enum: ['arrow', 'bolt'], default: 'arrow' },
    animal: { type: String, enum: ['deer', 'elk', 'bear', 'moose', 'turkey', 'hogs', 'caribou', null], default: null },
  },
  {
    timestamps: true, // creates createdAt/updatedAt
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);



// --- Auto-compute totalGrains from components for robustness ---
function calcTotalGrains(components = []) {
  return components.reduce((sum, c) => sum + (Number(c.grains) || 0), 0);
}

// Compute on validate/save so client doesn't need to send totalGrains
ArrowBuildSchema.pre('validate', function computeTotals() {
  this.totalGrains = calcTotalGrains(this.components);
});

// helpful indexes for perf demos
ArrowBuildSchema.index({ createdAt: -1 });
ArrowBuildSchema.index({ name: 1 });

module.exports = mongoose.model('ArrowBuild', ArrowBuildSchema);
