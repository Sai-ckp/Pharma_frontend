import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Page components
import Home from "./pages/Home";
import Pharmacy from "./pages/Pharmacy";

// Master modules
import Vendors from "./components/masters/vendors/vendors.jsx"; // ✅ full path
import Customers from "./components/masters/customers/customers.jsx";
import Categories from "./components/masters/categories/categories.jsx";

import Header from "./components/Header";
import Footer from "./components/Footer";


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <main className="flex-grow p-4">
          <Routes>
            {/* Default Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/pharmacy" element={<Pharmacy />} />

            {/* Masters Section */}
            <Route path="/masters/vendors" element={<Vendors />} />
            <Route path="/masters/customers" element={<Customers />} />
            <Route path="/masters/categories" element={<Categories />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
