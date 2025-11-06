import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Sidebar from "./components/sidebar";
import Footer from "./components/Footer";

// Public
import Login from "./components/user/login";
// Guard
import PrivateRoute from "./components/user/privateroute";

// Pages
import Home from "./pages/Home";
import Pharmacy from "./pages/Pharmacy";
import Dashboard from "./components/dashboard/dashboard.jsx";
import Inventory from "./components/inventory/inventory.jsx";
import Billing from "./components/billing/billing.jsx";

// Masters
import Vendorsdashboard from "./components/Masters/Vendors/vendorsdashboard.jsx";
import AddVendors from "./components/Masters/Vendors/addvendors.jsx";
import AddCustomers from "./components/Masters/Customers/addcustomers.jsx";
import CustomersDashboard from "./components/Masters/Customers/customersdashboard.jsx";
import RolesDashboard from "./components/Masters/roles/rolesdashboard.jsx";
import AddRole from "./components/Masters/roles/addroles.jsx";
import LocationsDashboard from "./components/Masters/locations/locationsdashboard.jsx";
import AddLocation from "./components/Masters/locations/addlocations.jsx";
import ProductsDashboard from "./components/Masters/products/productsdashboard.jsx";
import AddProduct from "./components/Masters/products/addproducts.jsx";

//User
import UserDevices from "./components/user/user_devices/user_devices.jsx";
import InventoryLedger from "./components/user/inventory_ledger/inventory_ledger.jsx";
import TransferVouchers from "./components/user/transfer_vouchers/transfer_vouchers.jsx"; // ⬅️ NEW
import BreachLogs from "./components/user/breach_logs/breach_logs.jsx";
import AuditLogs from "./components/user/audit_logs/audit_logs.jsx"; // ⬅️ NEW
import RecallEvents from "./components/user/recall_events/recall_events.jsx";
import PurchaseLines from "./components/user/purchase_lines/purchase_lines.jsx";
import SalesInvoices from "./components/user/sales_invoices/sales_invoices.jsx";


// Settings / retention
import SettingsDashboard from "./components/settings/settingsdashboard.jsx";
import AddSetting from "./components/settings/addsettings.jsx";
import RetentionDashboard from "./components/retention_policies/retentiondashboard.jsx";
import AddRetention from "./components/retention_policies/addretention.jsx";

// Other modules
import Rackrules from "./components/Rackrules/Rackrules.jsx";
import Batchlots from "./components/batchlots/batchlots.jsx";
import Purchases from "./components/purchases/purchases.jsx";
import ConsentLedger from "./components/consentledger/consentledger.jsx";
import Vendorreturns from "./components/vendorreturns/vendorreturns.jsx";
import Transferlines from "./components/transferlines/transferlines.jsx";
import Prescriptions from "./components/prescriptions/prescriptions.jsx";
import Saleslines from "./components/saleslines/saleslines.jsx";
import H1registerentries from "./components/h1registerentries/h1registerentries.jsx";
import Ndpsdailyentries from "./components/ndpsdailyentries/ndpsdailyentries.jsx";


/** Shell for authenticated pages */
function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-grow ml-0 lg:ml-64">
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/home" element={<Home />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/user-devices" element={<UserDevices />} />

            {/* Masters */}
            <Route path="/masters/vendors" element={<Vendorsdashboard />} />
            <Route path="/masters/vendors/add" element={<AddVendors />} />
            <Route path="/masters/customers" element={<CustomersDashboard />} />
            <Route path="/masters/customers/add" element={<AddCustomers />} />
            <Route path="/masters/roles" element={<RolesDashboard />} />
            <Route path="/masters/roles/add" element={<AddRole />} />
            <Route path="/masters/locations" element={<LocationsDashboard />} />
            <Route path="/masters/locations/add" element={<AddLocation />} />
            <Route path="/masters/products" element={<ProductsDashboard />} />
            <Route path="/masters/products/add" element={<AddProduct />} />
          
            {/* User Section */}
            <Route path="/user-devices" element={<UserDevices />} />
            <Route path="/inventory-ledger" element={<InventoryLedger />} />
            <Route path="/transfer-vouchers" element={<TransferVouchers />} />
            <Route path="/breach-logs" element={<BreachLogs />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/recall-events" element={<RecallEvents />} />
            <Route path="/purchase-lines" element={<PurchaseLines />} />
            <Route path="/sales-invoices" element={<SalesInvoices />} />

            {/* Core */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Pharmacy />} />
            <Route path="/reports" element={<Home />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<SettingsDashboard />} />
            <Route path="/settings/add" element={<AddSetting />} />
            <Route path="/retention-policies" element={<RetentionDashboard />} />
            <Route path="/retention-policies/add" element={<AddRetention />} />

            {/* Others */}
            <Route path="/rackrules" element={<Rackrules />} />
            <Route path="/batchlots" element={<Batchlots />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/consentledger" element={<ConsentLedger />} />
            <Route path="/vendorreturns" element={<Vendorreturns />} />
            <Route path="/transferlines" element={<Transferlines />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/saleslines" element={<Saleslines />} />
            <Route path="/h1registerentries" element={<H1registerentries />} />
            <Route path="/ndpsdailyentries" element={<Ndpsdailyentries />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />


            
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
