import React, { useEffect, useState } from "react";
import axios from "axios";
import "D:/project/judiciaryy/css/Notifications.css"; // Import the CSS file

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    recipient: "",
    message: "",
    type: "email",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };

  const handleSendNotification = async () => {
    if (!newNotification.recipient || !newNotification.message) {
      alert("Recipient and message are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/notifications/send", newNotification);
      alert("Notification sent successfully!");
      fetchNotifications();
      setNewNotification({ recipient: "", message: "", type: "email" });
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  return (
    <div className="notifications-dashboard">
      <h2 className="dashboard-title">📢 Notifications & Alerts</h2>

      {/* Send Notification Form */}
      <div className="send-notification-section">
        <h3 className="section-title">Send Notification</h3>
        <div className="notification-form">
          <input
            type="text"
            name="recipient"
            placeholder="Enter Email or Phone Number"
            value={newNotification.recipient}
            onChange={handleChange}
            className="form-input"
          />
          <textarea
            name="message"
            placeholder="Enter Notification Message"
            value={newNotification.message}
            onChange={handleChange}
            className="form-textarea"
          />
          <select
            name="type"
            value={newNotification.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <button onClick={handleSendNotification} className="send-button">
            Send Notification
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list-section">
        <h3 className="section-title">Recent Notifications</h3>
        <div className="notifications-grid">
          {notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <div className="notification-header">
                <span className="recipient">{notif.recipient}</span>
                <span className={`notification-type ${notif.type}`}>
                  {notif.type.toUpperCase()}
                </span>
              </div>
              <p className="notification-message">{notif.message}</p>
              <div className="notification-footer">
                <span className="timestamp">{notif.sent_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;