const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
    roomNumber: { type: String, default: null },
    type: {
      type: String,
      enum: [
        "room_vacant",
        "appliance_off",
        "occupancy_detected",
        "sensor_failure",
        "relay_failure",
        "manual_override",
      ],
      required: true,
    },
    message: { type: String, required: true },
    severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
