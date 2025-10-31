import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Pharmacy from './pages/Pharmacy';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;