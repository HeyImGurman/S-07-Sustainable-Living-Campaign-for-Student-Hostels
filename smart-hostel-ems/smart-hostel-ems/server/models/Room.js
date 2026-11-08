const mongoose = require("mongoose");

const applianceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["light", "fan"], required: true },
    label: { type: String, required: true },
    state: { type: String, enum: ["on", "off"], default: "off" },
    mode: { type: String, enum: ["auto", "manual"], default: "auto" },
    relayStatus: { type: String, enum: ["active", "inactive", "fault"], default: "inactive" },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    hostel: { type: String, enum: ["Zakir Hostel", "NC Hostel"], required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, default: 4 },
    occupancy: {
      status: { type: String, enum: ["occupied", "vacant"], default: "vacant" },
      occupantsDetected: { type: Number, default: 0 },
      lastMovementAt: { type: Date, default: Date.now },
    },
    sensor: {
      model: { type: String, enum: ["LD2410", "C1001"], default: "LD2410" },
      status: { type: String, enum: ["online", "offline"], default: "online" },
    },
    appliances: { type: [applianceSchema], default: [] },
    automation: {
      enabled: { type: Boolean, default: true },
      autoShutdownSeconds: { type: Number, default: 60 },
    },
    energy: {
      currentWatts: { type: Number, default: 0 },
      todayKwh: { type: Number, default: 0 },
      savedTodayKwh: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
