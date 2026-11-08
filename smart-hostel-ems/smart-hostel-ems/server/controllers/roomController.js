const Room = require("../models/Room");
const Notification = require("../models/Notification");
const OccupancyLog = require("../models/OccupancyLog");

exports.getRooms = async (req, res) => {
  try {
    const { hostel, status } = req.query;
    const filter = {};
    if (hostel) filter.hostel = hostel;
    if (status) filter["occupancy.status"] = status;

    // Students only see their assigned room, admins/maintenance see all
    if (req.user.role === "student" && req.user.roomNumber) {
      filter.roomNumber = req.user.roomNumber;
    }

    const rooms = await Room.find(filter).sort({ roomNumber: 1 });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: "Failed to load rooms", error: err.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomNumber: req.params.roomNumber });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: "Failed to load room", error: err.message });
  }
};

exports.toggleAppliance = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const { applianceType, state } = req.body; // applianceType: 'light' | 'fan', state: 'on' | 'off'

    const room = await Room.findOne({ roomNumber });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const appliance = room.appliances.find((a) => a.type === applianceType);
    if (!appliance) return res.status(404).json({ message: "Appliance not found" });

    appliance.state = state;
    appliance.mode = "manual";
    appliance.relayStatus = state === "on" ? "active" : "inactive";
    await room.save();

    await Notification.create({
      room: room._id,
      roomNumber: room.roomNumber,
      type: "manual_override",
      message: `${appliance.label} in ${room.roomNumber} manually switched ${state.toUpperCase()} by ${req.user.name}`,
      severity: "info",
    });

    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle appliance", error: err.message });
  }
};

exports.setAutomation = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const { enabled } = req.body;

    const room = await Room.findOne({ roomNumber });
    if (!room) return res.status(404).json({ message: "Room not found" });

    room.automation.enabled = !!enabled;
    if (enabled) {
      room.appliances.forEach((a) => (a.mode = "auto"));
    }
    await room.save();

    await Notification.create({
      room: room._id,
      roomNumber: room.roomNumber,
      type: "manual_override",
      message: `Automation ${enabled ? "enabled" : "disabled"} for ${room.roomNumber} by ${req.user.name}`,
      severity: "info",
    });

    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: "Failed to update automation", error: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const rooms = await Room.find({});
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.occupancy.status === "occupied").length;
    const vacantRooms = totalRooms - occupiedRooms;
    const totalCurrentWatts = rooms.reduce((sum, r) => sum + r.energy.currentWatts, 0);
    const todayKwh = rooms.reduce((sum, r) => sum + r.energy.todayKwh, 0);
    const savedTodayKwh = rooms.reduce((sum, r) => sum + r.energy.savedTodayKwh, 0);
    const sensorOfflineCount = rooms.filter((r) => r.sensor.status === "offline").length;
    const relayFaultCount = rooms.reduce(
      (sum, r) => sum + r.appliances.filter((a) => a.relayStatus === "fault").length,
      0
    );

    res.json({
      totalRooms,
      occupiedRooms,
      vacantRooms,
      totalCurrentWatts: Math.round(totalCurrentWatts),
      todayKwh: Number(todayKwh.toFixed(2)),
      savedTodayKwh: Number(savedTodayKwh.toFixed(2)),
      sensorOfflineCount,
      relayFaultCount,
      activeAlerts: sensorOfflineCount + relayFaultCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load summary", error: err.message });
  }
};

exports.getRoomOccupancyLogs = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const logs = await OccupancyLog.find({ roomNumber }).sort({ createdAt: -1 }).limit(50);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to load logs", error: err.message });
  }
};
