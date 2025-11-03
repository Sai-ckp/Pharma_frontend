import React, { useEffect, useState } from "react";
import "./item.css";

const API_BASE = "http://127.0.0.1:8000/api/";

const Items = () => {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    vendor: "",
    unit: "",
    quantity: "",
    purchase_rate: "",
    selling_price: "",
    mrp: "",
    expiry_date: "",
    reorder_level: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch items
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}items/`);
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("❌ Failed to load items.");
    }
  };

  // ✅ Fetch dropdown data
  const fetchDropdowns = async () => {
    try {
      const [vendorRes, categoryRes, unitRes] = await Promise.all([
        fetch(`${API_BASE}vendors/`),
        fetch(`${API_BASE}categories/`),
        fetch(`${API_BASE}units/`),
      ]);
      setVendors(await vendorRes.json());
      setCategories(await categoryRes.json());
      setUnits(await unitRes.json());
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      alert("⚠️ Failed to load dropdowns.");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchDropdowns();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit form (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE}items/${editingId}/`
        : `${API_BASE}items/`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Save failed");

      alert(editingId ? "✅ Item updated successfully!" : "✅ Item added!");
      setFormData({
        code: "",
        name: "",
        category: "",
        vendor: "",
        unit: "",
        quantity: "",
        purchase_rate: "",
        selling_price: "",
        mrp: "",
        expiry_date: "",
        reorder_level: "",
        description: "",
      });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("❌ Error saving item!");
    }
  };

  // ✅ Edit item
  const handleEdit = (item) => {
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      vendor: item.vendor,
      unit: item.unit,
      quantity: item.quantity,
      purchase_rate: item.purchase_rate,
      selling_price: item.selling_price,
      mrp: item.mrp,
      expiry_date: item.expiry_date,
      reorder_level: item.reorder_level,
      description: item.description,
    });
    setEditingId(item.id);
  };

  // ✅ Delete item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`${API_BASE}items/${id}/`, { method: "DELETE" });
        if (res.ok) {
          fetchItems();
          alert("🗑️ Item deleted successfully!");
        } else throw new Error();
      } catch (error) {
        alert("❌ Failed to delete item.");
      }
    }
  };

  return (
    <div className="items-container">
      <h1 className="items-title">Item Management</h1>

      <p className="items-description">
        🧾 Manage all your medicines and products with category, vendor, unit, and pricing.
      </p>

      <div className="items-card">
        <h3>{editingId ? "Edit Item" : "Add Item"}</h3>
        <form className="items-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Item Code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter item code"
                required
              />
            </div>
            <div className="form-group">
              <label>Item Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Vendor:</label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit:</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Purchase Rate:</label>
              <input
                type="number"
                name="purchase_rate"
                value={formData.purchase_rate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Selling Price:</label>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>MRP:</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date:</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Reorder Level:</label>
              <input
                type="number"
                name="reorder_level"
                value={formData.reorder_level}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
            ></textarea>
          </div>

          <button className="submit-btn" type="submit">
            {editingId ? "Update Item" : "Save Item"}
          </button>
        </form>
      </div>

      <h3>Item List</h3>
      <table className="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Vendor</th>
            <th>Unit</th>
            <th>Qty</th>
            <th>MRP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.category_name}</td>
                <td>{item.vendor_name}</td>
                <td>{item.unit_name}</td>
                <td>{item.quantity}</td>
                <td>{item.mrp}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Items;
