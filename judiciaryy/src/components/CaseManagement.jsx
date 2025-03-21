import React, { useState, useEffect } from "react";
import axios from "axios";
import "D:/project/judiciaryy/css/CaseManagement.css"; // Import the CSS file

const CaseManagement = () => {
    const [newCaseTitle, setNewCaseTitle] = useState("");
    const [newCaseStatus, setNewCaseStatus] = useState("Open");
    const [selectedJudgeId, setSelectedJudgeId] = useState("");
    const [judges, setJudges] = useState([]);
    const [cases, setCases] = useState([]);
    const [editingCase, setEditingCase] = useState(null);

    // ✅ Fetch Judges & Cases on Load
    useEffect(() => {
        fetchJudges();
        fetchCases();
    }, []);

    const fetchJudges = async () => {
        try {
            const response = await axios.get("http://localhost:5001/judges");
            setJudges(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch judges:", error);
        }
    };

    const fetchCases = async () => {
        try {
            const response = await axios.get("http://localhost:5001/cases");
            setCases(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch cases:", error);
        }
    };

    const handleAddCase = async () => {
        if (!newCaseTitle || !newCaseStatus || !selectedJudgeId) {
            alert("All fields are required!");
            return;
        }

        try {
            await axios.post("http://localhost:5001/cases", {
                case_title: newCaseTitle,
                status: newCaseStatus,
                judge_id: selectedJudgeId,
            });

            alert("✅ Case added successfully!");
            setNewCaseTitle("");
            setSelectedJudgeId("");
            fetchCases(); // Refresh cases
        } catch (err) {
            console.error("❌ Error adding case:", err);
        }
    };

    const handleEditCase = async () => {
        if (!editingCase) return;

        try {
            await axios.put(`http://localhost:5001/cases/${editingCase.case_id}`, {
                case_title: editingCase.case_title,
                status: editingCase.status,
                judge_id: editingCase.judge_id,
            });

            alert("✅ Case updated successfully!");
            setEditingCase(null);
            fetchCases(); // Refresh cases
        } catch (err) {
            console.error("❌ Error updating case:", err);
        }
    };

    const handleDeleteCase = async (case_id) => {
        if (!window.confirm("Are you sure you want to delete this case?")) return;

        try {
            await axios.delete(`http://localhost:5001/cases/${case_id}`);
            alert("✅ Case deleted successfully!");
            fetchCases(); // Refresh cases
        } catch (err) {
            console.error("❌ Error deleting case:", err);
        }
    };

    return (
        <div className="case-management">
            <h2 className="case-management-title">Case Management</h2>

            {/* Add / Edit Form */}
            <div className="case-form">
                <h3>{editingCase ? "Edit Case" : "Add Case"}</h3>
                <input
                    type="text"
                    placeholder="Enter Case Title"
                    value={editingCase ? editingCase.case_title : newCaseTitle}
                    onChange={(e) => 
                        editingCase 
                            ? setEditingCase({ ...editingCase, case_title: e.target.value }) 
                            : setNewCaseTitle(e.target.value)
                    }
                    className="form-input"
                />

                <select
                    value={editingCase ? editingCase.status : newCaseStatus}
                    onChange={(e) => 
                        editingCase 
                            ? setEditingCase({ ...editingCase, status: e.target.value }) 
                            : setNewCaseStatus(e.target.value)
                    }
                    className="form-select"
                >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                    <option value="Dismissed">Dismissed</option>
                </select>

                <select
                    value={editingCase ? editingCase.judge_id : selectedJudgeId}
                    onChange={(e) => 
                        editingCase 
                            ? setEditingCase({ ...editingCase, judge_id: e.target.value }) 
                            : setSelectedJudgeId(e.target.value)
                    }
                    className="form-select"
                >
                    <option value="">Select Judge</option>
                    {judges.map((judge) => (
                        <option key={judge.id} value={judge.id}>
                            {judge.name}
                        </option>
                    ))}
                </select>

                {editingCase ? (
                    <button onClick={handleEditCase} className="form-button">
                        Update Case
                    </button>
                ) : (
                    <button onClick={handleAddCase} className="form-button">
                        Add Case
                    </button>
                )}
            </div>

            {/* Cases Table */}
            <h3 className="cases-list-title">Cases List</h3>
            <table className="cases-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Judge</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((caseItem) => (
                        <tr key={caseItem.case_id}>
                            <td>{caseItem.case_id}</td>
                            <td>{caseItem.case_title}</td>
                            <td>
                                <span className={`status-badge status-${caseItem.status.toLowerCase()}`}>
                                    {caseItem.status}
                                </span>
                            </td>
                            <td>{caseItem.judge_name}</td>
                            <td>
                                <button 
                                    onClick={() => setEditingCase(caseItem)} 
                                    className="action-button edit-button"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteCase(caseItem.case_id)} 
                                    className="action-button delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CaseManagement;