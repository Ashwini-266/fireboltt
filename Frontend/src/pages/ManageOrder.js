import React, { useEffect, useState } from "react";
import "../css/Admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [filter, setFilter]=useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // fetch orders
  const fetchOrders = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  // update order
  const updateStatus = (id, status) => {
    axios.put(`${process.env.REACT_APP_API_URL}/orders/${id}`, { status })
      .then(() => {
        fetchOrders();
      });
  };

  //delete order
  const deleteOrder = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/orders/${id}`)
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


  const handleFilter = (e) => {
  };

  return (
    <>
      <h2>Manage Orders</h2>

      <div className='order-filters'>
        <p style={{color: "black"}}>Filter orders:</p>
        <input
          list="data"
          placeholder="Filter orders..."
          value={filter}
          onChange={handleFilter}
        />

        <datalist id="data">
          <option value="upi" />
          <option value="smartaudio" />
          <option value="smartglasses" />
          <option value="accessories" />
          <option value="Price < 500" />
          <option value="Price > 1000" />
          <option value="Rating >= 4" />
          <option value="Rating < 4" />
        </datalist>

        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          Back
        </button>
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
              {/* <td>{order.productId?.title}</td>
              <td>{order.quantity}</td>
              <td>₹{order.price}</td> */}
              <td>
  {order.products?.map((item, index) => (
    <div key={index}>
      {item.title}
    </div>
  ))}
</td>

<td>
  {order.products?.map((item, index) => (
    <div key={index}>
      {item.quantity}
    </div>
  ))}
</td>

<td>₹{order.totalAmount}</td>
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
