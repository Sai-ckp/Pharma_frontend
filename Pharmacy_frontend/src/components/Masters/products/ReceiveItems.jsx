import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CheckCircle, Package, ClipboardList, ArrowLeft } from "lucide-react";
import "./receiveitems.css";
import { formatDateDDMMYYYY } from "../../../utils/dateFormat";
import { authFetch } from "../../../api/http";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ReceiveItems = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // PO ID
  const location = useLocation();
  const vendor = location.state?.vendor || null;

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [receivingDetails, setReceivingDetails] = useState(null);
  const [itemsReceived, setItemsReceived] = useState([]);
  const [summary, setSummary] = useState({ total_ordered: 0, total_received: 0, completion: "0%" });
  const [loading, setLoading] = useState(true);

  // Fetch PO + lines
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const poRes = await authFetch(`${API_BASE_URL}/procurement/purchase-orders/${id}/`);
        if (!poRes.ok) throw new Error("PO not found");
        const poData = await poRes.json();

        const recRes = await authFetch(`${API_BASE_URL}/procurement/purchase-orders/${id}/receiving/`);
        let receivingData = recRes.ok ? await recRes.json() : null;

        const linesRes = await authFetch(`${API_BASE_URL}/procurement/purchase-orders/${id}/lines/`);
        let linesData = [];
        if (linesRes.ok) {
          const linesJson = await linesRes.json();
          linesData = Array.isArray(linesJson) ? linesJson : linesJson?.lines || [];
        }

        const productIdSet = new Set();
        linesData.forEach(item => {
          if (item.product && typeof item.product === "number") {
            productIdSet.add(item.product);
          }
        });

        const productIdToName = {};
        await Promise.all(
          [...productIdSet].map(async (pid) => {
            const prodRes = await authFetch(`${API_BASE_URL}/catalog/products/${pid}/`);
            if (prodRes.ok) {
              const p = await prodRes.json();
              productIdToName[pid] = p.name;
            }
          })
        );

        setItemsReceived(
          linesData.map(item => ({
            id: item.id,
            po_line: item.id,
            product_id:
              item.product?.id ||
              (typeof item.product === "object" ? item.product.id : item.product),
            product_name:
              (item.product && typeof item.product === "object" && item.product.name) ||
              (item.product_details && item.product_details.name) ||
              (productIdToName[item.product] || ""),
            ordered: item.qty_packs_ordered || 0,
            received: "",
            damaged: "",
            batch: "",
            mfg_date: "",
            expiry_date: "",
            unit_cost: item.expected_unit_cost || "",
            mrp: item.mrp || "",
          }))
        );

        const totalOrdered = linesData.reduce(
          (acc, item) => acc + Number(item.qty_packs_ordered || 0),
          0
        );

        setSummary({ total_ordered: totalOrdered, total_received: 0, completion: "0%" });

        setPurchaseOrder({
          id: poData.id,
          po_number: poData.po_number,
          supplier: vendor ? vendor.name : poData.vendor_name || "",
          vendor_id: vendor?.id || poData.vendor?.id,
          location_id: poData.location_id,
          order_date: poData.order_date,
          expected_date: poData.expected_date,
        });

        setReceivingDetails(receivingData);
      } catch (err) {
        setPurchaseOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Handle input changes
  const handleItemEdit = (idx, field, value) => {
    setItemsReceived(prev =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // Summary updates
  useEffect(() => {
    const totalReceived = itemsReceived.reduce(
      (acc, item) => acc + Number(item.received || 0),
      0
    );

    const completion =
      summary.total_ordered > 0
        ? ((totalReceived / summary.total_ordered) * 100).toFixed(1) + "%"
        : "0%";

    setSummary(prev => ({ ...prev, total_received: totalReceived, completion }));
  }, [itemsReceived, summary.total_ordered]);

  // POST GRN
  const handleCompleteReceiving = async () => {
    if (!purchaseOrder) {
      alert("Purchase Order not loaded!");
      return;
    }

    // UI validation
    for (let i = 0; i < itemsReceived.length; i++) {
      const item = itemsReceived[i];
      if (!item.received || !item.batch || !item.mfg_date) {
        alert(`Missing required fields in row ${i + 1}`);
        return;
      }
    }

    // GRN payload
   const grnPayload = {
  po: purchaseOrder.id,
  location:
    purchaseOrder.location_id ||
    purchaseOrder.location ||
    purchaseOrder.location_details?.id ||
    purchaseOrder.location_data?.id ||
    null,

  received_by: null,
  received_at: new Date().toISOString(),
  supplier_invoice_no: "",
  supplier_invoice_date: null,
  note: "",
  status: "DRAFT",

  lines: itemsReceived.map(item => ({
    grn: null,
    po_line: item.po_line,
    product: item.product_id,
    batch_no: item.batch,
    mfg_date: item.mfg_date,
    expiry_date: item.expiry_date || null,
    qty_packs_received: Number(item.received),
    qty_base_received: String(Number(item.received)),
    qty_base_damaged: String(Number(item.damaged || 0)),
    unit_cost: String(item.unit_cost || "0"),
    mrp: String(item.mrp || "0"),
  })),
};


    try {
      const res = await authFetch(`${API_BASE_URL}/procurement/grns/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grnPayload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert("GRN creation failed: " + JSON.stringify(data));
        return;
      }

      // post/commit GRN
      if (data?.id) {
        const postRes = await authFetch(`${API_BASE_URL}/procurement/grns/${data.id}/post/`, {
          method: "POST",
        });

        if (postRes.ok) {
          alert("Goods Receipt created & posted!");
          navigate(-1);
        } else {
          const p = await postRes.json().catch(() => null);
          alert("GRN created but posting failed: " + JSON.stringify(p));
        }
      }
    } catch (err) {
      alert("Error creating GRN. Check console.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="receiveitems-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="page-title">Receive Items</h1>
        <p className="loading-text">Loading...</p>
      </div>
    );

  if (!purchaseOrder)
    return (
      <div className="receiveitems-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="page-title">Receive Items</h1>
        <p className="loading-text">Purchase Order not found.</p>
      </div>
    );

  return (
    <div className="receiveitems-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <h1 className="page-title">Receive Items</h1>

      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <h3>Purchase Order Details</h3>
          <div className="kpi-item"><strong>PO Number:</strong> {purchaseOrder.po_number}</div>
          <div className="kpi-item"><strong>Supplier:</strong> {purchaseOrder.supplier}</div>
          <div className="kpi-item"><strong>Order Date:</strong> {formatDateDDMMYYYY(purchaseOrder.order_date)}</div>
          <div className="kpi-item"><strong>Expected Date:</strong> {formatDateDDMMYYYY(purchaseOrder.expected_date)}</div>
        </div>

        <div className="kpi-card">
          <h3>Receiving Details</h3>
          {receivingDetails ? (
            <>
              <div className="kpi-item"><strong>Received Date:</strong> {formatDateDDMMYYYY(receivingDetails.received_date)}</div>
              <div className="kpi-item"><strong>Received By:</strong> {receivingDetails.received_by}</div>
              <div className="kpi-item"><strong>Invoice Number:</strong> {receivingDetails.invoice_number}</div>
            </>
          ) : (
            <div className="kpi-item" style={{ color: "#d97706" }}>Not yet received</div>
          )}
        </div>

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
                  <th>Batch</th>
                  <th>MFG Date</th>
                  <th>Expiry Date</th>
                  <th>Unit Cost</th>
                  <th>MRP</th>
                </tr>
              </thead>
              <tbody>
                {itemsReceived.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.ordered}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={item.received}
                        onChange={e => handleItemEdit(idx, "received", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={item.damaged}
                        onChange={e => handleItemEdit(idx, "damaged", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.batch}
                        onChange={e => handleItemEdit(idx, "batch", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={item.mfg_date}
                        onChange={e => handleItemEdit(idx, "mfg_date", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={item.expiry_date}
                        onChange={e => handleItemEdit(idx, "expiry_date", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={e => handleItemEdit(idx, "unit_cost", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={item.mrp}
                        onChange={e => handleItemEdit(idx, "mrp", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="kpi-card summary-card">
          <h3>Receiving Summary</h3>
          <div className="summary-row">
            <CheckCircle size={16} /> Total Ordered: {summary.total_ordered}
          </div>
          <div className="summary-row">
            <Package size={16} /> Total Received: {summary.total_received}
          </div>
          <div className="summary-row">
            <ClipboardList size={16} /> Completion: {summary.completion}
          </div>
          <button className="complete-btn" onClick={handleCompleteReceiving}>
            Complete Receiving
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveItems;
