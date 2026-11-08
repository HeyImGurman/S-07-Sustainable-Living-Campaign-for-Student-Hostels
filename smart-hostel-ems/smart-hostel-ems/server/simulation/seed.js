require("dotenv").config();
const connectDB = require("../config/db");
const Room = require("../models/Room");
const User = require("../models/User");
const OccupancyLog = require("../models/OccupancyLog");
const EnergyLog = require("../models/EnergyLog");
const Notification = require("../models/Notification");

const HOSTELS = ["Zakir Hostel", "NC Hostel"];
const FLOORS = [1, 2, 3];
const ROOMS_PER_FLOOR = 4;

async function seed() {
  await connectDB();

  console.log("[seed] Clearing existing data...");
  await Promise.all([
    Room.deleteMany({}),
    OccupancyLog.deleteMany({}),
    EnergyLog.deleteMany({}),
    Notification.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("[seed] Creating rooms...");
  const rooms = [];
  for (const hostel of HOSTELS) {
    const prefix = hostel === "Zakir Hostel" ? "Z" : "NC";
    for (const floor of FLOORS) {
      for (let i = 1; i <= ROOMS_PER_FLOOR; i++) {
        const roomNumber = `${prefix}-${floor}${String(i).padStart(2, "0")}`;
        rooms.push({
          roomNumber,
          hostel,
          floor,
          capacity: 4,
          occupancy: {
            status: Math.random() > 0.4 ? "occupied" : "vacant",
            occupantsDetected: Math.floor(Math.random() * 4) + 1,
            lastMovementAt: new Date(),
          },
          sensor: { model: Math.random() > 0.5 ? "LD2410" : "C1001", status: "online" },
          appliances: [
            { type: "light", label: "Room Light", state: "on", mode: "auto", relayStatus: "active" },
            { type: "fan", label: "Ceiling Fan", state: "on", mode: "auto", relayStatus: "active" },
          ],
          automation: { enabled: true, autoShutdownSeconds: 60 },
          energy: { currentWatts: 0, todayKwh: 0, savedTodayKwh: 0 },
        });
      }
    }
  }
  await Room.insertMany(rooms);

  console.log("[seed] Creating demo user accounts...");
  await User.create([
    {
      name: "Admin User",
      email: "admin@hostel.edu",
      password: "password123",
      role: "admin",
    },
    {
      name: "Maintenance Staff",
      email: "maintenance@hostel.edu",
      password: "password123",
      role: "maintenance",
    },
    {
      name: "Gurmanpreet Singh",
      email: "student@hostel.edu",
      password: "password123",
      role: "student",
      roomNumber: rooms[0].roomNumber,
    },
  ]);

  console.log(`[seed] Done. Created ${rooms.length} rooms across ${HOSTELS.length} hostels.`);
  console.log("[seed] Demo logins:");
  console.log("       admin@hostel.edu / password123 (admin)");
  console.log("       maintenance@hostel.edu / password123 (maintenance)");
  console.log("       student@hostel.edu / password123 (student)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
