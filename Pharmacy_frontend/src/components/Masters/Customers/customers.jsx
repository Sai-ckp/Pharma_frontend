import React, { useEffect, useState } from "react";
import "./customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch all customers from backend API
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

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Add / Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://127.0.0.1:8000/api/customers/${editingId}/`
        : "http://127.0.0.1:8000/api/customers/";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({ name: "", contact: "", email: "", address: "" });
      setEditingId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  // ✅ Edit customer
  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
  };

  // ✅ Delete customer
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
      <h1 className="customers-title">Customer Management</h1>

      <p className="customers-description">
        👥 Manage all your pharmacy customers here — add, update, or remove customer details.
      </p>

      <div className="customers-card">
        <h3>{editingId ? "Update Customer" : "Add New Customer"}</h3>

        <form className="customers-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number:</label>
              <input
                type="text"
                name="contact"
                placeholder="Enter contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {editingId ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      </div>

      <div className="customers-list">
        <h3>Customer List</h3>
        <table className="customers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.contact}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(customer)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
