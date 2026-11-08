const Room = require("../models/Room");
const OccupancyLog = require("../models/OccupancyLog");
const EnergyLog = require("../models/EnergyLog");
const Notification = require("../models/Notification");

// Rough power draw assumptions (watts) used purely for the simulation's energy math
const WATTS = { light: 18, fan: 65 };
const CO2_KG_PER_KWH = 0.82; // grid emission factor used for the "CO2 reduced" estimate

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function pushNotification(io, payload) {
  const notification = await Notification.create(payload);
  io?.emit("notification:new", notification);
  return notification;
}

/**
 * Runs one simulation "tick": randomly evolves occupancy for a handful of rooms,
 * applies auto-shutdown logic, accrues energy usage/savings, and emits realtime
 * updates over Socket.io so the dashboard feels alive without any physical hardware.
 */
async function tick(io) {
  const rooms = await Room.find({});
  const tickSeconds = Number(process.env.SIMULATION_TICK_MS || 5000) / 1000;
  const date = todayStr();
  const hour = new Date().getHours();

  for (const room of rooms) {
    let changed = false;

    // --- Randomly flip a small number of sensors offline / back online ---
    if (Math.random() < 0.004 && room.sensor.status === "online") {
      room.sensor.status = "offline";
      changed = true;
      await pushNotification(io, {
        room: room._id,
        roomNumber: room.roomNumber,
        type: "sensor_failure",
        message: `${room.sensor.model} sensor in ${room.roomNumber} stopped responding`,
        severity: "critical",
      });
    } else if (room.sensor.status === "offline" && Math.random() < 0.05) {
      room.sensor.status = "online";
      changed = true;
    }

    // --- Occupancy state transitions (only if sensor is online) ---
    if (room.sensor.status === "online") {
      const wasOccupied = room.occupancy.status === "occupied";
      const flip = Math.random();

      if (wasOccupied && flip < 0.06) {
        room.occupancy.status = "vacant";
        room.occupancy.occupantsDetected = 0;
        changed = true;
        await OccupancyLog.create({
          room: room._id,
          roomNumber: room.roomNumber,
          event: "vacant",
          detail: "No human presence detected",
        });
        await pushNotification(io, {
          room: room._id,
          roomNumber: room.roomNumber,
          type: "room_vacant",
          message: `${room.roomNumber} became vacant`,
          severity: "info",
        });
      } else if (!wasOccupied && flip < 0.1) {
        room.occupancy.status = "occupied";
        room.occupancy.occupantsDetected = Math.floor(Math.random() * room.capacity) + 1;
        room.occupancy.lastMovementAt = new Date();
        changed = true;
        await OccupancyLog.create({
          room: room._id,
          roomNumber: room.roomNumber,
          event: "occupied",
          detail: `${room.occupancy.occupantsDetected} occupant(s) detected`,
        });
        await pushNotification(io, {
          room: room._id,
          roomNumber: room.roomNumber,
          type: "occupancy_detected",
          message: `Occupancy detected in ${room.roomNumber}`,
          severity: "info",
        });
        // Waking a room back up restores auto appliances
        if (room.automation.enabled) {
          room.appliances.forEach((a) => {
            if (a.mode === "auto") {
              a.state = "on";
              a.relayStatus = "active";
            }
          });
        }
      } else if (wasOccupied) {
        room.occupancy.lastMovementAt = new Date();
      }
    }

    // --- Auto shutdown logic: vacant + automation enabled -> switch off "auto" appliances ---
    const secondsVacant = (Date.now() - new Date(room.occupancy.lastMovementAt).getTime()) / 1000;
    if (
      room.occupancy.status === "vacant" &&
      room.automation.enabled &&
      secondsVacant >= room.automation.autoShutdownSeconds
    ) {
      for (const appliance of room.appliances) {
        if (appliance.mode === "auto" && appliance.state === "on") {
          appliance.state = "off";
          appliance.relayStatus = "inactive";
          changed = true;
          await pushNotification(io, {
            room: room._id,
            roomNumber: room.roomNumber,
            type: "appliance_off",
            message: `${appliance.label} in ${room.roomNumber} auto-switched OFF after inactivity`,
            severity: "info",
          });
        }
      }
    }

    // --- Rare random relay fault, mostly for the maintenance role to react to ---
    if (Math.random() < 0.001) {
      const appliance = room.appliances[Math.floor(Math.random() * room.appliances.length)];
      if (appliance && appliance.relayStatus !== "fault") {
        appliance.relayStatus = "fault";
        changed = true;
        await pushNotification(io, {
          room: room._id,
          roomNumber: room.roomNumber,
          type: "relay_failure",
          message: `Relay fault detected for ${appliance.label} in ${room.roomNumber}`,
          severity: "critical",
        });
      }
    }

    // --- Energy math: sum watts for appliances that are ON, accrue kWh for this tick ---
    const currentWatts = room.appliances.reduce(
      (sum, a) => sum + (a.state === "on" ? WATTS[a.type] || 0 : 0),
      0
    );
    const maxPossibleWatts = room.appliances.reduce((sum, a) => sum + (WATTS[a.type] || 0), 0);
    const kwhUsedTick = (currentWatts * tickSeconds) / 3600 / 1000;
    const kwhSavedTick =
      room.automation.enabled && room.occupancy.status === "vacant"
        ? ((maxPossibleWatts - currentWatts) * tickSeconds) / 3600 / 1000
        : 0;

    room.energy.currentWatts = currentWatts;
    room.energy.todayKwh += kwhUsedTick;
    room.energy.savedTodayKwh += kwhSavedTick;
    changed = true;

    if (kwhUsedTick > 0 || kwhSavedTick > 0) {
      await EnergyLog.findOneAndUpdate(
        { roomNumber: room.roomNumber, date, hour },
        {
          $inc: {
            kwhUsed: kwhUsedTick,
            kwhSaved: kwhSavedTick,
            co2ReducedKg: kwhSavedTick * CO2_KG_PER_KWH,
          },
          $setOnInsert: { room: room._id, roomNumber: room.roomNumber, hostel: room.hostel },
        },
        { upsert: true }
      );
    }

    if (changed) await room.save();
  }

  const updatedRooms = await Room.find({});
  io?.emit("rooms:update", updatedRooms);
}

function startSimulation(io) {
  const intervalMs = Number(process.env.SIMULATION_TICK_MS) || 5000;
  console.log(`[simulation] Starting simulation engine (tick every ${intervalMs}ms)`);
  tick(io).catch((err) => console.error("[simulation] tick error:", err.message));
  return setInterval(() => {
    tick(io).catch((err) => console.error("[simulation] tick error:", err.message));
  }, intervalMs);
}

module.exports = { startSimulation, tick };
