import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import "./createorder.css";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

const CreateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor;

  const [vendorData, setVendorData] = useState(null);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!vendor) {
      navigate("/masters/vendors");
      return;
    }

    const fetchVendor = async () => {
      try {
        const res = await fetch(`${API_BASE}/procurement/vendors/${vendor.id}/`);
        if (res.ok) {
          const data = await res.json();
          setVendorData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchVendor();
  }, [vendor, navigate]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/catalog/products/`);
      const data = await res.json();
      setItems(data.results ? data.results.map((p) => ({ ...p, quantity: 0 })) : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (vendorData) fetchItems();
  }, [vendorData]);

  useEffect(() => {
    if (location.state?.refresh === true) {
      fetchItems();
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  useEffect(() => {
    const totalQty = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const sub = items.reduce(
      (acc, item) => acc + (item.quantity || 0) * (item.mrp || 0),
      0
    );
    const gstAmount = sub * 0.12;

    setTotalItems(totalQty);
    setSubtotal(sub);
    setGst(gstAmount);
    setTotalAmount(sub + gstAmount);
  }, [items]);

  const handleAddProduct = () => {
    navigate("/masters/products/add", {
      state: {
        vendor: vendorData,
        from: "create-order",
      },
    });
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...items];
    updated[index].quantity = Number(value);
    setItems(updated);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${API_BASE}/catalog/products/${productId}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrder = async () => {
    if (!vendorData) return;

    const orderItems = items.filter((item) => item.quantity > 0);

    if (orderItems.length === 0) {
      alert("Please add at least one product before creating an order.");
      return;
    }

    const payload = {
      vendor: Number(vendorData.id),
      location: Number(vendorData.default_location || 1),
      order_date: orderDate,
      expected_date: expectedDate,
      note: notes,
      lines: orderItems.map((item) => ({
        product: Number(item.id),
        qty_packs_ordered: Number(item.quantity),
        expected_unit_cost: Number(item.mrp),
        gst_percent_override: 12.0,
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/procurement/purchase-orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Purchase Order Created Successfully!");
        navigate("/procurement/orders");
      } else {
        const err = await res.text();
        console.error("Backend Error:", err);
        alert("Failed to create order.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving the order.");
    }
  };

  if (!vendorData) return null;

  return (
    <div className="createorder-container">
      {/* HEADER: Back + Title like AddVendor */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="page-title">Create Order</h1>
      </div>

      <div className="order-main">
        {/* LEFT SECTION */}
        <div className="left-section">
          <div className="kpi-card">
            <h3>Supplier Info</h3>
            <div className="kpi-item">Supplier: {vendorData.name}</div>
            <div className="kpi-item">
              Order Date:
              <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
          </div>

          <div className="kpi-card add-product-card">
            <div className="card-header">
              <h3>Order Items</h3>
              <button className="add-btn" onClick={handleAddProduct}>+ Add Product</button>
            </div>

            {items.length === 0 ? (
              <div className="no-products">No products added yet.</div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={item.quantity || 0}
                          onChange={(e) => handleQuantityChange(idx, e.target.value)}
                        />
                      </td>
                      <td>₹ {item.mrp}</td>
                      <td>₹ {(item.quantity * item.mrp || 0).toFixed(2)}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={18} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="kpi-card">
            <h3>Additional Information</h3>
            <div className="kpi-item">
              Expected Delivery:
              <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </div>
            <div className="kpi-item">
              Notes:
              <textarea placeholder="Enter notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <div className="kpi-card summary-card">
            <h3>Summary</h3>
            <div className="kpi-item">Total Items: {totalItems}</div>
            <div className="kpi-item">Subtotal: ₹ {subtotal.toFixed(2)}</div>
            <div className="kpi-item">GST (12%): ₹ {gst.toFixed(2)}</div>
            <div className="kpi-item total">Total Amount: ₹ {totalAmount.toFixed(2)}</div>
          </div>

          <div className="form-actions">
            <button className="submit-btn" onClick={handleCreateOrder}>Create Order</button>
            <button className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
