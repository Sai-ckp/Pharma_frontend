import React, { useState, useEffect } from "react";
import "./recall_events.css";

const RecallEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    batch_lot_id: "",
    reason: "",
    initiated_on: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize (no dummy data)
  useEffect(() => {
    setLoading(true);
    // In a real app, you’d fetch from an API here
    setTimeout(() => {
      setEvents([]); // empty by default
      setLoading(false);
    }, 300);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      batch_lot_id: "",
      reason: "",
      initiated_on: "",
      status: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      ...formData,
      id: editingId
        ? editingId
        : Math.max(0, ...events.map((ev) => Number(ev.id) || 0)) + 1,
    };

    if (editingId) {
      setEvents((prev) => prev.map((ev) => (ev.id === editingId ? newEntry : ev)));
      alert("✅ Recall event updated!");
    } else {
      setEvents((prev) => [newEntry, ...prev]);
      alert("✅ Recall event added!");
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id ?? "",
      batch_lot_id: item.batch_lot_id ?? "",
      reason: item.reason ?? "",
      initiated_on: item.initiated_on ?? "",
      status: item.status ?? "",
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this recall event?")) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    alert("🗑️ Recall event deleted!");
  };

  return (
    <div className="recall-events-container">
      <h2>Recall Events</h2>

      <form className="recall-events-form" onSubmit={handleSubmit}>
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
          name="batch_lot_id"
          placeholder="Batch Lot ID"
          value={formData.batch_lot_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />
        <label>
          Initiated On
          <input
            type="datetime-local"
            name="initiated_on"
            value={formData.initiated_on}
            onChange={handleChange}
            required
          />
        </label>
        <input
          type="text"
          name="status"
          placeholder="Status"
          value={formData.status}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Update Event" : "Add Event"}</button>
      </form>

      <h3 className="recall-events-list-title">
        {loading ? "Loading..." : "Recall Events List"}
      </h3>

      <table className="recall-events-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Batch Lot ID</th>
            <th>Reason</th>
            <th>Initiated On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((ev, idx) => (
              <tr key={ev.id || idx}>
                <td>{idx + 1}</td>
                <td>{ev.id}</td>
                <td>{ev.batch_lot_id}</td>
                <td>{ev.reason}</td>
                <td>{ev.initiated_on ? new Date(ev.initiated_on).toLocaleString() : ""}</td>
                <td>{ev.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(ev)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(ev.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                No recall events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecallEvents;
