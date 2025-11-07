import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./addlocations.css";

const EditLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "SHOP",
    address: "",
    gstin: "",
    is_active: true,
  });

  const fetchLocation = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/locations/locations/${id}/`);
    const data = await res.json();
    setFormData(data);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async () => {
    await fetch(`http://127.0.0.1:8000/api/v1/locations/locations/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    navigate("/masters/locations");
  };

  return (
    <div className="customers-container">
      <h1 className="customers-title">Edit Location</h1>

      <div className="customers-form">

        <div className="form-row">
          <div className="form-group">
            <label>Code</label>
            <input name="code" value={formData.code} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="SHOP">SHOP</option>
              <option value="WAREHOUSE">WAREHOUSE</option>
            </select>
          </div>

          <div className="form-group">
            <label>GSTIN</label>
            <input name="gstin" value={formData.gstin} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="checkbox-group">
          <label>Active</label>
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={() => navigate("/masters/locations")}>Cancel</button>
          <button className="submit-btn" onClick={handleUpdate}>Update</button>
        </div>

      </div>
    </div>
  );
};

export default EditLocation;
