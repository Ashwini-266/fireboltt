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
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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
    codPayments: 0,
    upiPayments: 0,
    cardPayments: 0,
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

  const sortDates = (obj) => {
    return Object.keys(obj || {}).sort(
      (a, b) => new Date(a) - new Date(b)
    );
  };

  const salesLabels = sortDates(stats.salesByDate);
  const salesData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Sales ₹",
        data: salesLabels.map(d => stats.salesByDate[d]),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54,162,235,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const userLabels = sortDates(stats.usersByDate);
  const userValues = userLabels.map(d => stats.usersByDate[d]);

  let cumulativeUsers = [];
  userValues.reduce((acc, curr, i) => {
    const total = acc + curr;
    cumulativeUsers[i] = total;
    return total;
  }, 0);

  const usersData = {
    labels: userLabels,
    datasets: [
      {
        label: "Total Users",
        data: cumulativeUsers,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76,175,80,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const orderLabels = sortDates(stats.ordersByDate);
  const ordersData = {
    labels: orderLabels,
    datasets: [
      {
        label: "Orders",
        data: orderLabels.map(d => stats.ordersByDate[d]),
        backgroundColor: "#ff9800",
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const paymentData = {
    labels: ["COD", "UPI", "CARD"],
    datasets: [
      {
        data: [
          stats.codPayments,
          stats.upiPayments,
          stats.cardPayments,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#4caf50"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <>
      <h2>Admin Dashboard</h2>

      <div className="dash-container">

        {/* LEFT SIDE */}
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
              <h3>Payments Received</h3>
<p>{stats.totalPayments}</p>
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
              <Line data={salesData} options={options} />
            </div>

            <div className="chart">
              <h3>User Growth</h3>
              <Line data={usersData} options={options} />
            </div>

            <div className="chart">
              <h3>Orders Overview</h3>
              <Bar data={ordersData} options={options} />
            </div>

            <div className="chart">
              <h3>Payment Distribution</h3>
              <Doughnut data={paymentData} options={options} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;