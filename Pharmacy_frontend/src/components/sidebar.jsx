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
  Smartphone,
} from "lucide-react";
import "./Sidebar.css";
 
const Sidebar = () => {
  const [isMastersOpen, setIsMastersOpen] = useState(false);
 
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/pharmacy", label: "Pharmacy", icon: <ShoppingCart size={18} /> },
  ];
   // 👇 User submenu (your new group)
  const userItems = [
    { path: "/user-devices", label: "UserDevices", icon: <Smartphone size={18} /> },

    // add more user-related pages here later
  ];

  const masterItems = [
    { path: "/masters/vendors", label: "Vendors", icon: <Users size={18} /> },
    { path: "/masters/customers", label: "Customers", icon: <Users size={18} /> },
    { path: "/masters/roles", label: "Roles", icon: <Package size={18} /> },
    { path: "/masters/locations", label: "Locations", icon: <Package size={18} /> },
    { path: "/masters/products", label: "products", icon: <Settings size={18} /> },
  ];
 
  return (
    <div className="sidebar-container">
 
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
 