import React from "react";
import "../css/Admin.css";
import { useNavigate } from "react-router-dom";

function Admin() {
    const navigate=useNavigate();

  return (
    <div className="dash-container">
      <h2 >Admin Dashboard</h2>

      <form >
        <div className="admin-buttons">
            <button type="button" onClick={() => navigate("/addproduct")}>Add Products </button>
            <button onClick={() => navigate("/manageproduct")}>Manage Products</button>
            <button onClick={() => navigate("/manageorder")}>Manage Orders</button>
            </div>
      </form>
    </div>
  );
}

export default Admin;