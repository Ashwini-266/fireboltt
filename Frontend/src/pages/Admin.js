import React, { useEffect, useState } from "react";
import "../css/Admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalPayments: 0,
    totalUsers: 0,
    salesByDate: {},
    usersByDate: {},
    ordersByDate: {},
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  
  const salesData = {
  labels: Object.keys(stats.salesByDate || {}),
  datasets: [
    {
      label: "Sales ₹",
      data: Object.values(stats.salesByDate || {}),
    },
  ],
};

const userDates = Object.keys(stats.usersByDate || {});
const userValues = Object.values(stats.usersByDate || {});
let cumulativeUsers = [];
userValues.reduce((acc, curr, i) => {
  const total = acc + curr;
  cumulativeUsers[i] = total;
  return total;
}, 0);

const usersData = {
  labels: userDates,
  datasets: [
    {
      label: "Total Users Growth",
      data: cumulativeUsers,
      borderColor: "blue",
      tension: 0.3,
    },
  ],
};

  const ordersData = {
  labels: Object.keys(stats.ordersByDate || {}),
  datasets: [
    {
      label: "Orders",
      data: Object.values(stats.ordersByDate || {}),
    },
  ],
};

const paymentData = {
  labels: Object.keys(stats.paymentsByDate || {}),
  datasets: [
    {
      label: "Payments ₹",
      data: Object.values(stats.paymentsByDate || {}),
    },
  ],
};



return (
    <>
          <h2>Admin Dashboard</h2>
    <div className="dash-container">
      <div className="left-container">
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
      </div>
<div className="right-container">
      <div className="stats">
        <div className="card">
          <h3>Total Sales</h3>
          <p>₹{stats.totalSales}</p>
        </div>

        <div className="card">
          <h3>Total payment</h3>
          <p>₹{stats.totalPayments}</p>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart">
          <h3>Sales Trend</h3>
          <Line data={salesData} />
        </div>

        <div className="chart">
          <h3>Signup Growth</h3>
          <Line data={usersData} />
        </div>

        <div className="chart">
          <h3>Orders Overview</h3>
          <Bar data={ordersData} />
        </div>

        <div className="chart">
          <h3>Payment Overview</h3>
          <Line data={paymentData} />
        </div>

        

      </div>
      </div>
    </div>
    </>
  );
}

export default Admin;