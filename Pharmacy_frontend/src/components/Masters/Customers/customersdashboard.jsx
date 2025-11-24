import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customersdashboard.css";
import { Eye, Trash2 } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/v1";

const CustomersDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null); // ⭐ dashboard stats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false);
  const navigate = useNavigate();

  // -------------------------------
  // 1️⃣ Fetch Dashboard Stats (KPI)
  // -------------------------------
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers/?stats=true`);
      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats Error:", err);
      setStats({
        total_customers: 0,
        avg_purchase_value: 0,
        active_this_month: 0,
      });
    }
  };

  // -------------------------------
  // 2️⃣ Fetch Customer List
  // -------------------------------
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/customers/`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const list = data.results || data;

      setCustomers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to fetch customers from the backend.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // INIT LOAD (prevent double fetch)
  // -------------------------------
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    fetchStats();       // ⭐ Fetch KPI Stats
    fetchCustomers();   // ⭐ Fetch Customer List
  }, []);

  // -------------------------------
  // Delete Customer
  // -------------------------------
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(`${API_BASE}/customers/${id}/`, {
          method: "DELETE",
        });

        if (res.ok) {
          alert("Customer deleted successfully!");
          fetchCustomers();
          fetchStats(); // refresh KPI stats
        } else {
          alert("Failed to delete customer!");
        }
      } catch (error) {
        alert("Backend not available. Cannot delete now.");
      }
    }
  };

  return (
    <div className="customers-container">

      {/* Header */}
      <div className="dashboard-header mb-4">
        <h1 className="customers-title">Customer Management</h1>
        <h2 className="customer-heading">
          Manage customer information and history
        </h2>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-directory-container bg-white shadow rounded-xl p-5 mb-6">

        <div className="grid grid-cols-3 gap-4 mb-4">

          <div className="kpi-card small">
            <h3>Total Customers</h3>
            <p>{stats?.total_customers ?? 0}</p>
          </div>

         <div className="kpi-card small">
      <h3>Avg Purchase Value</h3>
      <p>₹ {stats?.avg_purchase_value ?? 0}</p>
    </div>

    {/* Active This Month */}
    <div className="kpi-card small">
      <h3>Active This Month</h3>
      <p>{stats?.active_this_month ?? 0}</p>
    </div>
        </div>

        {/* Customer Table */}
        <div className="customers-list">
          <div className="customer-directory-header mb-4">
            <h3>Customer Directory</h3>
          </div>

          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <table className="customers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.length > 0 ? (
                  customers.map((c, index) => (
                    <tr key={c.id}>
                      <td>{index + 1}</td>

                      <td
                        className="customer-name-link"
                        onClick={() => navigate(`/masters/customers/${c.id}`)}
                      >
                        {c.name}
                      </td>

                      <td>{c.phone || "-"}</td>
                      <td>{c.email || "-"}</td>
                      <td>{c.type || "-"}</td>
                      <td>{c.city || "-"}</td>

                      <td>
                        {c.is_active ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-inactive">Inactive</span>
                        )}
                      </td>

                      <td className="actions-cell">
                        <Eye
                          size={18}
                          className="action-icon view-icon"
                          onClick={() => navigate(`/masters/customers/${c.id}`)}
                        />
                        <Trash2
                          size={18}
                          className="action-icon delete-icon"
                          onClick={() => handleDelete(c.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default CustomersDashboard;
