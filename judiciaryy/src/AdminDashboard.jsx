import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserManagement from "./components/UserManagement";
import CaseManagement from "./components/CaseManagement";
import CourtSessions from "./components/CourtSessions";
import ReportsDashboard from "./components/ReportsDashboard";
import Documents from "./components/Documents";
import Notifications from "./components/Notifications";
import AdminProfile from "./components/AdminProfile";
import "../css/AdminDashboard.css"; // Import the updated CSS file

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Admin Dashboard</h1>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/admin-dashboard/users">
                <i className="fas fa-users"></i> User Management
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/cases">
                <i className="fas fa-folder-open"></i> Case Management
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/sessions">
                <i className="fas fa-gavel"></i> Court Sessions
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/reports">
                <i className="fas fa-chart-bar"></i> Reports
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/documents">
                <i className="fas fa-file-alt"></i> Documents
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/notifications">
                <i className="fas fa-bell"></i> Notifications
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/profile">
                <i className="fas fa-user-cog"></i> Admin Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="cases" element={<CaseManagement />} />
          <Route path="sessions/*" element={<CourtSessions />}>
            <Route path="cases" element={<CaseManagement />} />
          </Route>
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;