import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { authFetch } from "../../../api/http";
import { formatDateDDMMYYYY } from "../../../utils/dateFormat";
import "./vendorDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [suppliedProducts, setSuppliedProducts] = useState([]);

  const [activeTab, setActiveTab] = useState("purchase");

  // Fetch Vendor Basic Details
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

  // Fetch Purchase Orders
  useEffect(() => {
    if (!vendor) return;

    const loadPurchaseHistory = async () => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/procurement/purchase-orders/?vendor=${vendor.id}`
        );

        const data = await res.json();
        const orders = data.results || data || [];

        // EXTRA SAFETY — React-side vendor filter
        const filteredOrders = orders.filter(
          (ord) => Number(ord.vendor) === Number(vendor.id)
        );

        setPurchaseHistory(filteredOrders);
      } catch (err) {
        console.error("Error loading purchase history:", err);
      }
    };

    loadPurchaseHistory();
  }, [vendor]);

  // Fetch Supplied Products
  useEffect(() => {
    if (!vendor) return;

    const loadSuppliedProducts = async () => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/catalog/products/?vendor=${vendor.id}`
        );

        const data = await res.json();
        const productsList = data.results || data;

        // EXTRA SAFETY — React-side vendor filter
        const filteredProducts = productsList.filter(
          (prod) => Number(prod.vendor) === Number(vendor.id)
        );

        setSuppliedProducts(filteredProducts);
      } catch (err) {
        console.error("Failed to fetch vendor products:", err);
        setSuppliedProducts([]);
      }
    };

    loadSuppliedProducts();
  }, [vendor]);

  if (loading) return <p className="loading-text">Loading vendor details...</p>;
  if (!vendor) return <p className="loading-text">Vendor not found!</p>;

  return (
    <div className="customers-container">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/masters/vendors")}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="vendors-title">{vendor.name || "Vendor Details"}</h1>
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
              <div className="metric-value">{suppliedProducts.length}</div>
              <div className="metric-label">Products</div>
            </div>
            <div className="metric ">
              <div className="metric-value">{purchaseHistory.length}</div>
              <div className="metric-label">Orders</div>
            </div>
           
          </div>
        </div>

        {/* Quick Actions */}
        <div className="vendor-card quick-actions-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="card-body quick-actions-body">
            <button className="action-btn" onClick={() => navigate(`/masters/products`, { state: { vendor } })}>Create Order</button>
            <button className="action-btn" onClick={() => navigate(`/masters/products/vendor-catalog/${id}`, { state: { vendor } })}>View Catalog</button>
            <button className="action-btn" onClick={() => navigate(`/masters/vendors/edit/${id}`, { state: { vendor } })}>Edit Supplier</button>
            <button className="action-btn" onClick={() => navigate(`/masters/products/purchase-orders/`, { state: { vendor } })}>Purchase Orders</button>
            <button className="action-btn" onClick={() => navigate(`/masters/vendors/import`, { state: { vendor } })}> Import</button>

          </div>
        </div>

        {/* TAB SECTION */}
        <div className="vendor-card">
          <div className="tabs">
            <div
              className={`tab ${activeTab === "purchase" ? "active" : ""}`}
              onClick={() => setActiveTab("purchase")}
            >
              Purchase History
            </div>
            <div
              className={`tab ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Supplied Products
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="card-body">
            {activeTab === "purchase" && (
              <table className="table">
                <thead>
                  <tr>
                    <th>PO No</th>
                    <th>Order Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.length === 0 ? (
                    <tr><td colSpan="3">No purchase history found.</td></tr>
                  ) : (
                    purchaseHistory.map((order) => (
                      <tr key={order.id}>
                        <td>{order.po_number}</td>
                        <td>{formatDateDDMMYYYY(order.order_date)}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "products" && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliedProducts.length === 0 ? (
                    <tr><td colSpan="3">No products supplied.</td></tr>
                  ) : (
                    suppliedProducts.map((prod) => (
                      <tr key={prod.id}>
                        <td>{prod.name}</td>
                        <td>{prod.category_name || "-"}</td>
                        <td>{prod.is_active ? "Active" : "Inactive"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
