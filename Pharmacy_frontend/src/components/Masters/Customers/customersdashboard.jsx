import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customersdashboard.css";

const CustomersDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/v1/customers/");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/customers/${id}/`, {
          method: "DELETE",
        });
        if (res.ok) fetchCustomers();
        else alert("Failed to delete customer!");
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <div className="customers-container">
      {/* Dashboard Header */}
      <div className="dashboard-header flex justify-between items-center mb-4">
        <div>
          <h1 className="customers-title">Customer Management</h1>
          <h2 className="customer-heading">Manage customer information and purchase history</h2>
        </div>
         <button className="add-btn" onClick={() => navigate("/masters/customers/add")}>
            send message
          </button>
      </div>

      {/* KPI Cards + Customer Directory header inside same container */}
      <div className="kpi-directory-container bg-white shadow rounded-xl p-5 mb-6">
        {/* KPI CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="kpi-card">
            <h3>Total Customers</h3>
            <p>{customers.length}</p>
          </div>
          <div className="kpi-card">
            <h3>Avg Purchase Value</h3>
            <p>₹ 1500</p>
          </div>
          <div className="kpi-card">
            <h3>Active This Month</h3>
            <p>{customers.filter(c => c.is_active).length}</p>
          </div>
        </div>

        {/* Customer Directory Header with Add Button inside the same card container */}
       

        {/* CUSTOMERS TABLE */}
        <div className="customers-list">
           <div className="customer-directory-header flex justify-between items-center mb-4">
          <h3>Customer Directory</h3>
          <button className="add-btn" onClick={() => navigate("/masters/customers/add")}>
            + Add Customer
          </button>
        </div>
          {loading ? (
            <p>Loading customers...</p>
          ) : (
            <table className="customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Purchase Date</th>
                
                  <th>Total Purchases</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>{index + 1}</td>
                      <td>{customer.name}</td>
                      <td>{customer.last_purchase_date || "-"}</td>
                      
                      <td>{customer.total_purchases || 0}</td>
                      <td>₹ {customer.total_amount || 0}</td>
                      <td>
                       <button
  className="edit-btn"
  onClick={() => navigate(`http://127.0.0.1:8000/api/v1/customers/${id}/`)}
>
  View
</button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersDashboard;
