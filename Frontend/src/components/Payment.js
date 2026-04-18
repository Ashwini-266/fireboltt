// import React, { useState, } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import "../css/Payment.css";

// function Payment() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const savedData = JSON.parse(localStorage.getItem("paymentData"));
//   const formData = location.state?.form || savedData?.formData;
//   const cartItems =
//     location.state?.cartItems || savedData?.cartItems;
//   const product =
//     location.state?.product || savedData?.product;

//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [upiId, setUpiId] = useState("");

//   const [loading, setLoading] = useState(false);

//   const validateUpiId = (upi) => {
//   const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;
//   return upiRegex.test(upi);
//   };

//   //placing order
// const orderPlace = async (paymentId = null) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   const fullAddress = `${formData?.address}, ${formData?.city},
//   ${formData?.state} - ${formData?.pincode}`;
//   if (paymentMethod === "UPI") {
//   if (!upiId) {
//     alert("Please enter UPI ID");
//     return;
//   }
//   if (!validateUpiId(upiId)) {
//     alert("Invalid UPI ID");
//     return;
//   }
// }

//   try {
//     setLoading(true);
//     if (cartItems && cartItems.length > 0) {
//       const products = cartItems.map((item) => ({
//         productId: item.productId._id,
//         title: item.productId.title,
//         quantity: item.quantity,
//         price: item.productId.price,
//       }));

//       const totalAmount = cartItems.reduce(
//         (sum, item) =>
//           sum + item.productId.price * item.quantity,
//         0
//       );

//       await axios.post("http://localhost:3001/orders", {

//       for (let item of cartItems) {
//         await axios.post("http://localhost:3001/orders", {
//           userName: user.firstname,
//           email: user.email,
//           phone: Number(formData?.phone),
//           productId: item.productId._id,
//           quantity: item.quantity,
//           price: item.productId.price * item.quantity,
//           address: fullAddress,
//           paymentMethod,
//           upiId: paymentMethod === "UPI" ? upiId : null,
//           paymentId: paymentMethod === "CARD" ? paymentId : null,
//           paymentStatus:
//             paymentMethod === "COD" ? "PENDING" : "PAID",
//         });
//       }
//       await axios.delete(`http://localhost:3001/cart/${user._id}`);
//     } else if (product) {
//       await axios.post("http://localhost:3001/orders", {

//         userName: user.firstname,
//         userId: user._id,
//         email: user.email,
//         phone: Number(formData?.phone),

//         products,
//         totalAmount,

//         address: fullAddress,
//         paymentMethod,
//         upiId: paymentMethod === "UPI" ? upiId : null,
//         paymentId: paymentMethod === "CARD" ? paymentId : null,
//         paymentStatus:
//           paymentMethod === "COD" ? "PENDING" : "PAID",
//       });

//       await axios.delete(`http://localhost:3001/cart/${user._id}`);
//     }
//     else if (product) {
//       await axios.post("http://localhost:3001/orders", {
//         userName: user.firstname,
//         userId: user._id,
//         email: user.email,
//         phone: Number(formData?.phone),

//         products: [
//           {
//             productId: product._id,
//             title: product.title,
//             quantity: product.quantity || 1,
//             price: product.price,
//           },
//         ],
//         totalAmount: product.price * (product.quantity || 1),
//         address: fullAddress,
//         paymentMethod,
//         upiId: paymentMethod === "UPI" ? upiId : null,
//         paymentId: paymentId || null,
//         paymentStatus:
//           paymentMethod === "COD" ? "PENDING" : "PAID",
//       });
//     }
//     alert("Order placed successfully!");
//     navigate("/");
//   } catch (err) {
//     console.error(err);
//     alert("Failed to place order");
//   } finally {
//     setLoading(false);
//   }
// };
//   // Razorpay payment
//   const handleRazorpayPayment = async () => {
//   try {
//     const totalAmount = cartItems? cartItems.reduce((sum, item) =>
//             sum + item.productId.price * item.quantity,0
//         ) : product?.price;
//     const res = await axios.post("http://localhost:3001/create-razorpay-order",
//       { 
//         amount: totalAmount 
//       }
//     );
//     const options = {
//       key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//       amount: res.data.amount,
//       currency: "INR",
//       name: "Your Store",
//       description: "Order Payment",
//       order_id: res.data.id,
//       handler: function (response) {
        
//         orderPlace(response.razorpay_payment_id);
//       },
//       prefill: {
//         name: formData?.name,
//         email: formData?.email,
//         contact: formData?.phone,
//       },
//       theme: {
//         color: "#000",
//       },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } 
//   catch (err) {
//     console.log(err);
//     alert("Payment failed");
//   }
// };

//   return (
//     <div className="payment-container">
//       <h2>Payment</h2>

//       <div className="payment-card">
//         <div className="address-card">
//            <h4>DELIVERY DETAILS</h4>
//           <div className="address-box">
//             <div>
//                <strong>Deliver To {formData?.name}</strong>
//                 <p>
//                  {formData?.address}, {formData?.city},<br />
//                  {formData?.state} - {formData?.pincode}
//                 </p>
//                 <p>{formData?.phone}</p>
//                 <p>{formData?.email}</p>
//               </div>
//            </div>
//          </div>
//         <div className="payment-section">
//           <h4>Payment Method</h4>
//           <div className={`method ${paymentMethod === "COD" ? "active" : ""}`}onClick={() => setPaymentMethod("COD")}>
//             Cash on Delivery
//           </div>
//           <div className={`method ${paymentMethod === "UPI" ? "active" : ""}`} onClick={() => setPaymentMethod("UPI")}>
//             UPI
//           </div>
//           {
//           paymentMethod === "UPI" && (
//             <div className="upi-input">
//               <input type="text" placeholder="Enter UPI ID (e.g., name@bank)" value={upiId} onChange={(e) => setUpiId(e.target.value)}/>
//             </div>
//           )
//         }
//           <div className={`method ${paymentMethod === "CARD" ? "active" : ""}`} onClick={() => setPaymentMethod("CARD")}>
//             Card
//           </div>
//           {
//           paymentMethod === "CARD" && (
//             <button onClick={handleRazorpayPayment}>
//               Pay with Card
//             </button>
//           )}
//         </div>
//       </div>
//       <button className="pay-btn" onClick={() => orderPlace()} disabled={!paymentMethod || loading}>
//         {loading ? "Placing Order..." : "Place Order"}
//       </button>
//       {loading && (
//         <div className="loading-overlay">
//           <div className="spinner"></div>
//           <p>Processing your order...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payment;

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

      // ✅ CART ITEMS
      if (cartItems && cartItems.length > 0) {
        for (let item of cartItems) {
          await axios.post(
            "https://fireboltt-backend.onrender.com/orders",
            {
              userName: user.firstname,
              userId: user._id,
              email: user.email,
              phone: Number(formData?.phone),

              productId: item.productId._id,
              quantity: item.quantity,
              price: item.productId.price * item.quantity,

              address: fullAddress,
              paymentMethod,
              upiId: paymentMethod === "UPI" ? upiId : null,
              paymentId: paymentMethod === "CARD" ? paymentId : null,
              paymentStatus:
                paymentMethod === "COD" ? "PENDING" : "PAID",
            }
          );
        }

        await axios.delete(
          `https://fireboltt-backend.onrender.com/cart/${user._id}`
        );
      }

      // ✅ SINGLE PRODUCT
      else if (product) {
        await axios.post(
          "https://fireboltt-backend.onrender.com/orders",
          {
            userName: user.firstname,
            userId: user._id,
            email: user.email,
            phone: Number(formData?.phone),

            productId: product._id,
            quantity: product.quantity || 1,
            price: product.price,

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
        ? cartItems.reduce(
            (sum, item) =>
              sum + item.productId.price * item.quantity,
            0
          )
        : product?.price;

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
          email: formData?.email,
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
              <p>{formData?.email}</p>
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
