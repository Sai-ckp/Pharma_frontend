import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addsettings.css";

const EditSetting = () => {
  const navigate = useNavigate();
  const { key } = useParams();

  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: ""
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/settings/settings/${encodeURIComponent(key)}/`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          key: data.key || "",
          value: data.value || "",
          description: data.description || ""
        });
      })
      .catch(err => console.error("Failed to load setting", err));
  }, [key]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/settings/settings/${encodeURIComponent(key)}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Setting Updated!");
        navigate("/settings");
      } else {
        alert("Update Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="customers-container">
      <h1 className="customers-title">Edit Setting</h1>

      <form className="customers-form" onSubmit={handleUpdate}>
        <div className="form-row">
          <div className="form-group">
            <label>Key</label>
            <input
              type="text"
              name="key"
              value={formData.key}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Value</label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/settings")}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSetting;
