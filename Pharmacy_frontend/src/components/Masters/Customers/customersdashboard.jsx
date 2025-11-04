import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customersdashboard.css";

const CustomersDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/customers/");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await fetch(`http://127.0.0.1:8000/api/customers/${id}/`, {
        method: "DELETE",
      });
      fetchCustomers();
    }
  };

  return (
    <div className="customers-container">
      <div className="flex justify-between items-center">
        <h1 className="customers-title">Customer Management</h1>
        <h2 className="customer-heading">Manage customer information and purchase history</h2>

        <button className="add-btn" onClick={() => navigate("/masters/customers/add")}>
          + Add Customer
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">{customers.length}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Avg Purchase Value</h3>
          <p className="text-3xl font-bold mt-2">₹ 1500</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 text-center">
          <h3 className="text-lg font-semibold">Active This Month</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
      </div>

      {/* CUSTOMERS LIST */}
      <div className="customers-list">
        <h3>Customer List</h3>

        <table className="customers-table">
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.is_active ? "Active" : "Inactive"}</td>

                <td>
                  <button className="edit-btn" onClick={() => alert("View Screen Coming!")}>
                    View
                  </button>

                  <button className="edit-btn" onClick={() => navigate(`/masters/customers/edit/${customer.id}`)}>
                    Edit
                  </button>

                  <button className="delete-btn" onClick={() => handleDelete(customer.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersDashboard;
