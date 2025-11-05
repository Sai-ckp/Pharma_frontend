import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../customers/addcustomers.css";

const AddCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // check edit mode

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    consent_required: false,
    is_active: true
  });

  // load data if edit mode
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/customers/${id}/`)
        .then(res => res.json())
        .then(data => setFormData(data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `http://127.0.0.1:8000/api/customers/${id}/`
        : "http://127.0.0.1:8000/api/customers/";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      alert(id ? "Customer Updated Successfully!" : "Customer Added Successfully!");
      navigate("/masters/customers");

    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <div className="customers-container">
      <h1 className="customers-title">{id ? "Update Customer" : "Add Customer"}</h1>

      <form className="customers-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phone" placeholder="Enter phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea name="address" placeholder="Enter address" value={formData.address} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="consent_required" checked={formData.consent_required} onChange={handleChange} />
              Consent Required
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              Active
            </label>
          </div>
        </div>

         <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/masters/customers")}>
            Cancel
          </button>

          <button type="submit" className="submit-btn">
            {id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
