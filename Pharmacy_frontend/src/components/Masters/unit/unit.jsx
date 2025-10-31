import React from "react";
import "./unit.css";

const Units = () => {
  return (
    <div className="units-container">
      <h1 className="units-title">Unit Management</h1>

      <p className="units-description">
        ✅ Manage your measurement units (e.g., Box, Strip, Bottle, Tablet).
      </p>

      <div className="units-card">
        <h3>Add / View Units</h3>
        <form className="units-form">
          <div className="form-group">
            <label>Unit Name:</label>
            <input type="text" placeholder="Enter unit name" />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea placeholder="Enter description"></textarea>
          </div>

          <button className="submit-btn">Save Unit</button>
        </form>
      </div>
    </div>
  );
};

export default Units;
