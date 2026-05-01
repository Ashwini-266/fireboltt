import React from 'react';
import {useState, useEffect} from "react";
import "../css/Cart.css";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function Cart() {
    const [cartData, setCartData] = useState([]);
    const navigate=useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const { id } = useParams();
    const location = useLocation();
const cartItems = location.state?.cartItems;
    
    const [product, setProduct] = useState({
        title: "",
        imageUpload:"",
        category: "",
        price: "",
        quantity: "",
        rating: ""
    });

    // Fetch cart data
    useEffect(() => {
      const fetchCart = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/${user._id}`);
            const data = await res.json();
            setCartData(data);
          } catch (err) {
            console.error("Error fetching cart:", err);
          }
        } else {
          const guestCart =JSON.parse(localStorage.getItem("guestCart")) || [];
          setCartData(guestCart);
        }
      };

      fetchCart();
    }, []);

    //update quantity
    const updateQuantity = async (id, newQuantity, index) => {
      if (newQuantity < 1) return;
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        });
        const updatedItem = await res.json();
        setCartData((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, quantity: updatedItem.quantity }
              : item
          )
        );
      } else {
        let guestCart =JSON.parse(localStorage.getItem("guestCart")) || [];
        guestCart[index].quantity = newQuantity;
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartData(guestCart);
      }
    };


    //delete product
    const deleteProduct = async (id, index) => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        await fetch(`${process.env.REACT_APP_API_URL}/cart/item/${id}`, {
          method: "DELETE",
        });
        setCartData((prev) =>
          prev.filter((item) => item._id !== id)
        );
      } else {
        let guestCart =JSON.parse(localStorage.getItem("guestCart")) || [];
        guestCart.splice(index, 1);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartData(guestCart);
      }
    };

    //cart empty
    if (cartData.length === 0) {
      return <h2>Your cart is empty </h2>;
    }

    //total cost
    const totalPrice = cartData.reduce(
      (total, item) => total + (item.productId?.price || 0) * item.quantity,0
    );

    return (
        <div className="cart-container">
            {cartData.map((item, index) => (
                <div key={index} className="cart-item" style={{display:"flex",gap:"20px"}}>
                    <div className="cart-left">
                       <img src={item.productId.imageUpload} alt={item.productId.title} />
                    </div>
                    <div className="cart-right">
                        <p><strong>{item.productId.title}</strong></p>
                        <p><strong>Price:</strong> {item.productId.price}</p>
                        <div className="quantity-box">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1, index)}>-</button>

                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1, index)}>+</button>
                        </div>
                        <button onClick={() => deleteProduct(item._id)}>Remove</button>                    
                    </div>
                </div>
            ))}
            <div className="cart-summary">
              <p className="total"><strong>Estimated Total: ₹{totalPrice}</strong></p>
              <button className="checkout" onClick={() => navigate("/checkout", { state: { cartItems: cartData } })}><strong>CheckOut</strong></button>
            </div>
          </div>

        );
      }

export default Cart;
