import React, { useEffect, useState } from "react";
import axios from "axios";
import "D:/project/judiciaryy/css/ReportsDasboard.css"; // Import the CSS file

const ReportsDashboard = () => {
  const [reports, setReports] = useState({
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    pendingCases: 0,
    userActivity: [],
  });

  const [filter, setFilter] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    judgeId: "",
    lawyerId: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async () => {
    try {
      const res = await axios.post("http://localhost:5000/reports/filter", filter);
      setReports(res.data);
    } catch (err) {
      console.error("Error generating report:", err);
    }
  };

  return (
    <div className="reports-dashboard">
      <h2 className="dashboard-title">📊 Reports & Analytics Dashboard</h2>

      {/* Case Statistics */}
      <div className="case-statistics">
        <h3>Case Statistics</h3>
        <div className="statistics-grid">
          <div className="statistic-card">
            <h4>Total Cases</h4>
            <p>{reports.totalCases}</p>
          </div>
          <div className="statistic-card">
            <h4>Active Cases</h4>
            <p>{reports.activeCases}</p>
          </div>
          <div className="statistic-card">
            <h4>Completed Cases</h4>
            <p>{reports.completedCases}</p>
          </div>
          <div className="statistic-card">
            <h4>Pending Cases</h4>
            <p>{reports.pendingCases}</p>
          </div>
        </div>
      </div>

      {/* Filters for Reports */}
      <div className="report-filters">
        <h3>Generate Reports</h3>
        <div className="filter-form">
          <div className="filter-group">
            <label>From:</label>
            <input
              type="date"
              name="dateFrom"
              value={filter.dateFrom}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>To:</label>
            <input
              type="date"
              name="dateTo"
              value={filter.dateTo}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Status:</label>
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button onClick={handleGenerateReport} className="generate-button">
            Generate Report
          </button>
        </div>
      </div>

      {/* User Activity Log */}
      <div className="activity-log">
        <h3>Admin Activity Log</h3>
        <ul className="log-list">
          {reports.userActivity.map((log, index) => (
            <li key={index} className="log-item">
              <span className="log-action">{log.action}</span>
              <span className="log-timestamp">{log.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportsDashboard;