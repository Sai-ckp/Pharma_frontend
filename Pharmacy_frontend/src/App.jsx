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
import Vendorsdashboard from "./components/Masters/Vendors/vendorsdashboard.jsx";
import AddVendors from "./components/Masters/Vendors/addvendors.jsx";
 //customers imports             
import AddCustomers from "./components/Masters/Customers/addcustomers.jsx";        // add new customer form
import CustomersDashboard from "./components/Masters/Customers/customersdashboard.jsx"; // dashboard with KPI cards
//roles imports
import  RolesDashboard from "./components/Masters/roles/rolesdashboard.jsx";
import AddRole from "./components/Masters/roles/addroles.jsx";

//locations imports
import LocationsDashboard from "./components/Masters/locations/locationsdashboard.jsx";
import AddLocation from "./components/Masters/locations/addlocations.jsx";

//products imports
import ProductsDashboard from "./components/Masters/products/productsdashboard.jsx";
import AddProduct from "./components/Masters/products/addproducts.jsx";


import Dashboard from "./components/dashboard/dashboard.jsx"; 
import Inventory from "./components/inventory/inventory.jsx";
import Billing from "./components/billing/billing.jsx";

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
