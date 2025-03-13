import React, { useEffect, useState } from "react";
import axios from "axios";
import "D:/project/judiciaryy/css/UserManagement.css"; // Import the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "judge" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Error fetching users. Please try again.");
      console.error("Error fetching users:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Handle Create User
  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) {
      setError("Username and password are required.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ username: "", password: "", role: "judge" });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError("Error creating user. Please try again.");
      console.error("Error creating user:", err.response?.data || err.message);
    }
  };

  // 🔹 Handle Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError("Error deleting user. Please try again.");
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };

  return (
    <div className="user-management">
      <h3 className="user-management-title">👥 User Management</h3>

      {/* 🔹 Error Display */}
      {error && <p className="error-message">{error}</p>}

      {/* 🔹 Create User Form */}
      <div className="create-user-form">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="form-input"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="form-select"
        >
          <option value="judge">Judge</option>
          <option value="lawyer">Lawyer</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser} className="form-button">
          Create User
        </button>
      </div>

      {/* 🔹 Display User List */}
      {loading ? (
        <p className="loading-message">Loading users...</p>
      ) : (
        <ul className="user-list">
          {users.length === 0 ? (
            <p className="no-users-message">No users found.</p>
          ) : (
            users.map((user) => (
              <li key={user.id} className="user-item">
                <span className="user-info">
                  {user.username} <span className="user-role">({user.role})</span>
                </span>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;