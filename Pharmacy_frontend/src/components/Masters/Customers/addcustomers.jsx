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
    gstin: "",
    type: "RETAIL",
    price_tier: "",
    billing_address: "",
    shipping_address: "",
    city: "",
    state_code: "",
    pincode: "",
    consent_required: false,
    is_active: true,
  });

  // Load data if edit mode
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/v1/customers/${id}/`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
            gstin: data.gstin || "",
            type: data.type || "RETAIL",
            price_tier: data.price_tier || "",
            billing_address: data.billing_address || "",
            shipping_address: data.shipping_address || "",
            city: data.city || "",
            state_code: data.state_code || "",
            pincode: data.pincode || "",
            consent_required: data.consent_required || false,
            is_active: data.is_active ?? true,
          });
        });
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
        ? `http://127.0.0.1:8000/api/v1/customers/${id}/`
        : "http://127.0.0.1:8000/api/v1/customers/";

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
        {/* Row 1: Name, Phone, Email */}
        <div className="form-row">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" required />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone" required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
          </div>
        </div>

        {/* Row 2: GSTIN, Type, Price Tier */}
        <div className="form-row">
          <div className="form-group">
            <label>GSTIN:</label>
            <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="Enter GSTIN" />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="HOSPITAL">Hospital</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price Tier:</label>
            <input type="text" name="price_tier" value={formData.price_tier} onChange={handleChange} placeholder="Enter price tier" />
          </div>
        </div>

        {/* Row 3: Billing & Shipping Address */}
        <div className="form-row">
          <div className="form-group">
            <label>Billing Address:</label>
            <textarea name="billing_address" value={formData.billing_address} onChange={handleChange} placeholder="Billing address"></textarea>
          </div>

          <div className="form-group">
            <label>Shipping Address:</label>
            <textarea name="shipping_address" value={formData.shipping_address} onChange={handleChange} placeholder="Shipping address"></textarea>
          </div>
        </div>

        {/* Row 4: City, State, Pincode */}
        <div className="form-row">
          <div className="form-group">
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
          </div>

          <div className="form-group">
            <label>State Code:</label>
            <input type="text" name="state_code" value={formData.state_code} onChange={handleChange} placeholder="State code" />
          </div>

          <div className="form-group">
            <label>Pincode:</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
          </div>
        </div>

        {/* Row 5: Checkboxes */}
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

        {/* Form Actions */}
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
