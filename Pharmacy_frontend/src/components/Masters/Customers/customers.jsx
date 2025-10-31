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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await fetch(`http://127.0.0.1:8000/api/customers/${id}/`, {
        method: "DELETE",
      });
      fetchCustomers();
    }
  };

  return (
    <div className="customer-container">
      <h2>Customer Management</h2>

      <form className="customer-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange}></textarea>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <table className="customer-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td>{c.contact}</td>
              <td>{c.email}</td>
              <td>{c.address}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
