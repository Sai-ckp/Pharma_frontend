import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Package,
  ChevronDown,
  ChevronRight,
  Smartphone,
  Boxes,
  ShieldAlert,
  FileSignature,
  RefreshCcw,
  Receipt,
  Box,
  Pill,
  Layers,
  ShoppingBag,
  BookText,
  Undo2,
  ArrowLeftRight,
  FileText,
  ReceiptText,
  ClipboardCheck,
  ClipboardList,
  UserCog,
  Store,
  UserCircle,
  ShieldCheck,
  MapPin,
  ShoppingCart,
  FlaskRound,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);

  const masterItems = [
    { path: "/masters/vendors", label: "Vendors", icon: <Store size={18} /> },
    { path: "/masters/customers", label: "Customers", icon: <UserCircle size={18} /> },
    { path: "/masters/roles", label: "Roles", icon: <ShieldCheck size={18} /> },
    { path: "/masters/locations", label: "Locations", icon: <MapPin size={18} /> },
    { path: "/masters/products", label: "Products", icon: <FlaskRound size={18} /> },
    { path: "/users", label: "Users", icon: <UserCog size={18} /> },
  ];

  const userItems = [
    { path: "/user-devices", label: "User Devices", icon: <Smartphone size={18} /> },           // Device management
    // inventory ledger kept Boxes but you can swap to Package/Database if you want
    { path: "/inventory-ledger", label: "Inventory Ledger", icon: <Boxes size={18} /> },        // Inventory tracking
    { path: "/transfer-vouchers", label: "Transfer Vouchers", icon: <ArrowLeftRight size={18} /> }, // Transfer documents
    { path: "/breach-logs", label: "Breach Logs", icon: <ShieldAlert size={18} /> },            // Security-related logs
    { path: "/audit-logs", label: "Audit Logs", icon: <FileSignature size={18} /> },            // Audit trail / compliance
    { path: "/recall-events", label: "Recall Events", icon: <RefreshCcw size={18} /> },         // Recall / return events
    // PURCHASE LINES: cart + tiny animated pill badge (pharmacy)
    { path: "/purchase-lines", label: "Purchase Lines", icon: <ShoppingCart size={18} />, purchase: true },     // Purchase-related
    { path: "/sales-invoices", label: "Sales Invoices", icon: <Receipt size={18} /> },          // Billing / sales invoices
  ];

  const otherMenuItems = [
    // SETTINGS: gear with gentle rotate-on-hover
    { path: "/settings", label: "Settings", icon: <Settings size={18} />, anim: "settings" },
    // RETENTION POLICIES: package icon with soft pulse
    { path: "/retention-policies", label: "Retention Policies", icon: <Package size={18} />, anim: "pulse" },
    { path: "/pharmacy", label: "Pharmacy", icon: <Pill size={18} /> },
    { path: "/rackrules", label: "Rack Rules", icon: <Layers size={18} /> },
    { path: "/batchlots", label: "Batch Lots", icon: <Box size={18} /> },
    { path: "/purchases", label: "Purchases", icon: <ShoppingBag size={18} /> },
    { path: "/consentledger", label: "Consent Ledger", icon: <BookText size={18} /> },
    { path: "/vendorreturns", label: "Vendor Returns", icon: <Undo2 size={18} /> },
    { path: "/transferlines", label: "Transfer Lines", icon: <ArrowLeftRight size={18} /> },
    { path: "/prescriptions", label: "Prescriptions", icon: <FileText size={18} /> },
    { path: "/saleslines", label: "Sales Lines", icon: <ReceiptText size={18} /> },
    { path: "/h1registerentries", label: "Register Entries", icon: <ClipboardCheck size={18} /> },
    { path: "/ndpsdailyentries", label: "NDPS Daily Entries", icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo-wrap">
          <img
            src="https://image2url.com/images/1762228868711-92532987-d9ed-48dc-902b-ffb845d41cdc.jpeg"
            alt="logo"
            className="sidebar-logo"
          />
          <div className="sidebar-brand-multi">
            <span className="brand-line1">Keshav Medicals</span>
            <span className="brand-line2">Management System</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-menu">
        {/* Dashboard */}
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
          <span className="sidebar-label">Dashboard</span>
        </NavLink>

        {/* Masters */}
        <div className="sidebar-link sidebar-dropdown" onClick={() => setIsMastersOpen(!isMastersOpen)}>
          <div className="sidebar-dropdown-left">
            <span className="sidebar-icon"><Settings size={18} /></span>
            <div className="masters-title">
              <span className="sidebar-label">Masters</span>
              <span className="masters-small-font">Master Panel</span>
            </div>
          </div>
          <span className="sidebar-chevron">
            {isMastersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>

        {isMastersOpen && (
          <div className="sidebar-submenu">
            {masterItems.map((item, idx) => (
              <NavLink key={idx} to={item.path}
                className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? "active" : ""}`}>
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* User (NEW) */}
        <div className="sidebar-link sidebar-dropdown" onClick={() => setIsUsersOpen(!isUsersOpen)}>
          <div className="sidebar-dropdown-left">
            <span className="sidebar-icon"><UserCog size={18} /></span>
            <div className="masters-title">
              <span className="sidebar-label">User</span>
              <span className="masters-small-font">User Panel</span>
            </div>
          </div>
          <span className="sidebar-chevron">
            {isUsersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>

        {isUsersOpen && (
          <div className="sidebar-submenu">
            {userItems.map((item, idx) => (
              <NavLink key={idx} to={item.path}
                className={({ isActive }) => `sidebar-link sidebar-sublink ${isActive ? "active" : ""} ${item.purchase ? "group" : ""}`}>
                <span className="sidebar-icon">
                  {/* if purchase line, add small pill badge */}
                  {item.icon}
                  {item.purchase && (
                    <span className="purchase-pill" aria-hidden="true" title="pharma">
                      {/* tiny pill SVG */}
                      <svg width="12" height="8" viewBox="0 0 24 14" className="pill-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="11" height="13" rx="6.5" fill="#fff" stroke="#e2e8f0"/>
                        <rect x="11.5" y="0.5" width="11" height="13" rx="6.5" fill="#34d399" />
                      </svg>
                    </span>
                  )}
                </span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Other */}
        {otherMenuItems.map((item, idx) => (
          <NavLink key={idx} to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""} ${item.anim ? "group" : ""}`}>
            <span
              className={`sidebar-icon ${item.anim === "settings" ? "hover-rotate" : ""} ${item.anim === "pulse" ? "pulse-icon" : ""}`}
            >
              {item.icon}
            </span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
