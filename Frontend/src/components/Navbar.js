import "../css/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  //search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      navigate(`/?search=${value}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <nav className="navbar">
      <div>
        <img src="/images/logo.avif" alt="logo" onClick={() => navigate("/")} />
      </div>

      <div className="nav-links">
        <p onClick={() => navigate("/Smartwatches")}>SmartWatches</p>
      </div>
      <div className="nav-links">
        <p onClick={() => navigate("/SmartAudio")}>Smart Audio</p>
      </div>
      <div className="nav-links">
        <p onClick={() => navigate("/SmartGlasses")}>Smart Glasses</p>
      </div>
      <div className="nav-links">
        <p onClick={() => navigate("/Accessories")}>Accessories</p>
      </div>
      <div className="nav-links">
        <p onClick={() => navigate("/smartwatches")}>Deals💰</p>
      </div>
      <div className="nav-links">
        <p onClick={() => navigate("/Gifting")}>Gifting💰</p>
      </div>

      <div className="icons">
        <input type="search" className="search" placeholder="search" value={search} onChange={handleSearch}/>
        <span onClick={() => navigate("/cart")}>🛒</span>
        {user ? (
          <span className="login-icon" onClick={handleLogout}>Logout</span>
        ) : (
          <span className="login-icon" onClick={() => navigate("/login")} title="Login">🔥</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;