const EnergyLog = require("../models/EnergyLog");
const Room = require("../models/Room");

function lastNDates(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

exports.getDailyUsage = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;
    const dates = lastNDates(days);

    const logs = await EnergyLog.aggregate([
      { $match: { date: { $in: dates } } },
      {
        $group: {
          _id: "$date",
          kwhUsed: { $sum: "$kwhUsed" },
          kwhSaved: { $sum: "$kwhSaved" },
          co2ReducedKg: { $sum: "$co2ReducedKg" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const byDate = Object.fromEntries(logs.map((l) => [l._id, l]));
    const series = dates.map((date) => ({
      date,
      kwhUsed: Number((byDate[date]?.kwhUsed || 0).toFixed(2)),
      kwhSaved: Number((byDate[date]?.kwhSaved || 0).toFixed(2)),
      co2ReducedKg: Number((byDate[date]?.co2ReducedKg || 0).toFixed(2)),
    }));

    res.json({ series });
  } catch (err) {
    res.status(500).json({ message: "Failed to load daily usage", error: err.message });
  }
};

exports.getHourlyUsage = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const logs = await EnergyLog.aggregate([
      { $match: { date } },
      {
        $group: {
          _id: "$hour",
          kwhUsed: { $sum: "$kwhUsed" },
          kwhSaved: { $sum: "$kwhSaved" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const byHour = Object.fromEntries(logs.map((l) => [l._id, l]));
    const series = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      kwhUsed: Number((byHour[hour]?.kwhUsed || 0).toFixed(2)),
      kwhSaved: Number((byHour[hour]?.kwhSaved || 0).toFixed(2)),
    }));
    res.json({ date, series });
  } catch (err) {
    res.status(500).json({ message: "Failed to load hourly usage", error: err.message });
  }
};

exports.getTopConsumingRooms = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const days = Number(req.query.days) || 7;
    const dates = lastNDates(days);

    const rows = await EnergyLog.aggregate([
      { $match: { date: { $in: dates } } },
      {
        $group: {
          _id: "$roomNumber",
          hostel: { $first: "$hostel" },
          kwhUsed: { $sum: "$kwhUsed" },
        },
      },
      { $sort: { kwhUsed: -1 } },
      { $limit: limit },
    ]);

    res.json({
      rooms: rows.map((r) => ({
        roomNumber: r._id,
        hostel: r.hostel,
        kwhUsed: Number(r.kwhUsed.toFixed(2)),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load top consuming rooms", error: err.message });
  }
};

exports.getOccupancyStats = async (req, res) => {
  try {
    const rooms = await Room.find({});
    const byHostel = {};
    rooms.forEach((r) => {
      byHostel[r.hostel] = byHostel[r.hostel] || { occupied: 0, vacant: 0, total: 0 };
      byHostel[r.hostel].total += 1;
      byHostel[r.hostel][r.occupancy.status] += 1;
    });
    res.json({ byHostel });
  } catch (err) {
    res.status(500).json({ message: "Failed to load occupancy stats", error: err.message });
  }
};
