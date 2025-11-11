import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customersdashboard.css";
import { Eye, Trash2 } from "lucide-react"; // ✅ icons

const CustomersDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchedOnce = useRef(false); // prevent double-fetch in StrictMode

  // ✅ Fetch Customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://127.0.0.1:8000/api/v1/customers/", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("✅ Customer API Data:", data);

      // handle both paginated (data.results) and non-paginated lists
      const list = data.results || data;
      setCustomers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
      setError("Failed to fetch customers from the backend.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent double-fetch
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetchCustomers();
  }, []);

  // ✅ Delete customer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/customers/${id}/`,
          { method: "DELETE" }
        );
        if (res.ok) {
          alert("Customer deleted successfully!");
          fetchCustomers(); // refresh list
        } else {
          alert("Failed to delete customer!");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Backend not available. Cannot delete now.");
      }
    }
  };

  return (
    <div className="customers-container">
      {/* Header Section */}
      <div className="dashboard-header flex justify-between items-center mb-4">
        <div>
          <h1 className="customers-title">Customer Management</h1>
          <h2 className="customer-heading">
            Manage customer information and history
          </h2>
        </div>
      </div>

      {/* KPI Section */}
      <div className="kpi-directory-container bg-white shadow rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="kpi-card small">
            <h3>Total Customers</h3>
            <p>{customers.length}</p>
          </div>
          <div className="kpi-card small">
            <h3>Active Customers</h3>
            <p>{customers.filter((c) => c.is_active).length}</p>
          </div>
          <div className="kpi-card small">
            <h3>Inactive Customers</h3>
            <p>{customers.filter((c) => !c.is_active).length}</p>
          </div>
        </div>

        {/* Customer Directory */}
        <div className="customers-list">
          <div className="customer-directory-header flex justify-between items-center mb-4">
            <h3>Customer Directory</h3>
            <button
              className="add-btn"
              onClick={() => navigate("/masters/customers/add")}
            >
              + Add Customer
            </button>
          </div>

          {/* Table */}
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
                  customers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>{index + 1}</td>
                      <td
                        className="customer-name-link"
                        onClick={() =>
                          navigate(`/masters/customers/${customer.id}`)
                        }
                      >
                        {customer.name}
                      </td>
                      <td>{customer.phone || "-"}</td>
                      <td>{customer.email || "-"}</td>
                      <td>{customer.type || "-"}</td>
                      <td>{customer.city || "-"}</td>
                      <td>
                        {customer.is_active ? (
                          <span className="status-active">Active</span>
                        ) : (
                          <span className="status-inactive">Inactive</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        {/* Icons for actions */}
                        <Eye
                          size={18}
                          className="action-icon view-icon"
                          onClick={() =>
                            navigate(`/masters/customers/${customer.id}`)
                          }
                          title="View"
                        />
                        <Trash2
                          size={18}
                          className="action-icon delete-icon"
                          onClick={() => handleDelete(customer.id)}
                          title="Delete"
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

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default CustomersDashboard;
