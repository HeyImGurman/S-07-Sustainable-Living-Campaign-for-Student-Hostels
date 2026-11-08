const mongoose = require("mongoose");

const energyLogSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    hostel: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD, for daily aggregation
    hour: { type: Number, required: true }, // 0-23
    kwhUsed: { type: Number, default: 0 },
    kwhSaved: { type: Number, default: 0 },
    co2ReducedKg: { type: Number, default: 0 },
  },
  { timestamps: true }
);

energyLogSchema.index({ date: 1, roomNumber: 1 });

module.exports = mongoose.model("EnergyLog", energyLogSchema);
