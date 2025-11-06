import React, { useEffect, useState } from "react";
import "./breach_logs.css";

const API_URL = "http://127.0.0.1:8000/api/breach-logs/";

const BreachLogs = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    reported_by_user_id: "",
    description: "",
    severity: "",
    event_time: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toDatetimeLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };
  const toISOIfNeeded = (val) => (val ? new Date(val).toISOString() : "");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error("Error fetching breach logs:", err);
      setError("⚠️ Unable to load breach logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      reported_by_user_id: "",
      description: "",
      severity: "",
      event_time: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, event_time: toISOIfNeeded(formData.event_time) };
      if (!editingId) delete payload.id;

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save breach log");

      resetForm();
      await fetchLogs();
      alert(editingId ? "✅ Breach log updated!" : "✅ Breach log created!");
    } catch (err) {
      console.error("Error saving breach log:", err);
      alert("❌ Failed to save breach log.");
    }
  };

  const handleEdit = (log) => {
    setFormData({
      id: log.id ?? "",
      reported_by_user_id: log.reported_by_user_id ?? "",
      description: log.description ?? "",
      severity: log.severity ?? "",
      event_time: toDatetimeLocal(log.event_time),
    });
    setEditingId(log.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this breach log?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete breach log");
      await fetchLogs();
      alert("🗑️ Breach log deleted!");
    } catch (err) {
      console.error("Error deleting breach log:", err);
      alert("❌ Failed to delete breach log.");
    }
  };

  return (
    <div className="breach-logs-container">
      <h2>Breach Logs</h2>

      <form className="breach-logs-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          disabled={!editingId}
        />
        <input
          type="text"
          name="reported_by_user_id"
          placeholder="Reported By (User ID)"
          value={formData.reported_by_user_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="severity"
          placeholder="Severity (e.g. Low, Medium, High)"
          value={formData.severity}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
        <label>
          Event Time
          <input
            type="datetime-local"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
          />
        </label>

        <button type="submit">{editingId ? "Update Log" : "Add Log"}</button>
      </form>

      <h3 className="breach-logs-list-title">
        {loading ? "Loading..." : error || "Breach Log Entries"}
      </h3>

      <table className="breach-logs-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Reported By</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Event Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <tr key={log.id || idx}>
                <td>{idx + 1}</td>
                <td>{log.id}</td>
                <td>{log.reported_by_user_id}</td>
                <td title={log.description}>{log.description}</td>
                <td>{log.severity}</td>
                <td>{log.event_time ? new Date(log.event_time).toLocaleString() : ""}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(log)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(log.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            !loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                  No breach logs found.
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BreachLogs;
