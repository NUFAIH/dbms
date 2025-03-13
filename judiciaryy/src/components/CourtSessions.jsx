import React, { useState, useEffect } from "react";
import axios from "axios";
import "D:/project/judiciaryy/css/CourtSessions.css"; // Import the CSS file

const CourtSessions = () => {
    const [hearings, setHearings] = useState([]);
    const [cases, setCases] = useState([]);
    const [judges, setJudges] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newCase, setNewCase] = useState({
        case_title: "",
        judge_id: "",
    });

    useEffect(() => {
        fetchHearings();
        fetchCases();
        fetchJudges();
    }, []);

    // ✅ Fetch Hearings
    const fetchHearings = async () => {
        try {
            const response = await axios.get("http://localhost:5002/hearings");
            setHearings(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch hearings:", error);
        }
    };

    // ✅ Fetch Cases
    const fetchCases = async () => {
        try {
            const response = await axios.get("http://localhost:5002/cases");
            setCases(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch cases:", error);
        }
    };

    // ✅ Fetch Judges
    const fetchJudges = async () => {
        try {
            const response = await axios.get("http://localhost:5002/judges");
            setJudges(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch judges:", error);
        }
    };

    // ✅ Add Case (Automatically Schedules Hearing)
    const handleAddCase = async () => {
        if (!newCase.case_title.trim() || !newCase.judge_id) {
            alert("❌ All fields are required!");
            return;
        }

        try {
            await axios.post("http://localhost:5002/cases", newCase);
            alert("✅ Case added and hearing scheduled!");
            setNewCase({ case_title: "", judge_id: "" });
            fetchCases();
            fetchHearings();
        } catch (error) {
            console.error("❌ Error adding case:", error.response?.data || error.message);
        }
    };

    // ✅ Edit Hearing Date & Status
    const handleEditHearing = async (hearing_id, hearing_date, status) => {
        try {
            await axios.put(`http://localhost:5002/hearings/${hearing_id}`, {
                hearing_date,
                status,
            });
            alert("✅ Hearing updated!");
            fetchHearings();
        } catch (error) {
            console.error("❌ Error updating hearing:", error);
        }
    };

    // ✅ Close Case
    const handleCloseCase = async (caseId) => {
        try {
            const response = await fetch(`http://localhost:5002/cases/${caseId}/close`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            console.log("✅ Case closed successfully");
            fetchCases();
        } catch (error) {
            console.error("❌ Error closing case:", error.message);
        }
    };

    return (
        <div className="court-sessions">
            <h2 className="court-sessions-title">📌 Manage Court Cases & Hearings</h2>

            {/* ✅ SEARCH BAR */}
            <input
                type="text"
                placeholder="🔍 Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            {/* ✅ ADD CASE FORM */}
            <div className="add-case-form">
                <h3>➕ Add New Case</h3>
                <input
                    type="text"
                    placeholder="Case Title"
                    value={newCase.case_title}
                    onChange={(e) => setNewCase({ ...newCase, case_title: e.target.value })}
                    className="form-input"
                />
                <select
                    value={newCase.judge_id}
                    onChange={(e) => setNewCase({ ...newCase, judge_id: e.target.value })}
                    className="form-select"
                >
                    <option value="">Select Judge</option>
                    {judges.map((j) => (
                        <option key={j.id} value={j.id}>{j.username}</option>
                    ))}
                </select>
                <button onClick={handleAddCase} className="form-button">
                    Add Case & Schedule Hearing
                </button>
            </div>

            {/* ✅ VIEW CASES */}
            <h3 className="cases-title">📜 Cases</h3>
            <table className="cases-table">
                <thead>
                    <tr>
                        <th>Case Title</th>
                        <th>Judge</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cases
                        .filter((c) => c.case_title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((c) => (
                            <tr key={c.case_id}>
                                <td>{c.case_title}</td>
                                <td>{c.judge_name}</td>
                                <td>
                                    <span className={`status-badge status-${c.status.toLowerCase()}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>
                                    {c.status !== "Closed" && (
                                        <button 
                                            onClick={() => handleCloseCase(c.case_id)} 
                                            className="action-button close-button"
                                        >
                                            ❌ Close Case
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* ✅ VIEW HEARINGS LIST */}
            <h3 className="hearings-title">📜 Scheduled Hearings</h3>
            <table className="hearings-table">
                <thead>
                    <tr>
                        <th>Case Title</th>
                        <th>Judge</th>
                        <th>Hearing Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {hearings.map((hearing) => (
                        <tr key={hearing.hearing_id}>
                            <td>{hearing.case_title}</td>
                            <td>{hearing.judge_name}</td>
                            <td>
                                <input
                                    type="datetime-local"
                                    value={new Date(hearing.hearing_date).toISOString().slice(0, 16)}
                                    onChange={(e) => handleEditHearing(hearing.hearing_id, e.target.value, hearing.status)}
                                    className="date-input"
                                />
                            </td>
                            <td>
                                <select
                                    value={hearing.status}
                                    onChange={(e) => handleEditHearing(hearing.hearing_id, hearing.hearing_date, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourtSessions;