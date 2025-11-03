import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Layout components

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Page components
import Home from "./pages/Home";
import Pharmacy from "./pages/Pharmacy";

// Master modules
import Vendors from "./components/masters/vendors/vendors.jsx";
import Customers from "./components/masters/customers/customers.jsx";
import Categories from "./components/masters/categories/categories.jsx";
import Unit from "./components/masters/unit/unit.jsx";
import Item from "./components/masters/item/item.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx"; 
import Inventory from "./components/inventory/inventory.jsx";
import Billing from "./components/billing/billing.jsx";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Sidebar />

         {/* Main Content Area */}
        <div className="flex flex-col flex-grow ml-64">
          <main className="flex-grow p-6">
            <Routes>
              {/* Default Page */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/pharmacy" element={<Pharmacy />} />

              {/* Masters Section */}
              <Route path="/masters/vendors" element={<Vendors />} />
              <Route path="/masters/customers" element={<Customers />} />
              <Route path="/masters/categories" element={<Categories />} />
              <Route path="/masters/unit" element={<Unit />} />
              <Route path="/masters/item" element={<Item />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Pharmacy />} />
              <Route path="/reports" element={<Home />} />
              <Route path="/settings" element={<Home />} />
              <Route path="/billing" element={<Billing />} />
            </Routes>
          </main>
        </div>

       
      </div>
    </Router>
  );
};

export default App;
