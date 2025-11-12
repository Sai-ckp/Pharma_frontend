import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inventory.css";

const LS_KEY = "medicines";

const empty = {
  id: "",
  medicine_id: "",
  batch_number: "",
  medicine_name: "",
  generic_name: "",
  category: "",
  manufacturer: "",
  quantity: "",
  mrp: "",
  purchase_price: "",
  expiry_date: "",
  description: "",
};

export default function AddMedicine() {
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.medicine_name.trim()) e.medicine_name = "Medicine name is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.quantity) e.quantity = "Quantity is required";
    if (!form.mrp) e.mrp = "MRP is required";
    if (!form.purchase_price) e.purchase_price = "Purchase price is required";
    if (!form.expiry_date) e.expiry_date = "Expiry date is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    const item = {
      ...form,
      id: crypto.randomUUID(),
      // sensible defaults for list fields:
      medicine_id: form.medicine_id || form.medicine_name.slice(0,2).toUpperCase() + Math.floor(Math.random()*9999),
    };

    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(item);
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
    } catch {}

    nav("/inventory/medicines");
  };

  return (
    <div className="inv-form-wrap">
      <div className="inv-form-header">
        <div>
          <h2>Add New Medicine</h2>
          <p>Enter the details of the new medicine to add to inventory</p>
        </div>
      </div>

      <div className="inv-form-card">
        <form className="grid2" onSubmit={handleSubmit}>
          {/* left */}
          <div className="field">
            <label>Medicine Name <span className="req">*</span></label>
            <input
              type="text" name="medicine_name" placeholder="e.g., Paracetamol 500mg"
              value={form.medicine_name} onChange={handleChange}
              className={errors.medicine_name ? "error" : ""}
            />
            {errors.medicine_name && <div className="err">{errors.medicine_name}</div>}
          </div>

          <div className="field">
            <label>Generic Name</label>
            <input
              type="text" name="generic_name" placeholder="e.g., Acetaminophen"
              value={form.generic_name} onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Category <span className="req">*</span></label>
            <select
              name="category" value={form.category} onChange={handleChange}
              className={errors.category ? "error" : ""}
            >
              <option value="">Select category</option>
              <option>Antipyretic</option>
              <option>Antibiotic</option>
              <option>Antacid</option>
              <option>Antidiabetic</option>
              <option>NSAID</option>
              <option>Cholesterol</option>
              <option>Antihistamine</option>
            </select>
            {errors.category && <div className="err">{errors.category}</div>}
          </div>

          <div className="field">
            <label>Manufacturer</label>
            <input
              type="text" name="manufacturer" placeholder="e.g., Sun Pharma"
              value={form.manufacturer} onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Quantity <span className="req">*</span></label>
            <input
              type="number" name="quantity" placeholder="e.g., 500"
              value={form.quantity} onChange={handleChange}
              className={errors.quantity ? "error" : ""}
            />
            {errors.quantity && <div className="err">{errors.quantity}</div>}
          </div>

          <div className="field">
            <label>Batch Number</label>
            <input
              type="text" name="batch_number" placeholder="e.g., BTH-2024-001"
              value={form.batch_number} onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>MRP (₹) <span className="req">*</span></label>
            <input
              type="number" step="0.01" name="mrp" placeholder="e.g., 5.00"
              value={form.mrp} onChange={handleChange}
              className={errors.mrp ? "error" : ""}
            />
            {errors.mrp && <div className="err">{errors.mrp}</div>}
          </div>

          <div className="field">
            <label>Purchase Price (₹) <span className="req">*</span></label>
            <input
              type="number" step="0.01" name="purchase_price" placeholder="e.g., 2.50"
              value={form.purchase_price} onChange={handleChange}
              className={errors.purchase_price ? "error" : ""}
            />
            {errors.purchase_price && <div className="err">{errors.purchase_price}</div>}
          </div>

          <div className="field">
            <label>Expiry Date <span className="req">*</span></label>
            <input
              type="date" name="expiry_date" value={form.expiry_date}
              onChange={handleChange} className={errors.expiry_date ? "error" : ""}
            />
            {errors.expiry_date && <div className="err">{errors.expiry_date}</div>}
          </div>

          <div className="field col-span-2">
            <label>Description</label>
            <textarea
              name="description" rows={3} placeholder="Enter any additional information about the medicine..."
              value={form.description} onChange={handleChange}
            />
          </div>

          <div className="form-actions col-span-2">
<button type="button" className="btn ghost" onClick={() => nav(-1)}>
  X  Cancel
</button>


            <button type="submit" className="btn primary">Add Medicine</button>
          </div>
        </form>
      </div>
    </div>
  );
}
