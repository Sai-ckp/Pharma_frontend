import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phone, Mail, MapPin, UserCheck } from "lucide-react";
import "./customerdetails.css";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (!id || fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/customers/${id}/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <p>Loading customer details...</p>;
  if (!customer) return <p>Customer not found!</p>;

  return (
    <div className="customer-details-container">
      {/* Header */}
      <div className="customer-header">
  <button className="back-btn" onClick={() => navigate(-1)}>
    ← Back
  </button>
  <h1 className="customer-name">{customer.name}</h1>
</div>


      {/* KPI Cards */}
      <div className="customer-kpi-container">
        {/* Contact Info */}
        <div className="kpi-card contact-info">
          <h3>Contact Information</h3>
          <div className="contact-item">
            <Phone size={18} /> <span>{customer.phone || "-"}</span>
          </div>
          <div className="contact-item">
            <Mail size={18} /> <span>{customer.email || "-"}</span>
          </div>
          <div className="contact-item">
            <MapPin size={18} /> <span>{customer.shipping_address || "-"}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="kpi-card additional-info">
          <h3>Additional Actions</h3>
          <div className="additional-btns">
            <button className="info-btn">Additional Info</button>
            <button className="info-btn">Bills & Invoice</button>
          </div>
        </div>

        {/* Customer Status */}
        <div className="kpi-card customer-status small-card">
          <h3>Customer Status</h3>
          <div className="status-icon">
            <UserCheck size={30} />
          </div>
          <p>{customer.is_active ? "Active" : "Inactive"}</p>
          <p>Total Bills: {customer.total_bills || 0}</p>
        </div>

        {/* Purchase Stats */}
        <div className="kpi-card purchase-stats">
          <h3>Purchase Statistics</h3>
          <p>Total Purchases: {customer.total_purchases || 0}</p>
          <p>Average Bill Value: ₹ {customer.avg_bill_value || 0}</p>
        </div>

        {/* This Month */}
        <div className="kpi-card this-month">
          <h3>This Month</h3>
          <p>Visits: {customer.visits_this_month || 0}</p>
          <p>Amount Spent: ₹ {customer.amount_spent_this_month || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
