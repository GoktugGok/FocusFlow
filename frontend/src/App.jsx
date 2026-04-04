import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import './App.css'
import './timer.css'
import Home from "./pages/Home.jsx";
import LofiDetail from "./pages/LofiDetail.jsx";
import LoginPage from "./pages/Login.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:id" element={<LofiDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}




