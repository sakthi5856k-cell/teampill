import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Staff from "./pages/Staff";
import Gallery from "./pages/Gallery";
import Announcements from "./pages/Announcements";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import IDCard from "./pages/IDCard";
import Certificate from "./pages/Certificate";
import Status from "./pages/Status";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Printable routes without layout */}
            <Route path="/idcard/:staffId" element={<IDCard />} />
            <Route path="/certificate/:certId" element={<Certificate />} />

            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/apply" element={<Apply />} />
                  <Route path="/status" element={<Status />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
