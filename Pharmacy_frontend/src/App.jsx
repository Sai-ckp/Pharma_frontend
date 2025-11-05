import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Layout components
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Pharmacy from "./pages/Pharmacy";

// Master modules
//vendors imports
import Vendorsdashboard from "./components/masters/vendors/vendorsdashboard.jsx";
import AddVendors from "./components/masters/vendors/addvendors.jsx";
 //customers imports             
import AddCustomers from "./components/masters/customers/addcustomers.jsx";        // add new customer form
import CustomersDashboard from "./components/masters/customers/customersdashboard.jsx"; // dashboard with KPI cards
//roles imports
import  RolesDashboard from "./components/masters/roles/rolesdashboard.jsx";
import AddRole from "./components/masters/roles/addroles.jsx";

//locations imports
import LocationsDashboard from "./components/masters/locations/locationsdashboard.jsx";
import AddLocation from "./components/masters/locations/addlocations.jsx";

//products imports
import ProductsDashboard from "./components/masters/products/productsdashboard.jsx";
import AddProduct from "./components/masters/products/addproducts.jsx";


import Dashboard from "./components/dashboard/dashboard.jsx"; 
import Inventory from "./components/inventory/inventory.jsx";
import Billing from "./components/billing/billing.jsx";
import UserDevices from "./components/user/user_devices/user_devices.jsx";

const App = () => {
  return (
    <Router>q
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-grow ml-64">
          <main className="flex-grow p-6">
            <Routes>
              {/* Default Page */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              {/* User Section */}
              <Route path="/user-devices" element={<UserDevices />} />
              {/* Master Modules */}
              <Route path="/masters/vendors" element={<Vendorsdashboard />} />
              <Route path="/masters/vendors/add" element={<AddVendors />} />
              
              {/* Customers */}
              <Route path="/masters/customers" element={<CustomersDashboard />} />
              <Route path="/masters/customers/add" element={<AddCustomers />} />   {/* <---- Added */}
              

              <Route path="/masters/roles" element={<RolesDashboard />} />
              <Route path="/masters/roles/add" element={<AddRole />} />
             
              <Route path="/masters/locations" element={<LocationsDashboard />} />
              <Route path="/masters/locations/add" element={<AddLocation />} />

              <Route path="/masters/products" element={<ProductsDashboard />} />
              <Route path="/masters/products/add" element={<AddProduct />} />


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
