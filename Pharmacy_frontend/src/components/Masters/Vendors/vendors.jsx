import React, { useEffect, useState } from "react";
import "./vendors.css";

const API_URL = "http://127.0.0.1:8000/api/vendors/";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    email: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all vendors from backend
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      alert("❌ Failed to load vendor data. Please check your backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle Add or Update vendor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save vendor");

      // Reset form
      setFormData({ name: "", contact_number: "", email: "", address: "" });
      setEditingId(null);
      fetchVendors();
      alert(editingId ? "✅ Vendor updated successfully!" : "✅ Vendor added successfully!");
    } catch (error) {
      console.error("Error saving vendor:", error);
      alert("❌ Failed to save vendor. Please try again.");
    }
  };

  // ✅ Edit vendor
  const handleEdit = (vendor) => {
    setFormData({
      name: vendor.name,
      contact_number: vendor.contact_number,
      email: vendor.email,
      address: vendor.address,
    });
    setEditingId(vendor.id);
  };

  // ✅ Delete vendor
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
        if (res.ok) {
          fetchVendors();
          alert("🗑️ Vendor deleted successfully!");
        } else {
          throw new Error("Failed to delete vendor");
        }
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("❌ Failed to delete vendor.");
      }
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

      <h3 className="vendor-list-title">
        {loading ? "Loading Vendors..." : "Vendor List"}
      </h3>

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
          {vendors.length > 0 ? (
            vendors.map((vendor, index) => (
              <tr key={vendor.id}>
                <td>{index + 1}</td>
                <td>{vendor.name}</td>
                <td>{vendor.contact_number}</td>
                <td>{vendor.email}</td>
                <td>{vendor.address}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(vendor)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No vendors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vendors;
