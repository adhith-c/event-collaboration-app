import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Event.css";
import Users from "./Users";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userId, setUserId] = useState(""); // TO Set the user ID

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      console.log("usr", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createEvent = async () => {
    try {
      await axios.post("http://localhost:5000/events", { name: eventName });
      setEventName("");
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const inviteUser = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/events/${eventId}/invite`, {
        userId: selectedUserId,
      });
      setSelectedUserId("");
      fetchEvents();
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };

  const handleInvitationResponse = async (eventId, invitationId, status) => {
    try {
      await axios.post(
        `http://localhost:5000/events/${eventId}/invitations/${invitationId}`,
        { status }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error responding to invitation:", error);
    }
  };

  return (
    <div className="Events">
      <h2>Events</h2>
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <button
        onClick={createEvent}
        className="CreateButton">
        Create Event
      </button>
      <ul>
        {events.map((event) => (
          <li
            key={event._id}
            className="Event">
            <div className="EventName">{event.name}</div>
            <div className="EventActions">
              <div className="InviteDropdown">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}>
                  <option value="">Select a user to invite</option>
                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button
                  className="InviteButton"
                  onClick={() => inviteUser(event._id)}
                  disabled={!selectedUserId}>
                  Invite
                </button>
              </div>
              {event?.invitations?.map((invitation) => (
                <div
                  key={invitation._id}
                  className={`Invitation ${invitation.status}`}>
                  <div className="InvitationInfo">
                    {invitation.user.name} - {invitation.status}
                  </div>
                  {invitation.status === "pending" && (
                    <div className="InvitationActions">
                      <button
                        className="AcceptButton"
                        onClick={() =>
                          handleInvitationResponse(
                            event._id,
                            invitation._id,
                            "accepted"
                          )
                        }>
                        Accept
                      </button>
                      <button
                        className="RejectButton"
                        onClick={() =>
                          handleInvitationResponse(
                            event._id,
                            invitation._id,
                            "rejected"
                          )
                        }>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <Users />
    </div>
  );
};

export default Events;
