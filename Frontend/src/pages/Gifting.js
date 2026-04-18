import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Smartwatches.css"; 

function Gifting() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://fireboltt-backend.onrender.com/products/category/smartwatch") 
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Scroll 
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Add to cart
  const addProduct = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    try {
      await axios.post("https://fireboltt-backend.onrender.com/cart", {
        productId: product._id,
        quantity: 1,
        userId: user._id,
      });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <img src="/images/img3.webp" alt="Gifting" style={{ width: "100%" }} />
      </div>
      <div style={{ padding: "20px 40px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
          Gifts for Every Occasion
        </h2>
      </div>
      <div style={{ position: "relative", padding: "0 40px" }}>
        <button onClick={scrollLeft} className="arrows arrow-left">&#10094;</button>
        <div className="gift-scroller" ref={scrollRef}>
          {
          products.map((product) => (
            <div key={product._id} className="gift-card" onClick={() => navigate(`/ProductDisplay/${product._id}`)}>
              <img src={`http://localhost:3001/uploads/${product.imageUpload}`} alt={product.title}/>
              <h3>{product.title}</h3>
              <p>₹{product.price}</p>
              <button className="cart-btn" onClick={(e) => {
                  e.stopPropagation();
                  addProduct(product);
                }}>
                    Add to Cart
                </button>
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="arrows arrow-right">&#10095;</button>
      </div>
    </>
  );
}


export default Gifting;
