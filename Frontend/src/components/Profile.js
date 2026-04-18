import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Profile.css';

function Profile() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  if (user) {
    axios
      .get(`http://localhost:3001/orders/${user._id}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }
}, [user]);

  return (
    <div className='profile-container'>
      <h2>My Profile</h2>
      <h2>cccc</h2>
      
      <h3>Order Details</h3>
      <div className='order-details'>
        
        {orders.length === 0 ? (
        <p style={{ color: "black" }}>No orders found</p>
        ) : (
        orders.map((order, index) => (
            <div key={index} className='order-card'>
            <div className="order-row">
                <div className="order-images">
                {order.products && order.products.map((item, i) => (
                    <img
                    key={i}
                    src={`http://localhost:3001/uploads/${item.productId.imageUpload}`}
                    alt={item.productId.title}
                    className="order-image"
                    />
                ))}
                </div>
                <div className="order-info">
                <div className="product-names">
                    {order.products && order.products.map((item, i) => (
                    <p key={i}>
                        {item.productId.title} (x{item.quantity})
                    </p>
                    ))}
                </div>

                <p>Order ID: {order._id}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                </div>

            </div>
            </div>
        ))
        )}
      </div>
    </div>
  );
}

export default Profile;