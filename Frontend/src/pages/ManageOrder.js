import React, { useEffect, useState } from "react";
import "../css/Admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // fetch orders
  const fetchOrders = () => {
    axios.get("http://localhost:3001/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  // update order
  const updateStatus = (id, status) => {
    axios.put(`http://localhost:3001/orders/${id}`, { status })
      .then(() => {
        fetchOrders();
      });
  };

  //delete order
  const deleteOrder = (id) => {
    axios.delete(`http://localhost:3001/orders/${id}`)
      .then(() => {
        fetchOrders();
      });
  };


  //search
  const filteredOrders = orders.filter((order) => {
  const searchText = search.toLowerCase();
  const matchesText =
    order.userName?.toLowerCase().includes(searchText) ||
    order.status?.toLowerCase().includes(searchText) ||
    order.paymentMethod?.toLowerCase().includes(searchText) ||
    order.address?.toLowerCase().includes(searchText);
  const matchesDate =
  !date ||
  new Date(order.createdAt).toISOString().slice(0, 10) === date;
   return matchesText && matchesDate;
  })

  return (
    <>
      <h2>Manage Orders</h2>
      <div className="order-filters">
      <input type="search" className="search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
      <button className="back-button" onClick={() => navigate("/admin")}>Back</button>
      </div>
    
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Address</th>
            <th>Payment</th>
            <th>paymentstatus</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userName}</td>
              <td>{order.productId?.title}</td>
              <td>{order.quantity}</td>
              <td>₹{order.price}</td>
              <td>
                <div>
                  <div>{order.address}</div>
                  {order.phone && (
                    <div style={{ marginTop: "5px" }}>
                      <strong>Phone No:</strong> {order.phone}
                    </div>
                  )}
                </div>
              </td>
              <td>{order.paymentMethod}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.status || "Pending"}</td>
              <td>
                <button onClick={() => updateStatus(order._id, "Shipped")}>Shipped</button>
                <button onClick={() => updateStatus(order._id, "Delivered")}>Delivered</button>
                <button onClick={() => deleteOrder(order._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ManageOrder;