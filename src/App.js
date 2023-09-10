import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup/Signup";
import AccountsList from "./components/Account/AccountList";
import EditAccountPage from "./components/Account/EditAccountPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ตรวจสอบการล็อกอินจาก localStorage เมื่อโหลดแอปครั้งแรก
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true" && !isLoggedIn) {
      setIsLoggedIn(true);
    } else if (storedLoginStatus !== "true" && isLoggedIn) {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // เก็บค่าการล็อกอินใน localStorage
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // ลบค่าการล็อกอินใน localStorage เมื่อออกจากระบบ
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/account"
            element={isLoggedIn ? <AccountsList /> : <Navigate to="/" />}
          />
          <Route
            path="/edit/:id"
            element={isLoggedIn ? <EditAccountPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
