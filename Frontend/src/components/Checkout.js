import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../css/Checkout.css";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems;
  const product = location.state?.product;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email:"",
    address: "",
    pincode: "",
    city: "",
    state: ""
  });

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems
  ? cartItems.reduce((sum, item) => {
      const price = item.productId.price;
      const qty = item.quantity;
      const gst = item.productId.gst || 0;

      const base = price * qty;
      const gstAmount = (base * gst) / 100;

      return sum + base + gstAmount;
    }, 0)
  : (() => {
      const price = product?.price || 0;
      const qty = product?.quantity || 1;
      const gst = product?.gst || 0;

      const base = price * qty;
      const gstAmount = (base * gst) / 100;

      return base + gstAmount;
    })();

  const continueToPayment = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Fill all details");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      navigate("/login", {
        state: {
          from: "/payment",
          paymentData: {
            form,
            cartItems,
            product,
          },
        },
      });
    } else {
      navigate("/payment", {
        state: { form, cartItems, product },
      });
    }
  };


  return (
    <div className="checkout-container">
      <h2>CHECKOUT</h2>
      <div className="checkout-box">
        <div className="checkout-left">
            <h2>order summary</h2>
            {
            cartItems ? (
              cartItems.map((item) => (
                <div key={item._id} className="product-card">
                  <img
  src={item.productId?.imageUpload}
  alt={item.productId?.title}
  style={{ width: "100px" }}
/>

                  <div className="product-info">
                    <p className="title">{item.productId.title}</p>
                    <p>Price: ₹{item.productId.price * item.quantity}</p>
                    <p>GST ({item.productId.gst}%): ₹{
                      (item.productId.price * item.quantity * item.productId.gst) / 100
                    }</p>
                  </div>                 
                </div>
              ))
            ) : (
              product && (
                <div className="product-card">
                  <img src={product.imageUpload} alt={product.title} />
                  <div className="product-info">
                    <p className="title">{product.title}</p>
                    <p>Price: ₹{product.price * product.quantity}</p>
                    <p>GST ({product.gst}%): ₹{
                      (product.price * product.quantity * product.gst) / 100
                    }</p>
                  </div>
                </div>
              )
            )}
          <h3 className="total">Total: ₹{totalPrice}</h3>
        </div>
        <div className="checkout-right">
          <h3>Delivery Details</h3>
          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <input name="email" placeholder="Email Address" onChange={handleChange} />
          <textarea name="address" placeholder="Address" onChange={handleChange} />
          <div className="row">
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
          </div>
          <input name="state" placeholder="State" onChange={handleChange} />
        </div>
      </div>
      <button className="checkout-btn" onClick={continueToPayment}>
        Continue to Payment
      </button>
    </div>
  );
}

export default Checkout;
