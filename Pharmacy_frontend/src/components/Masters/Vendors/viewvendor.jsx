import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addvendors.css";

const ViewVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/procurement/vendors/${id}/`)
      .then((res) => res.json())
      .then((data) => setVendor(data));
  }, [id]);

  if (!vendor) return <p>Loading...</p>;

  return (
    <div className="vendors-container">
      <h1 className="vendors-title">View Vendor</h1>

      <div className="vendors-form">

        <div className="form-row">
          <div className="form-group">
            <label>Vendor Name:</label>
            <p>{vendor.name}</p>
          </div>

          <div className="form-group">
            <label>GSTIN:</label>
            <p>{vendor.gstin}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Number:</label>
            <p>{vendor.contact_phone}</p>
          </div>

          <div className="form-group">
            <label>Email:</label>
            <p>{vendor.email}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Person:</label>
            <p>{vendor.contact_person}</p>
          </div>

          <div className="form-group">
            <label>Payment Terms:</label>
            <p>{vendor.payment_terms}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bank Name:</label>
            <p>{vendor.bank_name}</p>
          </div>

          <div className="form-group">
            <label>Account No:</label>
            <p>{vendor.account_no}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>IFSC:</label>
            <p>{vendor.ifsc}</p>
          </div>

          <div className="form-group">
            <label>Rating:</label>
            <p>{vendor.rating}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address:</label>
            <p>{vendor.address}</p>
          </div>

          <div className="form-group">
            <label>Notes:</label>
            <p>{vendor.notes}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label>Status:</label>
            <p>{vendor.is_active ? "Active" : "Inactive"}</p>
          </div>
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={() => navigate("/masters/vendors")}>
            Back
          </button>
          <button className="submit-btn" onClick={() => navigate(`/masters/vendors/edit/${id}`)}>
            Edit
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewVendor;
