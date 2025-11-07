import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addvendors.css";

const EditVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    is_active: true,
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/procurement/vendors/${id}/`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://127.0.0.1:8000/api/v1/procurement/vendors/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Vendor Updated Successfully!");
      navigate("/masters/vendors");
    } else {
      alert("Update Failed!");
    }
  };

  return (
    <div className="vendors-container">
      <h1 className="vendors-title">Edit Vendor</h1>

      <form className="vendors-form" onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="form-group">
            <label>Vendor Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>GSTIN</label>
            <input name="gstin" value={formData.gstin} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone</label>
            <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Person</label>
            <input name="contact_person" value={formData.contact_person} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Payment Terms</label>
            <input name="payment_terms" value={formData.payment_terms} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bank Name</label>
            <input name="bank_name" value={formData.bank_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Account No</label>
            <input name="account_no" value={formData.account_no} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>IFSC</label>
            <input name="ifsc" value={formData.ifsc} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
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
          <button type="submit" className="submit-btn">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditVendor;
