import React, { useEffect, useState } from "react";
import "./vendors.css";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    email: "",
    address: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch vendor data from backend API
  const fetchVendors = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/vendors/");
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Add or Update vendor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://127.0.0.1:8000/api/vendors/${editingId}/`
        : "http://127.0.0.1:8000/api/vendors/";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ name: "", contact_number: "", email: "", address: "" });
      setEditingId(null);
      fetchVendors();
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  // Edit vendor
  const handleEdit = (vendor) => {
    setFormData(vendor);
    setEditingId(vendor.id);
  };

  // Delete vendor
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await fetch(`http://127.0.0.1:8000/api/vendors/${id}/`, {
        method: "DELETE",
      });
      fetchVendors();
    }
  };

  return (
    <div className="vendor-container">
      <h2>Vendor Management</h2>

      <form className="vendor-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Vendor Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
        <button type="submit">
          {editingId ? "Update Vendor" : "Add Vendor"}
        </button>
      </form>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Vendor Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={vendor.id}>
              <td>{index + 1}</td>
              <td>{vendor.name}</td>
              <td>{vendor.contact_number}</td>
              <td>{vendor.email}</td>
              <td>{vendor.address}</td>
              <td>
                <button onClick={() => handleEdit(vendor)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(vendor.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vendors;
