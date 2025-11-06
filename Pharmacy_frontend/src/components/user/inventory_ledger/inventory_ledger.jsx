import React, { useEffect, useState } from "react";
import "./inventory_ledger.css";

const API_URL = "http://127.0.0.1:8000/api/inventory-ledger/";

const InventoryLedger = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    location_id: "",
    batch_lot_id: "",
    qty_change_base: "",
    reason: "",
    ref_doc_type: "",
    ref_doc_id: "",
    created_at: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      console.error("Error fetching entries:", err.message);
      setError("⚠️ Unable to load data from the backend.");
      setEntries([]); // ensure no dummy data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("💡 Backend connection required to save data.");
  };

  const handleEdit = (entry) => {
    setFormData({
      location_id: entry.location_id,
      batch_lot_id: entry.batch_lot_id,
      qty_change_base: entry.qty_change_base,
      reason: entry.reason,
      ref_doc_type: entry.ref_doc_type,
      ref_doc_id: entry.ref_doc_id,
      created_at: entry.created_at,
    });
    setEditingId(entry.id);
  };

  const handleDelete = (id) => {
    alert("🗑️ Delete feature will work once backend is connected.");
  };

  return (
    <div className="inventory-ledger-container">
      <h2>Inventory Ledger</h2>

      <form className="inventory-ledger-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="location_id"
          placeholder="Location ID"
          value={formData.location_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="batch_lot_id"
          placeholder="Batch Lot ID"
          value={formData.batch_lot_id}
          onChange={handleChange}
        />
        <input
          type="number"
          name="qty_change_base"
          placeholder="Quantity Change (Base)"
          value={formData.qty_change_base}
          onChange={handleChange}
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ref_doc_type"
          placeholder="Reference Doc Type"
          value={formData.ref_doc_type}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ref_doc_id"
          placeholder="Reference Doc ID"
          value={formData.ref_doc_id}
          onChange={handleChange}
        />
        <label>
          Created At
          <input
            type="datetime-local"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          {editingId ? "Update Entry" : "Add Entry"}
        </button>
      </form>

      <h3 className="inventory-ledger-list-title">
        {loading ? "Loading..." : error || "Ledger Entries"}
      </h3>

      <table className="inventory-ledger-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Location ID</th>
            <th>Batch Lot ID</th>
            <th>Qty Change</th>
            <th>Reason</th>
            <th>Ref Doc Type</th>
            <th>Ref Doc ID</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length > 0 ? (
            entries.map((entry, idx) => (
              <tr key={entry.id || idx}>
                <td>{idx + 1}</td>
                <td>{entry.id}</td>
                <td>{entry.location_id}</td>
                <td>{entry.batch_lot_id}</td>
                <td>{entry.qty_change_base}</td>
                <td>{entry.reason}</td>
                <td>{entry.ref_doc_type}</td>
                <td>{entry.ref_doc_id}</td>
                <td>
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleString()
                    : ""}
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            !loading && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "10px" }}>
                  No entries found.
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryLedger;
