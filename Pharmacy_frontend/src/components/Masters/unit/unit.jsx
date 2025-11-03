import React, { useEffect, useState } from "react";
import "./unit.css";

const Units = () => {
  const API_URL = "http://127.0.0.1:8000/api/units/";
  const [units, setUnits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // 🔹 Fetch all units on page load
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load units");
      const data = await response.json();
      setUnits(data);
    } catch (err) {
      console.error("Error fetching units:", err);
      setError("Unable to fetch unit data from backend.");
    }
  };

  // 🔹 Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a unit name.");
      return;
    }

    const payload = { name, description };

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}${editId}/` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save unit");

      await fetchUnits();
      setName("");
      setDescription("");
      setEditId(null);
    } catch (err) {
      console.error("Error saving unit:", err);
      alert("Failed to save unit. Please check backend.");
    }
  };

  // 🔹 Handle Edit
  const handleEdit = (unit) => {
    setName(unit.name);
    setDescription(unit.description);
    setEditId(unit.id);
  };

  // 🔹 Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete unit");
      await fetchUnits();
    } catch (err) {
      console.error("Error deleting unit:", err);
      alert("Unable to delete unit.");
    }
  };

  return (
    <div className="units-container">
      <h1 className="units-title">Unit Management</h1>
      <p className="units-description">
        ✅ Manage your measurement units (e.g., Box, Strip, Bottle, Tablet).
      </p>

      {/* 🔹 Form Section */}
      <div className="units-card">
        <h3>{editId ? "Edit Unit" : "Add New Unit"}</h3>
        <form className="units-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Unit Name:</label>
            <input
              type="text"
              placeholder="Enter unit name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button className="submit-btn" type="submit">
            {editId ? "Update Unit" : "Save Unit"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setName("");
                setDescription("");
                setEditId(null);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* 🔹 Units Table */}
      <div className="units-list">
        <h3>Available Units</h3>

        {error && <div className="error">{error}</div>}

        {units.length === 0 ? (
          <p>No units found.</p>
        ) : (
          <table className="units-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Unit Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.id}</td>
                  <td>{unit.name}</td>
                  <td>{unit.description || "-"}</td>
                  <td>
                    <button onClick={() => handleEdit(unit)}>✏️ Edit</button>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(unit.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Units;
