import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import io from "socket.io-client";
import './App.css'
import './timer.css'
import Home from "./pages/Home.jsx";
import LofiDetail from "./pages/LofiDetail.jsx";
import LoginPage from "./pages/Login.jsx";

const socket = io("https://focusflow-7znc.onrender.com");

export default function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to backend: ", socket.id);
      
      const fakeUserId = "testuser@example.com";
      socket.emit("user-online", fakeUserId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from backend");
    })

    return () => {
      socket.disconnect();
    }
  }, []);
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/:id" element={<LofiDetail />}/>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage/>}/>
          </Routes>
    </BrowserRouter>
  );
}




