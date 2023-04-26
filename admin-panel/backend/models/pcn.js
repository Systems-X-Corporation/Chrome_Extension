const mongoose = require('mongoose');

const pcnSchema = new mongoose.Schema({
  Pcn: {
    type: String,
    required: true
  },
  Token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PCN = mongoose.model('PCN', pcnSchema);

module.exports = PCN;