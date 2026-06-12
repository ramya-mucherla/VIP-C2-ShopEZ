const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
