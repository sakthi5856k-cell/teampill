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
import Status from "./pages/Status"
import Login from "./pages/DiacordLogin";
import Rules from "./pages/Rules";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />

        <Routes>
          {/* Printable pages */}
          <Route path="/idcard/:staffId" element={<IDCard />} />
          <Route path="/certificate/:certId" element={<Certificate />} />

          {/* Layout pages */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/status" element={<Status />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/rules" element={<Rules />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
