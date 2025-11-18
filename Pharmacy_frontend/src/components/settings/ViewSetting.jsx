import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addsettings.css";
import { authFetch } from "../../api/http";

const ViewSetting = () => {
  const navigate = useNavigate();
  const { key } = useParams();
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: ""
  });

  useEffect(() => {
    authFetch(`http://127.0.0.1:8000/api/v1/settings/settings/${encodeURIComponent(key)}/`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          key: data.key || "",
          value: data.value || "",
          description: data.description || ""
        });
      })
      .catch(err => console.error("Failed to fetch setting", err));
  }, [key]);

  return (
    <div className="customers-container">
      <h1 className="customers-title">View Setting</h1>

      <div className="customers-form">

        <div className="form-row">
          <div className="form-group">
            <label>Key</label>
            <input type="text" value={formData.key} readOnly />
          </div>

          <div className="form-group">
            <label>Value</label>
            <input type="text" value={formData.value} readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Description</label>
            <textarea value={formData.description} readOnly />
          </div>
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={() => navigate("/settings")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSetting;
