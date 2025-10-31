import React from "react";
import "./item.css";

const Items = () => {
  return (
    <div className="items-container">
      <h1 className="items-title">Item Management</h1>

      <p className="items-description">
        🧾 Manage all your medicines and products with category, vendor, unit, and pricing.
      </p>

      <div className="items-card">
        <h3>Add / View Items</h3>
        <form className="items-form">
          <div className="form-row">
            <div className="form-group">
              <label>Item Code:</label>
              <input type="text" placeholder="Enter item code" />
            </div>
            <div className="form-group">
              <label>Item Name:</label>
              <input type="text" placeholder="Enter item name" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <select>
                <option>Select Category</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vendor:</label>
              <select>
                <option>Select Vendor</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit:</label>
              <select>
                <option>Select Unit</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input type="number" placeholder="Enter quantity" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Purchase Rate:</label>
              <input type="number" placeholder="Enter purchase rate" />
            </div>
            <div className="form-group">
              <label>Selling Price:</label>
              <input type="number" placeholder="Enter selling price" />
            </div>
            <div className="form-group">
              <label>MRP:</label>
              <input type="number" placeholder="Enter MRP" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date:</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Reorder Level:</label>
              <input type="number" placeholder="Enter reorder level" />
            </div>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea placeholder="Enter item description"></textarea>
          </div>

          <button className="submit-btn">Save Item</button>
        </form>
      </div>
    </div>
  );
};

export default Items;
