import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, Trash2, ArrowLeft } from "lucide-react";
import "./purchaseorders.css";
import { formatDateDDMMYYYY } from "../../../utils/dateFormat";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor || null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendor) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/purchaseorders/?vendor=${vendor.id}`
        );
        const data = await res.json();
        setOrders(data.results || []);
      } catch (err) {
        console.error("Error fetching purchase orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [vendor]);

  const handleView = (id) => navigate(`/masters/purchaseorders/${id}`);
  const handleReceiveItems = () =>
    navigate("/masters/products/receive-items/", { state: { vendor } });
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      console.log("Delete order id:", id);
      // TODO: Call delete API
    }
  };

  return (
    <div className="purchaseorders-container">
      {/* ✅ Header with Back Button */}
      <div className="purchaseorders-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="page-title">Purchase Orders</h1>
      </div>

      {vendor ? (
        <p className="vendor-name">Vendor: {vendor.name}</p>
      ) : (
        <p className="vendor-name" style={{ color: "red" }}>
          Vendor not selected. Please select a vendor to view orders.
        </p>
      )}

      <div className="header-row">
        {vendor && (
          <button className="receive-items-btn" onClick={handleReceiveItems}>
            Receive Items
          </button>
        )}
      </div>

      <div className="orders-table-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Order Date</th>
              <th>Expected Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="no-orders">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-orders">
                  No purchase orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.po_number}</td>
                  <td>{formatDateDDMMYYYY(order.order_date)}</td>
                  <td>{formatDateDDMMYYYY(order.expected_date)}</td>
                  <td>{order.items_count}</td>
                  <td>₹ {order.total_amount?.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td className="actions-cell">
                    <Eye
                      className="action-icon"
                      onClick={() => handleView(order.id)}
                    />
                    <Trash2
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(order.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;
