import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "D:/project/judiciaryy/css/AdminProfile.css"; // Import the CSS file

const AdminProfile = () => {
  const [admin, setAdmin] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use React Router for navigation

  useEffect(() => {
    fetchAdminProfile();
    fetchLoginHistory();
  }, []);

  // 🔹 Fetch Admin Profile
  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
    } catch (err) {
      console.error("Error fetching admin profile:", err.response?.data || err.message);
    }
  };

  // 🔹 Fetch Login History
  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/admin/login-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoginHistory(res.data);
    } catch (err) {
      console.error("Error fetching login history:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Profile Change
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // 🔹 Update Profile
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/admin/profile/update", admin, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("❌ Failed to update profile.");
    }
  };

  // 🔹 Change Password
  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/admin/password/change", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err.message);
      alert("❌ Failed to change password.");
    }
  };

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect using React Router
  };

  return (
    <div className="admin-profile">
      <h2 className="dashboard-title">👤 Admin Profile</h2>

      {/* Profile Update */}
      <div className="profile-section">
        <h3 className="section-title">Update Profile</h3>
        <div className="profile-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={admin.username}
              onChange={handleChange}
              placeholder="Username"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-input"
            />
          </div>
          <button onClick={updateProfile} className="form-button">
            Update Profile
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="password-section">
        <h3 className="section-title">Change Password</h3>
        <div className="password-form">
          <div className="form-group">
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old Password"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="form-input"
            />
          </div>
          <button onClick={changePassword} className="form-button">
            Change Password
          </button>
        </div>
      </div>

      {/* Login History */}
      <div className="login-history-section">
        <h3 className="section-title">📜 Login History</h3>
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : (
          <ul className="login-history-list">
            {loginHistory.length === 0 ? (
              <p className="no-history-message">No login history found.</p>
            ) : (
              loginHistory.map((log, index) => (
                <li key={index} className="login-history-item">
                  <span className="timestamp">{log.timestamp}</span>
                  <span className="ip">{log.ip}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default AdminProfile; 