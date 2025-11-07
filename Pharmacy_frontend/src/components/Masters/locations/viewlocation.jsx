import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./addlocations.css";

const ViewLocation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  const fetchLocation = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/locations/locations/${id}/`);
    const data = await res.json();
    setLocation(data);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  if (!location) return <p>Loading...</p>;

  return (
    <div className="customers-container">
      <h1 className="customers-title">View Location</h1>

      <div className="customers-form">

        <div className="form-row">
          <div className="form-group">
            <label>Code</label>
            <input value={location.code} disabled />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input value={location.name} disabled />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <input value={location.type} disabled />
          </div>

          <div className="form-group">
            <label>GSTIN</label>
            <input value={location.gstin} disabled />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <textarea value={location.address} disabled></textarea>
          </div>
        </div>

        <div className="checkbox-group">
          <label>Active</label>
          <input type="checkbox" checked={location.is_active} disabled />
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={() => navigate("/masters/locations")}>Back</button>
        </div>

      </div>
    </div>
  );
};

export default ViewLocation;
