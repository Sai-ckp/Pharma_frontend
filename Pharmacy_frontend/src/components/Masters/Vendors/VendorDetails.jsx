import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./vendorDetails.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/procurement/vendors/${id}/`);
        if (!res.ok) throw new Error("Vendor not found");
        const data = await res.json();
        setVendor(data);
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) return <p className="loading-text">Loading vendor details...</p>;
  if (!vendor) return <p className="loading-text">Vendor not found!</p>;

  return (
    <div className="customers-container">
      <div className="header-row">
        <h1 className="customers-title">{vendor.name || "Vendor Details"}</h1>
        <button className="add-btn" onClick={() => navigate("/masters/vendors")}>Back</button>
      </div>
      <p className="customers-heading">Supplier Details & KPIs</p>

      <div className="cards-grid">
        {/* Basic Info */}
        <div className="vendor-card">
          <h3 className="card-title">Basic Information</h3>
          <div className="card-body">
            <div className="contact-row"><strong>Phone:</strong> {vendor.contact_phone || "-"}</div>
            <div className="contact-row"><strong>Email:</strong> {vendor.email || "-"}</div>
            <div className="contact-row"><strong>Address:</strong> {vendor.address || "-"}</div>
            <div className="contact-row"><strong>GSTIN:</strong> {vendor.gstin || "-"}</div>
          </div>
        </div>

        {/* Supplier Status */}
        <div className="vendor-card">
          <h3 className="card-title">Supplier Status</h3>
          <div className="card-body">
            <div className="contact-row"><strong>Status:</strong> {vendor.is_active ? "Active" : "Inactive"}</div>
            <div className="contact-row"><strong>Payment Terms:</strong> {vendor.payment_terms || "-"}</div>
            <div className="contact-row"><strong>Rating:</strong> {vendor.rating || "N/A"}</div>
          </div>

          <div className="metrics-row">
            <div className="metric">
              <div className="metric-value">{vendor.supplied_products || 0}</div>
              <div className="metric-label">Products</div>
            </div>
            <div className="metric divider">
              <div className="metric-value">{vendor.total_purchases || 0}</div>
              <div className="metric-label">Orders</div>
            </div>
            <div className="metric">
              <div className="metric-value">₹ {vendor.total_amount || 0}</div>
              <div className="metric-label">Amount</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="vendor-card quick-actions-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="card-body quick-actions-body">
            {/* Pass vendor via state */}
            <button
              className="action-btn"
              onClick={() => navigate(`/masters/products`, { state: { vendor } })}
            >
              Create Order
            </button>
            <button
              className="action-btn"
              onClick={() => navigate(`/product-catalog/${id}`, { state: { vendor } })}
            >
              View Catalog
            </button>
            <button
              className="action-btn"
              onClick={() => navigate(`/masters/vendors/edit/${id}`, { state: { vendor } })}
            >
              Edit Supplier
            </button>
            <button
              className="action-btn"
              onClick={() => navigate(`/masters/products/purchase-orders/`, { state: { vendor } })}
            >
              Purchase Orders
            </button>
          </div>
        </div>

        {/* Bank Details */}
        <div className="vendor-card bank-card">
          <h3 className="card-title">Bank Details</h3>
          <div className="card-body">
            <div className="contact-row"><strong>Bank Name:</strong> {vendor.bank_name || "-"}</div>
            <div className="contact-row"><strong>Account No:</strong> {vendor.account_no || "-"}</div>
            <div className="contact-row"><strong>IFSC:</strong> {vendor.ifsc || "-"}</div>
            <div className="contact-row"><strong>Notes:</strong> {vendor.notes || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
