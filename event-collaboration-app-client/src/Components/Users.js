import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post("http://localhost:5000/users", { name: userName });
      setUserName("");
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="Users">
      <h2>Users</h2>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        onClick={createUser}
        className="CreateButton">
        Create User
      </button>
      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            className="User">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
