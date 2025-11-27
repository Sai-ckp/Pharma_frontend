import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./addvendors.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EditVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [paymentTermsList, setPaymentTermsList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    contact_phone: "",
    email: "",
    contact_person: "",
    address: "",
    product_info: "",
    payment_terms: "",
    bank_name: "",
    account_no: "",
    ifsc: "",
    notes: "",
    rating: "",
    is_active: true,
  });

  // Fetch payment terms list
  useEffect(() => {
    const loadTerms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/payment-terms/`);
        const data = await res.json();
        setPaymentTermsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load payment terms", error);
      }
    };
    loadTerms();
  }, []);

  // Fetch vendor data
  useEffect(() => {
    const loadVendor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/procurement/vendors/${id}/`);
        const data = await res.json();

        setFormData({
          ...data,
          payment_terms: data.payment_terms || "",
          is_active: data.is_active ?? true,
        });
      } catch (error) {
        console.error("Error loading vendor", error);
      }
    };

    loadVendor();
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

    const res = await fetch(`${API_BASE_URL}/procurement/vendors/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Vendor Updated Successfully!");
      navigate("/masters/vendors");
    } else {
      alert("Failed to Update Vendor!");
    }
  };

  return (
    <div className="vendors-container">

      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/masters/vendors")}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="vendors-title">Edit Supplier</h1>
      </div>

      <form className="vendors-form" onSubmit={handleSubmit}>

        {/* BASIC INFORMATION */}
        <div className="section-card">
          <h2 className="section-heading">Basic Information</h2>

          <div className="row">
            <div className="field">
              <label>Supplier Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Contact Person *</label>
              <input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Phone Number *</label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>GST Number *</label>
              <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Status</label>
              <select
                name="is_active"
                value={formData.is_active ? "1" : "0"}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "1" })}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="field full">
            <label>Address *</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="section-card">
          <h2 className="section-heading">Products & Supply Information</h2>

          <div className="field full">
            <label>What Products Can This Supplier Deliver? *</label>
            <textarea
              name="product_info"
              value={formData.product_info}
              onChange={handleChange}
              placeholder="Eg: Antibiotics, Surgical Items, Diabetic Medicines, etc."
            ></textarea>
          </div>
        </div>

        {/* PAYMENT TERMS */}
        <div className="section-card">
          <h2 className="section-heading">Business Terms</h2>

          <div className="row">
            <div className="field">
              <label>Payment Terms *</label>
              <select name="payment_terms" value={formData.payment_terms} onChange={handleChange}>
                <option value="">Select</option>
                {paymentTermsList.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field"></div>
          </div>
        </div>

        {/* BANK DETAILS */}
        <div className="section-card">
          <h2 className="section-heading">Banking Information (Optional)</h2>

          <div className="row">
            <div className="field">
              <label>Bank Name</label>
              <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Account Number</label>
              <input type="text" name="account_no" value={formData.account_no} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>IFSC Code</label>
              <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} />
            </div>

            <div className="field"></div>
          </div>
        </div>

        {/* NOTES */}
        <div className="section-card">
          <h2 className="section-heading">Additional Notes</h2>
          <div className="field full">
            <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="action-row">
          <button type="button" className="cancel-btn" onClick={() => navigate("/masters/vendors")}>
            Cancel
          </button>
          <button type="submit" className="save-btn">Update</button>
        </div>

      </form>
    </div>
  );
};

export default EditVendor;
