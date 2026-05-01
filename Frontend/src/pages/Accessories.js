import React from 'react';
import "../css/ProductDisplay.css";
import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Accessories() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/products/category/accessories`;
    axios
    .get(url)
    .then((res) => {
      setProducts(res.data);
    })
    .catch((err) => console.log(err));
    }, []);


  //add to cart logic
  const addProduct = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          userId: user._id
        }),
      });

      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <div className='container' style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
        {
        products.map((product) => (
            <>
            <div key={product._id} className="product-card">
                <img src={product.imageUpload} alt={product.title} className="product-image" style={{width:"400px"}} />
                
            </div>
            <div className="product-info" style={{padding:"40px"}}>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: {product.price}</p>
                <p className="product-rating">Rating: {product.rating}</p>
                <div className="btn-group">
                  <button className="cart-btn" onClick={() => addProduct(product)}>
                      Add to Cart
                  </button>
                  <button className="buy-btn" onClick={() => navigate("/checkout", {
                    state: {
                      product: { ...product, quantity: 1 },
                    },
                  })
                  }>Buy Now</button>
                </div> 
            </div>
          </>
        ))}
    </div>
    <div style={{marginLeft:"30px",display:"flex",gap:"50px",marginBottom:"50px"}}>
        <div className="product-details" >
            <p><strong>MRP:</strong> (Inclusive of all taxes)</p>
            <p><strong>Generic Product Name:</strong> </p>
            <p><strong>Marketed By:</strong> Fireboltt.com</p>
            <p><strong>Registered Address:</strong> A-154B, 3rd Floor, Sector – 63, Noida, Uttar Pradesh – 201301 India</p>
            <p><strong>Country Of Origin:</strong> India</p>
        </div>
        <div className="product-details">
           <p><strong>Telephone Number:</strong> 022-69089811</p>
           <p><strong>Email:</strong> help@boltt.com</p>
           <p><strong>Brand Website:</strong> www.fireboltt.com</p>
        </div>
    </div>
    </>
  );
}

export default Accessories
