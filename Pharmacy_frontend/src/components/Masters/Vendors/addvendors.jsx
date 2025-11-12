import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addvendors.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AddVendor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    contact_phone: "",
    email: "",
    contact_person: "",
    address: "",
    payment_terms: "",
    bank_name: "",
    account_no: "",
    ifsc: "",
    notes: "",
    rating: "",
    is_active: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/procurement/vendors/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Vendor Added Successfully!");
      navigate("/masters/vendors");
    } else {
      alert("Failed to Save Vendor!");
    }
  };

  return (
    <div className="vendors-container">
      <h1 className="vendors-title">Add Supplier</h1>

      <form className="vendors-form" onSubmit={handleSubmit}>

        {/* BASIC INFORMATION */}
        <div className="section">
          <h2 className="section-title">Basic Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Supplier Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Contact Person:</label>
              <input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number:</label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GSTIN:</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                Active
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: "1" }}>
              <label>Address:</label>
              <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>


        {/* BUSINESS TERMS */}
        <div className="section">
          <h2 className="section-title">Business Terms</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Payment Terms:</label>
              <input type="text" name="payment_terms" value={formData.payment_terms} onChange={handleChange} />
            </div>
          </div>
        </div>


        {/* BANK INFORMATION */}
        <div className="section">
          <h2 className="section-title">Bank Information (Optional)</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Bank Name:</label>
              <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>IFSC Code:</label>
              <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Account Number:</label>
              <input type="text" name="account_no" value={formData.account_no} onChange={handleChange} />
            </div>
          </div>
        </div>


        {/* ADDITIONAL NOTES */}
        <div className="section">
          <h2 className="section-title">Additional Notes</h2>

          <div className="form-group">
            <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
          </div>
        </div>


        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/masters/vendors")}>
            Cancel
          </button>

          <button type="submit" className="submit-btn">Save</button>
        </div>

      </form>
    </div>
  );
};

export default AddVendor;
