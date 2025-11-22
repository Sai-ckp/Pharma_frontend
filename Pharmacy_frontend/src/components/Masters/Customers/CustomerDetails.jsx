import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phone, Mail, MapPin, UserCheck } from "lucide-react";
import "./customerdetails.css";
import { authFetch } from "../../../api/http";

const API_BASE = import.meta.env.VITE_API_URL;

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showInvoices, setShowInvoices] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

  const fetchedOnce = useRef(false);

  // Fetch customer details
  useEffect(() => {
    if (!id || fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`${API_BASE}/customers/${id}/`);
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
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

  // Load invoices belonging to this customer
  const loadInvoices = async () => {
    setShowInvoices(!showInvoices);

    if (!showInvoices) {
      setInvoiceLoading(true);

      try {
        const res = await authFetch(
          `${API_BASE}/sales/invoices/?customer=${id}&ordering=-invoice_date`
        );

        if (res.ok) {
          const data = await res.json();
          setInvoices(Array.isArray(data) ? data : data.results || []);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Invoice fetch error:", err);
        setInvoices([]);
      } finally {
        setInvoiceLoading(false);
      }
    }
  };

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

      {/* KPI CARDS */}
      <div className="customer-kpi-container">
        {/* Contact Info */}
        <div className="kpi-card contact-info">
          <h3>Contact Information</h3>
          <div className="contact-item">
            <Phone size={18} /> {customer.phone || "-"}
          </div>
          <div className="contact-item">
            <Mail size={18} /> {customer.email || "-"}
          </div>
          <div className="contact-item">
            <MapPin size={18} /> {customer.shipping_address || "-"}
          </div>
        </div>

        {/* Additional Info */}
        <div className="kpi-card additional-info">
          <h3>Additional Actions</h3>
          <div className="additional-btns">
            <button className="info-btn" onClick={loadInvoices}>
              Bills & Invoice
            </button>
          </div>

          {/* Invoice Section */}
          {showInvoices && (
            <div className="invoice-table-wrapper">
              <h4 style={{ marginTop: "10px" }}>Bills & Invoices</h4>

              {invoiceLoading ? (
                <p>Loading invoices...</p>
              ) : (
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-data">
                          No invoices found
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td>{inv.invoice_no}</td>
                          <td>{inv.invoice_date?.slice(0, 10)}</td>

                          {/* Items Column */}
                          <td>
                            {inv.lines && inv.lines.length > 0
                              ? inv.lines
                                  .map((l) => l.product_name || "-")
                                  .join(", ")
                              : "-"}
                          </td>

                          <td>₹ {inv.net_total}</td>
                          <td>{inv.payment_status || "-"}</td>
                          <td
                            className={
                              inv.status === "PAID" ? "paid" : "pending"
                            }
                          >
                            {inv.status}
                          </td>

                          <td>
                            <button
                              className="view-btn"
                              onClick={() =>
                                navigate(`/billgeneration/invoice/${inv.id}`)
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Customer Status */}
        <div className="kpi-card customer-status small-card">
          <h3>Customer Status</h3>
          <UserCheck size={30} />
          <p>{customer.is_active ? "Active" : "Inactive"}</p>
          <p>Total Bills: {customer.total_bills || 0}</p>
        </div>

        {/* Purchase Stats */}
        <div className="kpi-card purchase-stats">
          <h3>Purchase Stats</h3>
          <p>Total Purchases: {customer.total_purchases || 0}</p>
          <p>Avg Bill: ₹ {customer.avg_bill_value || 0}</p>
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
