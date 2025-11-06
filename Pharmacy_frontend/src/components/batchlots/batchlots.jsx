import React, { useState } from "react";
import "./batchlots.css";

const Batchlots = () => {
  const [batchlots, setBatchlots] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    batchNo: "",
    expiryDate: "",
    status: "ACTIVE",
    recallReason: "",
    rackNo: "",
    createdAt: new Date().toLocaleString(),
  });

  // Auto-generate ID
  const generateId = () => {
    const next = batchlots.length + 1;
    return `BL${next.toString().padStart(3, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBatch = {
      id: generateId(),
      ...formData,
      createdAt: new Date().toLocaleString(),
    };

    setBatchlots([...batchlots, newBatch]);

    alert("✅ Batch Lot Created Successfully!");
    console.log("New Batch Lot:", newBatch);

    // Reset form
    setFormData({
      productId: "",
      batchNo: "",
      expiryDate: "",
      status: "ACTIVE",
      recallReason: "",
      rackNo: "",
      createdAt: new Date().toLocaleString(),
    });
  };

  return (
    <div className="batchlots">
      <h2>Create Batch Lot</h2>

      {/* ===== FORM SECTION ===== */}
      <form onSubmit={handleSubmit} className="batchForm">
        <div className="formGroup">
          <label>Product ID:</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="Enter Product ID"
            required
          />
        </div>

        <div className="formGroup">
          <label>Batch No:</label>
          <input
            type="text"
            name="batchNo"
            value={formData.batchNo}
            onChange={handleChange}
            placeholder="Enter Batch Number"
            required
          />
        </div>

        <div className="formGroup">
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="RETURNED">RETURNED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>

        <div className="formGroup">
          <label>Recall Reason:</label>
          <input
            type="text"
            name="recallReason"
            value={formData.recallReason}
            onChange={handleChange}
            placeholder="Enter reason if applicable"
          />
        </div>

        <div className="formGroup">
          <label>Rack No:</label>
          <input
            type="text"
            name="rackNo"
            value={formData.rackNo}
            onChange={handleChange}
            placeholder="Enter Rack/Bin No"
          />
        </div>

        <div className="formGroup">
          <label>Created At:</label>
          <input type="text" value={formData.createdAt} readOnly />
        </div>

        <button type="submit" className="submitBtn">
          Create Batch Lot
        </button>
      </form>

      {/* ===== LIST SECTION ===== */}
      <div className="batchList">
        <h3>📋 Batch Lot Records</h3>
        {batchlots.length === 0 ? (
          <p className="noRecords">No batch lots found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product ID</th>
                <th>Batch No</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Recall Reason</th>
                <th>Rack No</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {batchlots.map((batch, index) => (
                <tr key={index}>
                  <td>{batch.id}</td>
                  <td>{batch.productId}</td>
                  <td>{batch.batchNo}</td>
                  <td>{batch.expiryDate}</td>
                  <td>{batch.status}</td>
                  <td>{batch.recallReason || "N/A"}</td>
                  <td>{batch.rackNo}</td>
                  <td>{batch.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Batchlots;
