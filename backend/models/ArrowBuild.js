// mongoosem schema 
const mongoose = require('mongoose');

const ArrowBuildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  components: [
    {
      name: String,
      grains: Number
    }
  ],
  totalGrains: Number,
  dateSaved: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ArrowBuild', ArrowBuildSchema);
