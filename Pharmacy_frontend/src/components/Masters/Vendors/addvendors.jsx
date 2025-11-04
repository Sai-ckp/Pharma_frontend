import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addvendors.css";

const AddVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    email: "",
    address: "",
    is_active: true
  });

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/vendors/${id}/`)
        .then((res) => res.json())
        .then((data) => setFormData(data));
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

    const url = id
      ? `http://127.0.0.1:8000/api/vendors/${id}/`
      : `http://127.0.0.1:8000/api/vendors/`;

    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert(id ? "Vendor Updated Successfully!" : "Vendor Added Successfully!");
      navigate("/masters/vendors");
    } else {
      alert("Failed!");
    }
  };

  return (
    <div className="vendors-container">
      <h1 className="vendors-title">{id ? "Update Vendor" : "Add Vendor"}</h1>

      <form className="vendors-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Vendor Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contact Number:</label>
            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              Active
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/masters/vendors")}>
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

export default AddVendor;
