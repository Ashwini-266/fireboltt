import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData = JSON.parse(localStorage.getItem("paymentData"));
  const formData = location.state?.form || savedData?.formData;
  const cartItems =
    location.state?.cartItems || savedData?.cartItems;
  const product =
    location.state?.product || savedData?.product;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  const validateUpiId = (upi) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;
    return upiRegex.test(upi);
  };

  // Place Order
  const orderPlace = async (paymentId = null) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fullAddress = `${formData?.address}, ${formData?.city},
    ${formData?.state} - ${formData?.pincode}`;

    if (paymentMethod === "UPI") {
      if (!upiId) {
        alert("Please enter UPI ID");
        return;
      }
      if (!validateUpiId(upiId)) {
        alert("Invalid UPI ID");
        return;
      }
    }

    try {
      setLoading(true);

      
      if (cartItems && cartItems.length > 0) {
  let subtotal = 0;
let totalGST = 0;

const products = cartItems.map(item => {
  const price = item.productId.price;
  const qty = item.quantity;
  const gst = item.productId.gst || 0;

  const base = price * qty;
  const gstAmount = (base * gst) / 100;
  subtotal += base;
  totalGST += gstAmount;

  return {
    productId: item.productId._id,
    title: item.productId.title,
    quantity: qty,
    price: price,
    gst: gst,
    gstAmount: gstAmount
  };
});

const totalAmount = Number((subtotal + totalGST).toFixed(2));

  await axios.post(
    "https://fireboltt-backend.onrender.com/orders",
    {
      userName: user.firstname,
      userId: user._id,
      email: user.email,
      phone: Number(formData?.phone),

      products,  
      subtotal,
      totalGST,        
      totalAmount,      

      address: fullAddress,
      paymentMethod,
      upiId: paymentMethod === "UPI" ? upiId : null,
      paymentId: paymentMethod === "CARD" ? paymentId : null,
      paymentStatus:
        paymentMethod === "COD" ? "PENDING" : "PAID",
    }
  );

  await axios.delete(
    `https://fireboltt-backend.onrender.com/cart/${user._id}`
  );
}

      // SINGLE PRODUCT
      else if (product) {
        const price = product.price;
const qty = product.quantity || 1;
const gst = product.gst || 0;

const base = price * qty;
const gstAmount = (base * gst) / 100;
        await axios.post(
          "https://fireboltt-backend.onrender.com/orders",
          {
            userName: user.firstname,
            userId: user._id,
            email: user.email,
            phone: Number(formData?.phone),

            products: [
  {
    productId: product._id,
    title: product.title,
    quantity: product.quantity || 1,
    price: product.price,
    gst: gst,
      gstAmount: gstAmount
  },
],
subtotal: base,
  totalGST: gstAmount,
  totalAmount: base + gstAmount,


            address: fullAddress,
            paymentMethod,
            upiId: paymentMethod === "UPI" ? upiId : null,
            paymentId: paymentId || null,
            paymentStatus:
              paymentMethod === "COD" ? "PENDING" : "PAID",
          }
        );
      }

      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // Razorpay Payment
  const handleRazorpayPayment = async () => {
    try {
      const totalAmount = cartItems
  ? cartItems.reduce((sum, item) => {
      const base = item.productId.price * item.quantity;
      const gstAmount = (base * (item.productId.gst || 0)) / 100;
      return sum + base + gstAmount;
    }, 0)
  : (() => {
      const base = (product?.price || 0) * (product?.quantity || 1);
      const gstAmount = (base * (product?.gst || 0)) / 100;
      return base + gstAmount;
    })();

    const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(
        "https://fireboltt-backend.onrender.com/create-razorpay-order",
        { amount: totalAmount }
      );
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: res.data.id,
        handler: function (response) {
          orderPlace(response.razorpay_payment_id);
        },
prefill: {
  name: formData?.name,
  email: user?.email,
  contact: formData?.phone,
},
        theme: {
          color: "#000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>

      <div className="payment-card">
        <div className="address-card">
          <h4>DELIVERY DETAILS</h4>
          <div className="address-box">
            <div>
              <strong>Deliver To {formData?.name}</strong>
              <p>
                {formData?.address}, {formData?.city},<br />
                {formData?.state} - {formData?.pincode}
              </p>
              <p>{formData?.phone}</p>
              
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h4>Payment Method</h4>

          <div
            className={`method ${paymentMethod === "COD" ? "active" : ""}`}
            onClick={() => setPaymentMethod("COD")}
          >
            Cash on Delivery
          </div>

          <div
            className={`method ${paymentMethod === "UPI" ? "active" : ""}`}
            onClick={() => setPaymentMethod("UPI")}
          >
            UPI
          </div>

          {paymentMethod === "UPI" && (
            <div className="upi-input">
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          <div
            className={`method ${paymentMethod === "CARD" ? "active" : ""}`}
            onClick={() => setPaymentMethod("CARD")}
          >
            Card
          </div>

          {paymentMethod === "CARD" && (
            <button onClick={handleRazorpayPayment}>
              Pay with Card
            </button>
          )}
        </div>
      </div>

      <button
        className="pay-btn"
        onClick={() => orderPlace()}
        disabled={!paymentMethod || loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing your order...</p>
        </div>
      )}
    </div>
  );
}

export default Payment;
