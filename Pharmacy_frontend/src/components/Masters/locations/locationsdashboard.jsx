import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./locationsdashboard.css";


const LocationsDashboard = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const fetchLocations = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/locations/");
    const data = await res.json();
    setLocations(data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="customers-container">
      <div className="flex justify-between items-center">
        <h1 className="customers-title">Locations Management</h1>

        <button className="add-btn" onClick={() => navigate("/masters/locations/add")}>
          + Add Location
        </button>
      </div>

      <h2 className="customers-heading">Manage Shop & Warehouse Locations inside the system</h2>

      <div className="customers-list">
        <h3>Locations List</h3>

        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Address</th>
              <th>GSTIN</th>
              <th>Active</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.code}</td>
                <td>{l.name}</td>
                <td>{l.type}</td>
                <td>{l.address}</td>
                <td>{l.gstin}</td>
                <td>{l.is_active ? "Yes" : "No"}</td>
              </tr>
            ))}

            {locations.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">No locations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationsDashboard;
