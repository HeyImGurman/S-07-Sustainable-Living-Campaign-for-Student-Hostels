const mongoose = require("mongoose");

const occupancyLogSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    roomNumber: { type: String, required: true },
    event: {
      type: String,
      enum: ["occupied", "vacant", "sensor_offline", "sensor_online"],
      required: true,
    },
    detail: { type: String, default: "" },
  },
  { timestamps: true }
);

occupancyLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("OccupancyLog", occupancyLogSchema);
