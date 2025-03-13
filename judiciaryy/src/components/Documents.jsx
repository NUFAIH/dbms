import React, { useEffect, useState } from "react";
import axios from "axios";
import "D:/project/judiciaryy/css/DocumentsDashboard.css"; // Import the CSS file

const DocumentsDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caseId, setCaseId] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !caseId) {
      alert("Please select a file and enter a case ID.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caseId", caseId);

    try {
      await axios.post("http://localhost:5000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      fetchDocuments();
      setSelectedFile(null);
      setCaseId("");
    } catch (err) {
      console.error("Error uploading document:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/documents/${id}`);
      alert("Document deleted successfully!");
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  return (
    <div className="documents-dashboard">
      <h2 className="dashboard-title">📂 Document Management</h2>

      {/* File Upload */}
      <div className="upload-section">
        <h3>Upload Document</h3>
        <div className="upload-form">
          <input
            type="text"
            placeholder="Enter Case ID"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="form-input"
          />
          <input type="file" onChange={handleFileChange} className="file-input" />
          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
        </div>
      </div>

      {/* List of Documents */}
      <div className="documents-list">
        <h3>Uploaded Documents</h3>
        <ul className="document-items">
          {documents.map((doc) => (
            <li key={doc.id} className="document-item">
              <div className="document-info">
                <span className="document-name">{doc.filename}</span>
                <span className="document-case-id">(Case ID: {doc.case_id})</span>
              </div>
              <div className="document-actions">
                <a
                  href={`http://localhost:5000/documents/download/${doc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-button"
                >
                  📥 Download
                </a>
                <button onClick={() => handleDelete(doc.id)} className="delete-button">
                  ❌ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentsDashboard;