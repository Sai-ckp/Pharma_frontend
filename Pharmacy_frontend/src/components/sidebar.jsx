import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  ChevronDown,
  ChevronRight,
  Smartphone,
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

  const masterItems = [
    { path: "/masters/vendors", label: "Vendors", icon: <Store size={18} /> },
    { path: "/masters/customers", label: "Customers", icon: <UserCircle size={18} /> },
    { path: "/masters/roles", label: "Roles", icon: <ShieldCheck size={18} /> },
    { path: "/masters/locations", label: "Locations", icon: <MapPin size={18} /> },
    { path: "/masters/products", label: "Products", icon: <FlaskRound size={18} /> },
    { path: "/users", label: "Users", icon: <UserCog size={18} /> },
  ];

  const otherMenuItems = [

    { path: "/settings", label: "settings", icon: <ShoppingCart size={18} /> },
    { path: "/retention-policies", label: "retention-policies", icon: <ShoppingCart size={18} /> },
    { path: "/pharmacy", label: "Pharmacy", icon: <Pill size={18} /> },
    { path: "/user-devices", label: "User Devices", icon: <Smartphone size={18} /> },
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
      
      {/* ✅ Header */}
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

      {/* ✅ Menu */}
      <nav className="sidebar-menu">

        {/* ✅ Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <span className="sidebar-icon"><LayoutDashboard size={18} /></span>
          <span className="sidebar-label">Dashboard</span>
        </NavLink>

        {/* ✅ Masters Dropdown */}
        <div
          className="sidebar-link sidebar-dropdown"
          onClick={() => setIsMastersOpen(!isMastersOpen)}
        >
          <div className="sidebar-dropdown-left">
            
            {/* ✅ ICON */}
            <span className="sidebar-icon">
              <Settings size={18} />
            </span>

            {/* ✅ Title + Subtext */}
            <div className="masters-title">
              <span className="sidebar-label">Masters</span>
              <span className="masters-small-font">Master Panel</span>
            </div>

          </div>

          {/* ✅ Chevron */}
          <span className="sidebar-chevron">
            {isMastersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>

        {/* ✅ Masters Items */}
        {isMastersOpen && (
          <div className="sidebar-submenu">
            {masterItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link sidebar-sublink ${isActive ? "active" : ""}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* ✅ Other Menu Items */}
        {otherMenuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}

      </nav>
    </div>
  );
};

export default Sidebar;
