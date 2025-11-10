import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./vendorsdashboard.css";
import { Store, PhoneCall, Mail, Eye, Pencil, Trash2, Plus } from "lucide-react";

const VendorsDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const VENDORS_API = "http://127.0.0.1:8000/api/v1/procurement/vendors/";

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch(VENDORS_API);
      const data = await res.json();
      if (Array.isArray(data)) setVendors(data);
      else if (data?.results) setVendors(data.results);
      else if (data?.data) setVendors(data.data);
      else setVendors([]);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filtered = vendors.filter((v) => {
    const name = v.vendor_name ?? v.name ?? v.company_name ?? "";
    const contactPerson = v.vendor_contact_person ?? v.contact_person ?? v.person_name ?? "";
    const phone = v.vendor_contact ?? v.contact_phone ?? v.phone ?? "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openVendor = (vendor) => {
    navigate(`/masters/vendors/viewdetails/${vendor.id}`);
  };

  const goEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/masters/vendors/edit/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      const res = await fetch(`${VENDORS_API}${id}/`, { method: "DELETE" });
      if (res.ok) fetchVendors();
      else alert("Failed to delete vendor");
    } catch {
      alert("Delete failed");
    }
  };

  const handleAddSupplier = () => {
    navigate("/masters/vendors/add"); // Navigate to your add vendor page
  };

  return (
    <div className="customers-container vendors-page">
      <div className="header-row">
        <h1 className="customers-title">Supplier Management</h1>
        <button className="add-supplier-btn" onClick={handleAddSupplier}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <p className="customers-heading">Manage Suppliers and purchase orders</p>

      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search vendor name / contact person / phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading vendors...</p>
      ) : filtered.length === 0 ? (
        <div className="no-vendors-box"><p>No vendors found.</p></div>
      ) : (
        <div className="cards-grid">
          {filtered.map((vendor, idx) => {
            const id = vendor.id ?? idx;
            const name = vendor.vendor_name ?? vendor.name ?? vendor.company_name ?? "Untitled Vendor";
            const phone = vendor.vendor_contact ?? vendor.contact_phone ?? vendor.phone ?? "-";
            const contactPerson = vendor.vendor_contact_person ?? vendor.contact_person ?? vendor.person_name ?? "-";
            const email = vendor.vendor_email ?? vendor.email ?? "-";
            const productsCount = vendor.products_count ?? vendor.product_count ?? 0;
            const ordersCount = vendor.orders_count ?? vendor.order_count ?? 0;
            const totalAmount = vendor.total_amount ?? vendor.total_sales ?? 0;

            return (
              <div key={id} className="vendor-card clickable-card">
                {/* Card Top */}
                <div className="card-top" onClick={() => openVendor(vendor)}>
                  <div>
                    <div className="card-title">{name}</div>
                    <div className="contact-person-text">Contact: {contactPerson}</div>
                  </div>
                  <div className="card-icon"><Store size={20} /></div>
                </div>

                {/* Card Body */}
                <div className="card-body" onClick={() => openVendor(vendor)}>
                  <div className="contact-row">
                    <PhoneCall size={14} /><span>{phone}</span>
                  </div>
                  <div className="contact-row">
                    <Mail size={14} /><span>{email}</span>
                  </div>

                  <div className="metrics-row">
                    <div className="metric clickable" onClick={() => openVendor(vendor)}>
                      <div className="metric-value">{productsCount}</div>
                      <div className="metric-label">Products</div>
                    </div>
                    <div className="metric divider clickable" onClick={() => openVendor(vendor)}>
                      <div className="metric-value">{ordersCount}</div>
                      <div className="metric-label">Orders</div>
                    </div>
                    <div className="metric clickable" onClick={() => openVendor(vendor)}>
                      <div className="metric-value">₹ {totalAmount}</div>
                      <div className="metric-label">Amount</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="card-footer">
                  <div className={`status-badge ${vendor.is_active ? "active" : "inactive"}`}>
                    {vendor.is_active ? "Active" : "Inactive"}
                  </div>

                  <div className="action-icons">
                    <Eye className="icon" size={16} onClick={(e) => goEdit(e, id)} />
                    <Trash2 className="icon delete" size={16} onClick={(e) => handleDelete(e, id)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorsDashboard;
