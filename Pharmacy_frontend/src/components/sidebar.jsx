import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMastersOpen, setIsMastersOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/pharmacy", label: "Pharmacy", icon: <ShoppingCart size={18} /> },
  ];

  const masterItems = [
    { path: "/masters/vendors", label: "Vendors", icon: <Users size={18} /> },
    { path: "/masters/customers", label: "Customers", icon: <Users size={18} /> },
    { path: "/masters/categories", label: "Categories", icon: <Package size={18} /> },
    { path: "/masters/item", label: "Items", icon: <Package size={18} /> },
    { path: "/masters/unit", label: "Units", icon: <Settings size={18} /> },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Keshav Medical</h2>
        <p className="sidebar-subtitle">Management System</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}

        {/* Masters Dropdown */}
        <div
          className="sidebar-link sidebar-dropdown"
          onClick={() => setIsMastersOpen(!isMastersOpen)}
        >
          <div className="sidebar-dropdown-left">
            <span className="sidebar-icon">
              <Settings size={18} />
            </span>
            <span className="sidebar-label">Masters</span>
          </div>
          <span className="sidebar-chevron">
            {isMastersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        </div>

        {isMastersOpen && (
          <div className="sidebar-submenu">
            {masterItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link sidebar-sublink ${isActive ? "active" : ""}`
                }
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
