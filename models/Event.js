const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  invitations: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["pending", "accepted", "rejected"] },
    },
  ],
});

module.exports = mongoose.model("Event", eventSchema);
