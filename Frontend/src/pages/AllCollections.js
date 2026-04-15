import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function AllCollections() {
  const navigate=useNavigate();
  const [products, setProducts] = useState([]);
  const [count,setCount]=useState("");

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchdata();
  }, []);

  //add to cart
  const addProduct = async (product) => {
    try {
      await fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: count,
        }),
      });
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  return (  
    <>
    <div className="collection-container">
      <h2 style={{marginTop:"3%",marginBottom:"3%"}}>Fire-Boltt Smart Gadgets</h2>
      <div className="best-grid" >
      {
      products.map((product) => (
      <div className="indivual-product" key={product._id} onClick={()=>navigate(`/ProductDisplay/${product._id}`)}>
        
        <img src={`http://localhost:3001/uploads/${product.imageUpload}`} alt={product.title} style={{ width: "200px" }}/>
        <h3>{product.title}</h3>
        <p>Price: {product.price}</p>
        <p>Rating: {product.rating}</p>
        <button className="home-cart" onClick={(e)=>{ 
          e.stopPropagation();
          addProduct(product)
        }}>Add to Cart</button>
      </div>
      ))
      }
    </div>
  </div>
  </>
  );
}

export default AllCollections