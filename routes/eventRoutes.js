const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
//create new event
router.post("/", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
});

//get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("collaborators");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// Invite a user to an event
router.post("/:eventId/invite", async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $push: { invitations: { user: userId, status: "pending" } } },
      { new: true }
    );

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error inviting user", error });
  }
});

// Accept or reject an invitation
router.post("/:eventId/invitations/:invitationId", async (req, res) => {
  const { eventId, invitationId } = req.params;
  const { status } = req.body;

  try {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, "invitations._id": invitationId },
      { $set: { "invitations.$.status": status } },
      { new: true }
    );

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating invitation status", error });
  }
});

module.exports = router;
