import React from "react";
import "../css/GuestNav.css";
import { useNavigate } from "react-router-dom";

function GuestNav() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="guest-nav">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default GuestNav;