import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./settingsdashboard.css";

const SettingsDashboard = () => {
  const [settings, setSettings] = useState([]);
  const navigate = useNavigate();

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/settings/");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleDelete = async (key) => {
    if (!window.confirm("Are you sure you want to delete this setting?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/settings/${encodeURIComponent(key)}/`, {
        method: "DELETE",
      });
      if (res.ok) fetchSettings();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const totalSettings = settings.length;
  const recentUpdated = settings.filter(s => {
    if (!s.updated_at) return false;
    const d = new Date(s.updated_at);
    const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  return (
    <div className="customers-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="customers-title">Settings</h1>
          <h2 className="customers-heading">Manage application configuration keys</h2>
        </div>

        <button className="add-btn" onClick={() => navigate("/settings/add")}>
          + Add Setting
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18 }}>
        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg">Total Keys</h3>
          <p className="text-3xl" style={{ marginTop: 8 }}>{totalSettings}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg">Recently Updated (7d)</h3>
          <p className="text-3xl" style={{ marginTop: 8 }}>{recentUpdated}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg">Placeholder KPI</h3>
          <p className="text-3xl" style={{ marginTop: 8 }}>—</p>
        </div>
      </div>

      <div className="customers-list">
        <h3>Settings List</h3>

        <table className="customers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Key</th>
              <th>Value</th>
              <th>Description</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {settings.map((s, idx) => (
              <tr key={s.key}>
                <td>{idx + 1}</td>
                <td style={{ textAlign: "left", paddingLeft: 12 }}>{s.key}</td>
                <td style={{ textAlign: "left", paddingLeft: 12 }}>{s.value}</td>
                <td style={{ textAlign: "left", paddingLeft: 12 }}>{s.description}</td>
                <td>{s.updated_at ? new Date(s.updated_at).toLocaleString() : "-"}</td>
                <td>
                  <button className="edit-btn" onClick={() => navigate(`/masters/settings/edit/${encodeURIComponent(s.key)}`)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(s.key)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {settings.length === 0 && (
              <tr>
                <td colSpan={6} className="no-data">No settings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsDashboard;
