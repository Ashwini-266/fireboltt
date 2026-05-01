import React from 'react'
import "../css/ProductDisplay.css";
import {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ProductDisplay() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        title: "",
        imageUpload:"",
        category: "",
        description:"",
        price: "",
        quantity: "",
        rating: ""
    });

    useEffect(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then(res=> {
        setProduct(res.data);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
      });
    }, [id]);


  const[count,setCount]=useState(1);
      const increase=()=>{
          setCount(prev => prev + 1);
      }
      const decrease=()=>{
          if (count>1){
          setCount(prev => (prev > 1 ? prev - 1 : 1));
      }
  };

    //add to cart
    const addProduct = async (product) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: product._id,
              quantity: count,
              userId: user._id,
            }),
          });
          alert("Added to cart");
        } catch (err) {
          console.error(err);
        }
      } else {
        let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const existingItem = guestCart.find(
          (item) => item.productId._id === product._id
        );
        if (existingItem) {
          existingItem.quantity += count;
        } else {
          guestCart.push({
            productId: product,
            quantity: count,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        alert("Added to cart");
        navigate("/cart");
      }
    };

  return (
    <div className='container'>
        <div className='product-img'>
            <img src={product.imageUpload} alt={product.title} style={{ width: "500px" }}/>
        </div>

        <div className="details">
            <h3>{product.title}</h3>
            <p><strong>Category:</strong> {product.category}</p>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Rating:</strong> ⭐ {product.rating}</p>
            
            <div className="quantity-box">
                <button onClick={decrease}>-</button>
                <span>{count}</span>
                <button onClick={increase}>+</button>
            </div>

            <div className="btn-group">
                <button className="cart-btn" onClick={() => addProduct(product)}>
                    Add to Cart
                </button>
                <button className="buy-btn" onClick={() => navigate("/checkout", {
                  state: {
                    product: { ...product, quantity: count }
                  }
                  })
                  }
                >Buy Now</button>   
            </div>
        </div>
    </div>

    
  );
}

export default ProductDisplay;
