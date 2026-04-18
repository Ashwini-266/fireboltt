import React, { useEffect, useState } from "react";
import "../css/Admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    salesByDate: {},
  });

  useEffect(() => {
    axios.get("http://localhost:3001/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  // Chart Data
  const data = {
    labels: Object.keys(stats.salesByDate),
    datasets: [
      {
        label: "Sales ₹",
        data: Object.values(stats.salesByDate),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dash-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-buttons">
        <button onClick={() => navigate("/addproduct")}>
          Add Products
        </button>
        <button onClick={() => navigate("/manageproduct")}>
          Manage Products
        </button>
        <button onClick={() => navigate("/manageorder")}>
          Manage Orders
        </button>
      </div>

      <div className="stats">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Total Sales</h3>
          <p>₹{stats.totalSales}</p>
        </div>
      </div>
      <div className="chart">
        <h3>Sales Overview</h3>
        <Bar data={data} />
      </div>

    </div>
  );
}

export default Admin;