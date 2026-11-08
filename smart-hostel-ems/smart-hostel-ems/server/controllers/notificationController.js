const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const filter = {};
    if (unreadOnly === "true") filter.read = false;
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications", error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification", error: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications", error: err.message });
  }
};
