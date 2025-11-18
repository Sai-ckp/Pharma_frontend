import React, { useState, useEffect } from "react";
import { CheckCircle, Package, ClipboardList, ArrowLeft } from "lucide-react";
import "./receiveitems.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { formatDateDDMMYYYY } from "../../../utils/dateFormat";
import { authFetch } from "../../../api/http";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ReceiveItems = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const vendor = location.state?.vendor;

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [receivingDetails, setReceivingDetails] = useState(null);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchPurchaseOrder();
    fetchReceivingDetails();
  }, []);

  /** FETCH PURCHASE ORDER + ITEMS */
  const fetchPurchaseOrder = async () => {
    const res = await authFetch(`${API_BASE_URL}/procurement/purchase-orders/${id}/`);
    const data = await res.json();

    setPurchaseOrder(data);
    setItems(
      data.items?.map((i) => ({
        ...i,
        received_qty: i.received_qty || 0,
        damaged_qty: i.damaged_qty || 0,
      })) || []
    );

    computeSummary(data.items || []);
  };

  /** FETCH GRN DETAILS */
  const fetchReceivingDetails = async () => {
    const res = await authFetch(`${API_BASE_URL}/procurement/purchase-orders/${id}/grns/`);
    const data = await res.json();

    if (data.results?.length > 0) {
      setReceivingDetails(data.results[0]);
    }
  };

  /** COMPUTE SUMMARY */
  const computeSummary = (itemsList) => {
    const totalOrdered = itemsList.reduce((sum, it) => sum + it.ordered_qty, 0);
    const totalReceived = itemsList.reduce((sum, it) => sum + (it.received_qty || 0), 0);

    setSummary({
      total_ordered: totalOrdered,
      total_received: totalReceived,
      completion:
        totalOrdered > 0 ? ((totalReceived / totalOrdered) * 100).toFixed(1) + "%" : "0%",
    });
  };

  /** HANDLE INPUT UPDATE */
  const updateItemField = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = Number(value);
    setItems(updated);
    computeSummary(updated);
  };

  if (!purchaseOrder) return <div>Loading...</div>;

  return (
    <div className="receiveitems-container">

      {/* ✅ Header with Back Button */}
      <div className="receiveitems-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="page-title">Receive Items</h1>
      </div>

      <div className="kpi-cards-grid">

        {/* CARD 1 — PO DETAILS */}
        <div className="kpi-card">
          <h3>Purchase Order Details</h3>
          <div className="kpi-item"><strong>PO Number:</strong> {purchaseOrder.po_number}</div>
          <div className="kpi-item"><strong>Supplier:</strong> {vendor?.name}</div>
          <div className="kpi-item">
            <strong>Order Date:</strong> {formatDateDDMMYYYY(purchaseOrder.order_date)}
          </div>
          <div className="kpi-item">
            <strong>Expected Date:</strong> {formatDateDDMMYYYY(purchaseOrder.expected_date)}
          </div>
        </div>

        {/* CARD 2 — RECEIVING DETAILS */}
        <div className="kpi-card">
          <h3>Receiving Details (GRN)</h3>
          {receivingDetails ? (
            <>
              <div className="kpi-item">
                <strong>Received Date:</strong> {formatDateDDMMYYYY(receivingDetails.received_date)}
              </div>
              <div className="kpi-item">
                <strong>Received By:</strong> {receivingDetails.received_by_name}
              </div>
              <div className="kpi-item">
                <strong>Invoice No:</strong> {receivingDetails.invoice_number}
              </div>
            </>
          ) : (
            <p>No GRN created yet.</p>
          )}
        </div>

        {/* CARD 3 — ITEMS RECEIVED TABLE */}
        <div className="kpi-card">
          <h3>Items Received</h3>
          <div className="table-wrapper">
            <table className="items-received-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Ordered</th>
                  <th>Received</th>
                  <th>Damaged</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.ordered_qty}</td>

                    {/* Received qty input */}
                    <td>
                      <input
                        type="number"
                        value={item.received_qty}
                        onChange={(e) =>
                          updateItemField(idx, "received_qty", e.target.value)
                        }
                        className="qty-input"
                      />
                    </td>

                    {/* Damaged qty input */}
                    <td>
                      <input
                        type="number"
                        value={item.damaged_qty}
                        onChange={(e) =>
                          updateItemField(idx, "damaged_qty", e.target.value)
                        }
                        className="qty-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD 4 — SUMMARY */}
        {summary && (
          <div className="kpi-card summary-card">
            <h3>Receiving Summary</h3>
            <div className="summary-row">
              <CheckCircle className="summary-icon" size={18} />
              <span>Total Ordered: {summary.total_ordered}</span>
            </div>
            <div className="summary-row">
              <Package className="summary-icon" size={18} />
              <span>Total Received: {summary.total_received}</span>
            </div>
            <div className="summary-row">
              <ClipboardList className="summary-icon" size={18} />
              <span>Completion: {summary.completion}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReceiveItems;
