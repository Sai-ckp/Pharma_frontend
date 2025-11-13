import React, { useState } from "react";
import { Upload, ArrowUpCircle, Clock } from "lucide-react";
import "./backuprestore.css";

const BackupRestore = () => {
  const [backupType, setBackupType] = useState("Full Backup");
  const [lastBackup, setLastBackup] = useState("2025-11-12 10:30 AM");
  const [backupSize, setBackupSize] = useState("250 MB");
  const [backupStatus, setBackupStatus] = useState("Success");

  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [frequency, setFrequency] = useState("Daily");
  const [backupTime, setBackupTime] = useState("02:00");

  const [selectedFile, setSelectedFile] = useState(null);

  const handleImportBackup = () => {
    alert("Importing backup file...");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file.name);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setSelectedFile(file.name);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="backup-restore-container">
      <h2 style={{ marginBottom: "16px" }}>Backup & Restore</h2>

      {/* 🔹 First Row (Backup + Restore) */}
      <div className="top-backup-row">
        {/* 1️⃣ Backup Data Card */}
        <div className="tax-card backup-card">
          <div className="card-header import-header">
            <Upload
              className="import-icon"
              size={20}
              onClick={handleImportBackup}
              title="Import Backup"
            />
            <h3>Backup Data</h3>
          </div>
          <p>Create a backup of your pharmacy data</p>

          <div className="alert-row-horizontal">
            <div className="alert-field">
              <label>Backup Type</label>
              <select
                value={backupType}
                onChange={(e) => setBackupType(e.target.value)}
              >
                <option>Full Backup (All Data)</option>
                <option> Inventory Only</option>
                <option> Customers Only</option>
                <option> Transactions Only</option>
              </select>
            </div>
            <div className="alert-field">
              <label>Last Backup</label>
              <input type="text" value={lastBackup} disabled />
            </div>
          </div>

          <div className="alert-row-horizontal">
            <div className="alert-field">
              <label>Backup Size</label>
              <input type="text" value={backupSize} disabled />
            </div>
            <div className="alert-field">
              <label>Status</label>
              <input type="text" value={backupStatus} disabled />
            </div>
          </div>

          <div className="save-btn-container">
            <button className="save-btn" onClick={() => alert("Creating backup...")}>
              Create Backup Now
            </button>
          </div>
        </div>

        {/* 2️⃣ Restore Data Card */}
        <div className="tax-card backup-card">
          <div className="card-header">
            <h3>Restore Data</h3>
          </div>
          <p>Restore from a previous backup</p>

          {/* ✅ Drop Zone with clickable + drag & drop */}
          <label
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <ArrowUpCircle size={48} className="export-icon" />
            <p className="drop-text">Drop backup file here or click to browse</p>
            <p className="browse-text">Select backup file to browse the file</p>
            {selectedFile && (
              <p className="file-name">📁 {selectedFile}</p>
            )}
          </label>
        </div>
      </div>

      {/* 🔹 Second Row (Automatic Backup) */}
      <div className="tax-card backup-card">
        <div className="card-header">
          <Clock size={22} />
          <h3>Automatic Backup Schedule</h3>
        </div>
        <p>Configure automatic backup schedule</p>

        <div className="payment-row">
          <label>Enable Auto Backup</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={() => setAutoBackupEnabled(!autoBackupEnabled)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {autoBackupEnabled && (
          <div className="alert-row-horizontal">
            <div className="alert-field">
              <label>Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="alert-field">
              <label>Backup Time</label>
              <input
                type="time"
                value={backupTime}
                onChange={(e) => setBackupTime(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupRestore;
