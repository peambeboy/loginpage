import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">MyLogin</div>
      <ul className="nav-list">
        {isLoggedIn && (
          <li className="nav-item">
            <Link to="/account" className="nav-link">
              บัญชี
            </Link>
          </li>
        )}
        {isLoggedIn ? (
          <li className="nav-item">
            <button onClick={handleLogout} className="logout-button">
              ออกจากระบบ
            </button>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                ล็อคอิน
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">
                สมัครสมาชิก
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
