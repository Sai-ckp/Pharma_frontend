import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./retentiondashboard.css";

const RetentionDashboard = () => {
  const [policies, setPolicies] = useState([]);
  const navigate = useNavigate();

  const fetchPolicies = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/retention-policies/");
      const data = await res.json();
      setPolicies(data);
    } catch (err) {
      console.error("Error fetching retention policies:", err);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/retention-policies/${id}/`, {
        method: "DELETE",
      });
      if (res.ok) fetchPolicies();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // KPIs (dummy / small derived)
  const total = policies.length;
  const holdCount = policies.filter(p => p.hold_from_purge).length;

  return (
    <div className="customers-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="customers-title">Retention Policies</h1>
          <h2 className="customers-heading">Manage retention rules per module</h2>
        </div>

        <button className="add-btn" onClick={() => navigate("/retention-policies/add")}>
          + Add Policy
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18 }}>
        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg">Total Policies</h3>
          <p className="text-3xl" style={{ marginTop: 8 }}>{total}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg">Held From Purge</h3>
          <p className="text-3xl" style={{ marginTop: 8 }}>{holdCount}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg">Placeholder</h3>
          <p className="text-3xl" style={{ marginTop: 8 }}>—</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="customers-list">
        <h3>Retention Policies List</h3>

        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Module</th>
              <th>Keep Years</th>
              <th>Hold From Purge</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {policies.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td style={{ textAlign: "left", paddingLeft: 12 }}>{p.module}</td>
                <td>{p.keep_years}</td>
                <td>{String(!!p.hold_from_purge)}</td>
                <td>
                  <button className="edit-btn" onClick={() => navigate(`/masters/retention-policies/edit/${p.id}`)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {policies.length === 0 && (
              <tr>
                <td colSpan={5} className="no-data">No retention policies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetentionDashboard;
