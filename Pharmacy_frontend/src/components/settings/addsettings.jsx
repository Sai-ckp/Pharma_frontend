import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addsettings.css";

const AddSetting = () => {
  const navigate = useNavigate();
  const { key } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: ""
  });

  useEffect(() => {
    if (key) {
      setIsEditMode(true);
      fetch(`http://127.0.0.1:8000/api/settings/${encodeURIComponent(key)}/`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            key: data.key || "",
            value: data.value || "",
            description: data.description || ""
          });
        })
        .catch(err => console.error("Failed to fetch setting", err));
    }
  }, [key]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEditMode
        ? `http://127.0.0.1:8000/api/settings/${encodeURIComponent(key)}/`
        : `http://127.0.0.1:8000/api/settings/`;

      const method = isEditMode ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(isEditMode ? "Setting Updated!" : "Setting Added!");
        navigate("/masters/settings");
      } else {
        alert("Save failed");
      }
    } catch (error) {
      console.error(error);
      alert("Save failed");
    }
  };

  return (
    <div className="customers-container">
      <h1 className="customers-title">
        {isEditMode ? "Edit Setting" : "Add Setting"}
      </h1>

      <form className="customers-form" onSubmit={handleSubmit}>

        <div className="form-row">
          <div className="form-group">
            <label>Key</label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="config.key.name"
              required
              readOnly={isEditMode}
            />
          </div>

          <div className="form-group">
            <label>Value</label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="value"
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
              placeholder="Short description (optional)"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/masters/settings")}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSetting;
